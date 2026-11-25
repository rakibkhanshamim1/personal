import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { Admin } from "@/models";
import type { AdminUserDTO } from "@/types";
import { SESSION_COOKIE, verifySessionToken } from "./session";

/**
 * Data Access Layer for the admin identity.
 *
 * Every protected page, route handler and server action resolves the current
 * admin through here, so authorization is verified next to the data rather than
 * trusted from the client or from the Proxy redirect.
 *
 * `cache()` dedupes the cookie read and database lookup within a single render.
 */
export const getCurrentAdmin = cache(async (): Promise<AdminUserDTO | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);
  if (!session) return null;

  try {
    await connectAndRegisterModels();
    const admin = await Admin.findById(session.sub)
      .select("name email role avatar lastLoginAt")
      .lean();
    if (!admin) return null;

    return {
      id: String(admin._id),
      name: admin.name,
      email: admin.email,
      role: admin.role,
      avatar: admin.avatar ?? "",
      lastLoginAt: admin.lastLoginAt
        ? new Date(admin.lastLoginAt).toISOString()
        : null,
    };
  } catch {
    // A database outage must not be mistaken for a valid session.
    return null;
  }
});

/** Page/layout guard: redirects to the login screen when unauthenticated. */
export async function requireAdmin(redirectTo = "/admin/login"): Promise<AdminUserDTO> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect(redirectTo);
  return admin;
}

export class UnauthorizedError extends Error {
  constructor(message = "Authentication required") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "You do not have permission to perform this action") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/** Route-handler guard: throws, so `withApiHandler` can map it to a 401. */
export async function requireAdminApi(): Promise<AdminUserDTO> {
  const admin = await getCurrentAdmin();
  if (!admin) throw new UnauthorizedError();
  return admin;
}

/** Restricts destructive or account-level operations to owner/admin roles. */
export async function requireRole(
  roles: ReadonlyArray<AdminUserDTO["role"]>,
): Promise<AdminUserDTO> {
  const admin = await requireAdminApi();
  if (!roles.includes(admin.role)) throw new ForbiddenError();
  return admin;
}
