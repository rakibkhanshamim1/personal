import { requireAdminApi } from "@/lib/auth/dal";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { ContactMessage } from "@/models";
import { messageStatusSchema } from "@/lib/validations/site";
import { getMessageById } from "@/lib/services/messages";
import { mapMessage } from "@/lib/services/mappers";
import { withApiHandler, parseJsonBody, assertSameOrigin, NotFoundError } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";

type Ctx = { params: Promise<{ id: string }> };

export const GET = withApiHandler(async (_req: Request, ctx: Ctx) => {
  await requireAdminApi();
  const { id } = await ctx.params;
  const item = await getMessageById(id);
  if (!item) throw new NotFoundError("Message");
  return ok(item);
});

export const PUT = withApiHandler(async (request: Request, ctx: Ctx) => {
  assertSameOrigin(request);
  await requireAdminApi();
  const { id } = await ctx.params;
  const body = await parseJsonBody(request, messageStatusSchema);

  await connectAndRegisterModels();
  const doc = await ContactMessage.findByIdAndUpdate(id, body, { new: true }).lean();
  if (!doc) throw new NotFoundError("Message");

  return ok(mapMessage(doc));
});

export const DELETE = withApiHandler(async (request: Request, ctx: Ctx) => {
  assertSameOrigin(request);
  await requireAdminApi();
  const { id } = await ctx.params;

  await connectAndRegisterModels();
  const doc = await ContactMessage.findByIdAndDelete(id);
  if (!doc) throw new NotFoundError("Message");

  return ok({ message: "Message deleted" });
});
