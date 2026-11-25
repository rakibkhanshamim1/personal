import { revalidateTag } from "next/cache";
import { requireAdminApi } from "@/lib/auth/dal";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { Media } from "@/models";
import { mediaUpdateSchema } from "@/lib/validations/site";
import { getMediaById } from "@/lib/services/media";
import { mapMedia } from "@/lib/services/mappers";
import { deleteFile } from "@/lib/services/upload";
import { withApiHandler, parseJsonBody, assertSameOrigin, NotFoundError } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";

type Ctx = { params: Promise<{ id: string }> };

export const GET = withApiHandler(async (_req: Request, ctx: Ctx) => {
  await requireAdminApi();
  const { id } = await ctx.params;
  const item = await getMediaById(id);
  if (!item) throw new NotFoundError("Media");
  return ok(item);
});

export const PUT = withApiHandler(async (request: Request, ctx: Ctx) => {
  assertSameOrigin(request);
  await requireAdminApi();
  const { id } = await ctx.params;
  const body = await parseJsonBody(request, mediaUpdateSchema);

  await connectAndRegisterModels();
  const doc = await Media.findByIdAndUpdate(id, body, { new: true }).lean();
  if (!doc) throw new NotFoundError("Media");

  revalidateTag(CACHE_TAGS.media, "max");
  return ok(mapMedia(doc));
});

export const DELETE = withApiHandler(async (request: Request, ctx: Ctx) => {
  assertSameOrigin(request);
  await requireAdminApi();
  const { id } = await ctx.params;

  await connectAndRegisterModels();
  const doc = await Media.findById(id).lean();
  if (!doc) throw new NotFoundError("Media");

  await deleteFile(doc.publicId, doc.provider);
  await Media.findByIdAndDelete(id);

  revalidateTag(CACHE_TAGS.media, "max");
  return ok({ message: "Media deleted" });
});
