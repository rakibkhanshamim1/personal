import { revalidateTag } from "next/cache";
import { requireAdminApi } from "@/lib/auth/dal";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { Category } from "@/models";
import { categorySchema } from "@/lib/validations/content";
import { getAllCategoriesWithCount, getCategoriesByKind } from "@/lib/services/categories";
import { mapCategory } from "@/lib/services/mappers";
import { withApiHandler, parseJsonBody, assertSameOrigin } from "@/lib/api/handler";
import { ok, created } from "@/lib/api/response";
import type { NextRequest } from "next/server";
import type { CategoryKind } from "@/types";

export const GET = withApiHandler(async (request: NextRequest) => {
  const kind = request.nextUrl.searchParams.get("kind") as CategoryKind | null;
  const isAdmin = !!(await requireAdminApi().catch(() => null));

  if (isAdmin) {
    const cats = await getAllCategoriesWithCount();
    return ok(cats);
  }

  if (kind) return ok(await getCategoriesByKind(kind));
  return ok(await getAllCategoriesWithCount());
});

export const POST = withApiHandler(async (request: Request) => {
  assertSameOrigin(request);
  await requireAdminApi();
  const body = await parseJsonBody(request, categorySchema);

  await connectAndRegisterModels();
  const doc = await Category.create(body);

  revalidateTag(CACHE_TAGS.categories, "max");
  return created(mapCategory(doc));
});
