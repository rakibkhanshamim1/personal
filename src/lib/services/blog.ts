import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { BlogPost } from "@/models/blog-post";
import { mapBlogPost } from "./mappers";
import type { BlogPostDTO, Paginated } from "@/types";
import type { ListQuery } from "@/lib/validations/common";
import { readingTimeMinutes, excerptFrom, stripHtml } from "@/lib/utils";

function publishedFilter() {
  return { status: "published" as const, publishedAt: { $lte: new Date() } };
}

export async function getPublishedPosts(query: ListQuery): Promise<Paginated<BlogPostDTO>> {
  "use cache";
  cacheTag(CACHE_TAGS.blog);
  cacheLife("minutes");

  await connectAndRegisterModels();
  const filter: Record<string, unknown> = { ...publishedFilter() };
  if (query.search) filter.$text = { $search: query.search };
  if (query.category) filter.category = query.category;
  if (query.tag) filter.tags = query.tag;
  if (query.featured === "true") filter.featured = true;

  const total = await BlogPost.countDocuments(filter);
  const { page, limit } = query;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const docs = await BlogPost.find(filter)
    .populate("category")
    .populate("tags")
    .populate("author", "name avatar")
    .sort({ publishedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return { items: docs.map(mapBlogPost), meta: { page, limit, total, totalPages } };
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPostDTO | null> {
  "use cache";
  cacheTag(CACHE_TAGS.blogPost(slug), CACHE_TAGS.blog);
  cacheLife("minutes");

  await connectAndRegisterModels();
  const doc = await BlogPost.findOne({ slug, ...publishedFilter() })
    .populate("category")
    .populate("tags")
    .populate("author", "name avatar")
    .lean();
  return doc ? mapBlogPost(doc) : null;
}

export async function getLatestPosts(limit = 3): Promise<BlogPostDTO[]> {
  "use cache";
  cacheTag(CACHE_TAGS.blog);
  cacheLife("minutes");

  await connectAndRegisterModels();
  const docs = await BlogPost.find(publishedFilter())
    .populate("category")
    .populate("tags")
    .populate("author", "name avatar")
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();
  return docs.map(mapBlogPost);
}

export async function getAllPosts(query: ListQuery): Promise<Paginated<BlogPostDTO>> {
  await connectAndRegisterModels();
  const filter: Record<string, unknown> = {};
  if (query.search) filter.$text = { $search: query.search };
  if (query.category) filter.category = query.category;
  if (query.tag) filter.tags = query.tag;
  if (query.featured === "true") filter.featured = true;
  if (query.status && query.status !== "all") filter.status = query.status;

  const total = await BlogPost.countDocuments(filter);
  const { page, limit } = query;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const docs = await BlogPost.find(filter)
    .populate("category")
    .populate("tags")
    .populate("author", "name avatar")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return { items: docs.map(mapBlogPost), meta: { page, limit, total, totalPages } };
}

export async function getPostById(id: string): Promise<BlogPostDTO | null> {
  await connectAndRegisterModels();
  const doc = await BlogPost.findById(id)
    .populate("category")
    .populate("tags")
    .populate("author", "name avatar")
    .lean();
  return doc ? mapBlogPost(doc) : null;
}

export function computeReadingFields(content: string, excerpt: string) {
  const rt = readingTimeMinutes(stripHtml(content));
  const ex = excerpt || excerptFrom(stripHtml(content), 300);
  return { readingTime: rt, excerpt: ex };
}
