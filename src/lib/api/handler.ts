import "server-only";
import { ZodError, type ZodType } from "zod";
import { ForbiddenError, UnauthorizedError } from "@/lib/auth/dal";
import { fail } from "./response";

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string[]>;

  constructor(
    message: string,
    status = 400,
    fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export class NotFoundError extends ApiError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends ApiError {
  constructor(message: string, fieldErrors?: Record<string, string[]>) {
    super(message, 409, fieldErrors);
    this.name = "ConflictError";
  }
}

function zodFieldErrors(error: ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.length ? issue.path.join(".") : "_root";
    (fieldErrors[key] ??= []).push(issue.message);
  }
  return fieldErrors;
}

type MongoServerError = { code?: number; keyPattern?: Record<string, unknown> };

/**
 * Wraps a route handler so every failure leaves through the same envelope and
 * the same status-code mapping, and so no internal error text reaches a client.
 */
export function withApiHandler<Args extends unknown[]>(
  handler: (...args: Args) => Promise<Response>,
) {
  return async (...args: Args): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (error) {
      // Re-throw Next.js prerender errors so the framework handles them
      if (error instanceof Error && (error.message.includes("prerendering") || (error as Error & { digest?: string }).digest === "HANGING_PROMISE_REJECTION")) {
        throw error;
      }
      if (error instanceof ZodError) {
        return fail("Validation failed", 422, zodFieldErrors(error));
      }
      if (error instanceof UnauthorizedError) {
        return fail(error.message, 401);
      }
      if (error instanceof ForbiddenError) {
        return fail(error.message, 403);
      }
      if (error instanceof ApiError) {
        return fail(error.message, error.status, error.fieldErrors);
      }

      // Duplicate key — surface which field collided without leaking the query.
      const mongoError = error as MongoServerError;
      if (mongoError?.code === 11000) {
        const field = Object.keys(mongoError.keyPattern ?? {})[0] ?? "value";
        return fail(`That ${field} is already taken`, 409, {
          [field]: [`This ${field} is already in use`],
        });
      }

      console.error("[api] Unhandled error:", error);
      return fail("Something went wrong. Please try again.", 500);
    }
  };
}

/** Parses and validates a JSON body, throwing a ZodError the wrapper maps to 422. */
export async function parseJsonBody<T>(
  request: Request,
  schema: ZodType<T>,
): Promise<T> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    throw new ApiError("Request body must be valid JSON", 400);
  }
  return schema.parse(raw);
}

/**
 * Rejects cross-site mutations. The session cookie is already `SameSite=Lax`,
 * so this is defence in depth for browsers or proxies that relax that.
 */
export function assertSameOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  // Non-browser clients (curl, server-to-server) send no Origin at all.
  if (!origin) return;

  const host = request.headers.get("host");
  if (!host) throw new ApiError("Missing Host header", 400);

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    throw new ApiError("Invalid Origin header", 403);
  }

  if (originHost !== host) {
    throw new ApiError("Cross-origin request blocked", 403);
  }
}
