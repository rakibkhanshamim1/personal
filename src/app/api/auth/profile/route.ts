import { requireAdminApi } from "@/lib/auth/dal";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { Admin } from "@/models";
import { updateProfileSchema } from "@/lib/validations/auth";
import { withApiHandler, parseJsonBody, assertSameOrigin } from "@/lib/api/handler";
import { ok, fail } from "@/lib/api/response";
import { mapAdmin } from "@/lib/services/mappers";

export const PUT = withApiHandler(async (request: Request) => {
  assertSameOrigin(request);
  const admin = await requireAdminApi();
  const body = await parseJsonBody(request, updateProfileSchema);

  await connectAndRegisterModels();
  const doc = await Admin.findByIdAndUpdate(admin.id, body, { new: true });
  if (!doc) return fail("Admin not found", 404);

  return ok(mapAdmin(doc));
});
