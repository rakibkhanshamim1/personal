import { SignJWT, jwtVerify } from "jose";
import { env } from "@/lib/env";
import type { AdminRole } from "@/types";

export const SESSION_COOKIE = "portfolio_admin_session";

export type SessionPayload = {
  sub: string;
  email: string;
  name: string;
  role: AdminRole;
};

function secretKey(): Uint8Array {
  return new TextEncoder().encode(env.authSecret);
}

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  const maxAge = env.sessionMaxAge;
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(`${maxAge}s`)
    .setSubject(payload.sub)
    .sign(secretKey());
}

/**
 * Verifies the signature and expiry. Returns null for any invalid token so
 * callers never have to distinguish tampering from plain expiry.
 *
 * Safe to run in the Proxy (Edge) runtime — `jose` uses Web Crypto only.
 */
export async function verifySessionToken(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      algorithms: ["HS256"],
    });
    if (
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string" ||
      typeof payload.role !== "string"
    ) {
      return null;
    }
    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role as AdminRole,
    };
  } catch {
    return null;
  }
}

export function sessionCookieOptions(maxAge = env.sessionMaxAge) {
  return {
    name: SESSION_COOKIE,
    httpOnly: true,
    // `lax` is what blocks cross-site POSTs from carrying the session, which is
    // the CSRF defence for every mutating admin route.
    sameSite: "lax" as const,
    secure: env.isProduction,
    path: "/",
    maxAge,
  };
}
