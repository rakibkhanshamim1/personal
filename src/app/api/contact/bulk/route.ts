import { requireAdminApi } from "@/lib/auth/dal";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { ContactMessage } from "@/models";
import { bulkIdsSchema } from "@/lib/validations/common";
import { withApiHandler, parseJsonBody, assertSameOrigin } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";

export const DELETE = withApiHandler(async (request: Request) => {
  assertSameOrigin(request);
  await requireAdminApi();
  const { ids } = await parseJsonBody(request, bulkIdsSchema);

  await connectAndRegisterModels();
  const result = await ContactMessage.deleteMany({ _id: { $in: ids } });

  return ok({ deleted: result.deletedCount });
});
