import { cookies } from "next/headers";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { Admin } from "@/models";
import { loginSchema } from "@/lib/validations/auth";
import { signSessionToken, sessionCookieOptions } from "@/lib/auth/session";
import { rateLimit, clientIpFrom, hashIp } from "@/lib/auth/rate-limit";
import {
  withApiHandler,
  parseJsonBody,
  ApiError,
} from "@/lib/api/handler";
import { ok, fail } from "@/lib/api/response";
import { mapAdmin } from "@/lib/services/mappers";
import bcrypt from "bcryptjs";

export const POST = withApiHandler(async (request: Request) => {
  const ip = clientIpFrom(new Headers(request.headers));
  const ipKey = hashIp(ip);

  const rl = rateLimit(`login:${ipKey}`, 5, 15 * 60);
  if (!rl.allowed) {
    return fail("Too many login attempts. Try again later.", 429);
  }

  const body = await parseJsonBody(request, loginSchema);

  await connectAndRegisterModels();
  const admin = await Admin.findOne({ email: body.email }).select("+passwordHash");

  if (!admin) return fail("Invalid email or password", 401);

  if (admin.lockedUntil && admin.lockedUntil > new Date()) {
    return fail("Account is temporarily locked. Try again later.", 423);
  }

  const valid = await bcrypt.compare(body.password, admin.passwordHash);
  if (!valid) {
    admin.failedLoginAttempts += 1;
    if (admin.failedLoginAttempts >= 5) {
      admin.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
    }
    await admin.save();
    return fail("Invalid email or password", 401);
  }

  admin.failedLoginAttempts = 0;
  admin.lockedUntil = null;
  admin.lastLoginAt = new Date();
  await admin.save();

  const token = await signSessionToken({
    sub: String(admin._id),
    email: admin.email,
    name: admin.name,
    role: admin.role,
  });

  const cookieOpts = sessionCookieOptions();
  (await cookies()).set(cookieOpts.name, token, cookieOpts);

  return ok(mapAdmin(admin));
});
