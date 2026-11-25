import { revalidateTag } from "next/cache";
import { requireAdminApi } from "@/lib/auth/dal";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { Tag } from "@/models";
import { tagUpdateSchema } from "@/lib/validations/content";
import { getTagById, tagUsageCount } from "@/lib/services/tags";
import { mapTag } from "@/lib/services/mappers";
import { withApiHandler, parseJsonBody, assertSameOrigin, NotFoundError, ApiError } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";

type Ctx = { params: Promise<{ id: string }> };

export const GET = withApiHandler(async (_req: Request, ctx: Ctx) => {
  const { id } = await ctx.params;
  const item = await getTagById(id);
  if (!item) throw new NotFoundError("Tag");
  return ok(item);
});

export const PUT = withApiHandler(async (request: Request, ctx: Ctx) => {
  assertSameOrigin(request);
  await requireAdminApi();
  const { id } = await ctx.params;
  const body = await parseJsonBody(request, tagUpdateSchema);

  await connectAndRegisterModels();
  const doc = await Tag.findByIdAndUpdate(id, body, { new: true }).lean();
  if (!doc) throw new NotFoundError("Tag");

  revalidateTag(CACHE_TAGS.tags, "max");
  return ok(mapTag(doc));
});

export const DELETE = withApiHandler(async (request: Request, ctx: Ctx) => {
  assertSameOrigin(request);
  await requireAdminApi();
  const { id } = await ctx.params;

  await connectAndRegisterModels();
  const doc = await Tag.findById(id).lean();
  if (!doc) throw new NotFoundError("Tag");

  const count = await tagUsageCount(id);
  if (count > 0) {
    throw new ApiError(
      `Cannot delete: ${count} blog post(s) use this tag. Remove them first.`,
      409,
    );
  }

  await Tag.findByIdAndDelete(id);
  revalidateTag(CACHE_TAGS.tags, "max");
  return ok({ message: "Tag deleted" });
});
