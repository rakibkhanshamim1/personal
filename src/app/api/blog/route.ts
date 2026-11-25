import { revalidateTag } from "next/cache";
import { requireAdminApi } from "@/lib/auth/dal";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { BlogPost } from "@/models";
import { blogPostSchema } from "@/lib/validations/content";
import { listQuerySchema } from "@/lib/validations/common";
import { getPublishedPosts, getAllPosts, computeReadingFields } from "@/lib/services/blog";
import { mapBlogPost } from "@/lib/services/mappers";
import { withApiHandler, parseJsonBody, assertSameOrigin } from "@/lib/api/handler";
import { ok, created } from "@/lib/api/response";
import type { NextRequest } from "next/server";

export const GET = withApiHandler(async (request: NextRequest) => {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const query = listQuerySchema.parse(params);

  const isAdmin = !!(await requireAdminApi().catch(() => null));
  const result = isAdmin ? await getAllPosts(query) : await getPublishedPosts(query);

  return ok(result.items, { meta: result.meta });
});

export const POST = withApiHandler(async (request: Request) => {
  assertSameOrigin(request);
  const admin = await requireAdminApi();
  const body = await parseJsonBody(request, blogPostSchema);

  const { readingTime, excerpt } = computeReadingFields(body.content, body.excerpt);

  await connectAndRegisterModels();
  const doc = await BlogPost.create({
    ...body,
    readingTime,
    excerpt,
    author: admin.id,
    publishedAt: body.publishedAt ?? (body.status === "published" ? new Date() : null),
  });

  const populated = await BlogPost.findById(doc._id)
    .populate("category")
    .populate("tags")
    .populate("author", "name avatar")
    .lean();

  revalidateTag(CACHE_TAGS.blog, "max");
  return created(mapBlogPost(populated!));
});
