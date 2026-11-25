import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { withApiHandler } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";

export const POST = withApiHandler(async () => {
  (await cookies()).delete(SESSION_COOKIE);
  return ok({ message: "Logged out" });
});
