import { revalidateTag } from "next/cache";
import { requireAdminApi } from "@/lib/auth/dal";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { BlogPost } from "@/models";
import { blogPostUpdateSchema } from "@/lib/validations/content";
import { getPostById } from "@/lib/services/blog";
import { computeReadingFields } from "@/lib/services/blog";
import { mapBlogPost } from "@/lib/services/mappers";
import { withApiHandler, parseJsonBody, assertSameOrigin, NotFoundError } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";

type Ctx = { params: Promise<{ id: string }> };

export const GET = withApiHandler(async (_req: Request, ctx: Ctx) => {
  const { id } = await ctx.params;
  await requireAdminApi();
  const item = await getPostById(id);
  if (!item) throw new NotFoundError("Blog post");
  return ok(item);
});

export const PUT = withApiHandler(async (request: Request, ctx: Ctx) => {
  assertSameOrigin(request);
  await requireAdminApi();
  const { id } = await ctx.params;
  const body = await parseJsonBody(request, blogPostUpdateSchema);

  await connectAndRegisterModels();
  const old = await BlogPost.findById(id).lean();
  if (!old) throw new NotFoundError("Blog post");

  const updates: Record<string, unknown> = { ...body };
  if (body.content !== undefined) {
    const { readingTime, excerpt } = computeReadingFields(body.content, body.excerpt ?? old.excerpt);
    updates.readingTime = readingTime;
    if (!body.excerpt) updates.excerpt = excerpt;
  }
  if (body.status === "published" && !old.publishedAt && !body.publishedAt) {
    updates.publishedAt = new Date();
  }

  const doc = await BlogPost.findByIdAndUpdate(id, updates, { new: true })
    .populate("category")
    .populate("tags")
    .populate("author", "name avatar")
    .lean();

  revalidateTag(CACHE_TAGS.blog, "max");
  revalidateTag(CACHE_TAGS.blogPost(old.slug), "max");
  if (body.slug && body.slug !== old.slug) revalidateTag(CACHE_TAGS.blogPost(body.slug), "max");

  return ok(mapBlogPost(doc!));
});

export const DELETE = withApiHandler(async (request: Request, ctx: Ctx) => {
  assertSameOrigin(request);
  await requireAdminApi();
  const { id } = await ctx.params;

  await connectAndRegisterModels();
  const doc = await BlogPost.findByIdAndDelete(id).lean();
  if (!doc) throw new NotFoundError("Blog post");

  revalidateTag(CACHE_TAGS.blog, "max");
  revalidateTag(CACHE_TAGS.blogPost(doc.slug), "max");
  return ok({ message: "Blog post deleted" });
});
