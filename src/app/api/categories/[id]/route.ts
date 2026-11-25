import { revalidateTag } from "next/cache";
import { requireAdminApi } from "@/lib/auth/dal";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { Category } from "@/models";
import { categoryUpdateSchema } from "@/lib/validations/content";
import { getCategoryById, categoryUsageCount } from "@/lib/services/categories";
import { mapCategory } from "@/lib/services/mappers";
import { withApiHandler, parseJsonBody, assertSameOrigin, NotFoundError, ApiError } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";

type Ctx = { params: Promise<{ id: string }> };

export const GET = withApiHandler(async (_req: Request, ctx: Ctx) => {
  const { id } = await ctx.params;
  const item = await getCategoryById(id);
  if (!item) throw new NotFoundError("Category");
  return ok(item);
});

export const PUT = withApiHandler(async (request: Request, ctx: Ctx) => {
  assertSameOrigin(request);
  await requireAdminApi();
  const { id } = await ctx.params;
  const body = await parseJsonBody(request, categoryUpdateSchema);

  await connectAndRegisterModels();
  const doc = await Category.findByIdAndUpdate(id, body, { new: true }).lean();
  if (!doc) throw new NotFoundError("Category");

  revalidateTag(CACHE_TAGS.categories, "max");
  return ok(mapCategory(doc));
});

export const DELETE = withApiHandler(async (request: Request, ctx: Ctx) => {
  assertSameOrigin(request);
  await requireAdminApi();
  const { id } = await ctx.params;

  await connectAndRegisterModels();
  const doc = await Category.findById(id).lean();
  if (!doc) throw new NotFoundError("Category");

  const count = await categoryUsageCount(id, doc.kind);
  if (count > 0) {
    throw new ApiError(
      `Cannot delete: ${count} item(s) use this category. Reassign them first.`,
      409,
    );
  }

  await Category.findByIdAndDelete(id);
  revalidateTag(CACHE_TAGS.categories, "max");
  return ok({ message: "Category deleted" });
});
