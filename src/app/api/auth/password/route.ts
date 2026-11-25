import { requireAdminApi } from "@/lib/auth/dal";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { Admin } from "@/models";
import { changePasswordSchema } from "@/lib/validations/auth";
import { withApiHandler, parseJsonBody, assertSameOrigin } from "@/lib/api/handler";
import { ok, fail } from "@/lib/api/response";
import bcrypt from "bcryptjs";

export const PUT = withApiHandler(async (request: Request) => {
  assertSameOrigin(request);
  const admin = await requireAdminApi();
  const body = await parseJsonBody(request, changePasswordSchema);

  await connectAndRegisterModels();
  const doc = await Admin.findById(admin.id).select("+passwordHash");
  if (!doc) return fail("Admin not found", 404);

  const match = await bcrypt.compare(body.currentPassword, doc.passwordHash);
  if (!match) return fail("Current password is incorrect", 400);

  doc.passwordHash = await bcrypt.hash(body.newPassword, 12);
  await doc.save();

  return ok({ message: "Password updated" });
});
