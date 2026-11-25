import { requireAdminApi } from "@/lib/auth/dal";
import { withApiHandler } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";

export const GET = withApiHandler(async () => {
  const admin = await requireAdminApi();
  return ok(admin);
});
