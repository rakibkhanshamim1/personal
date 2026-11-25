import { revalidateTag } from "next/cache";
import { requireAdminApi } from "@/lib/auth/dal";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { Tag } from "@/models";
import { tagSchema } from "@/lib/validations/content";
import { getAllTags, getAllTagsWithCount } from "@/lib/services/tags";
import { mapTag } from "@/lib/services/mappers";
import { withApiHandler, parseJsonBody, assertSameOrigin } from "@/lib/api/handler";
import { ok, created } from "@/lib/api/response";

export const GET = withApiHandler(async () => {
  const isAdmin = !!(await requireAdminApi().catch(() => null));
  const tags = isAdmin ? await getAllTagsWithCount() : await getAllTags();
  return ok(tags);
});

export const POST = withApiHandler(async (request: Request) => {
  assertSameOrigin(request);
  await requireAdminApi();
  const body = await parseJsonBody(request, tagSchema);

  await connectAndRegisterModels();
  const doc = await Tag.create(body);

  revalidateTag(CACHE_TAGS.tags, "max");
  return created(mapTag(doc));
});
