import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { Video } from "@/models/video";
import { mapVideo } from "./mappers";
import type { VideoDTO, Paginated } from "@/types";
import type { ListQuery } from "@/lib/validations/common";

function publishedFilter() {
  return { status: "published" as const, publishedAt: { $lte: new Date() } };
}

export async function getPublishedVideos(query: ListQuery): Promise<Paginated<VideoDTO>> {
  "use cache";
  cacheTag(CACHE_TAGS.videos);
  cacheLife("minutes");

  await connectAndRegisterModels();
  const filter: Record<string, unknown> = { ...publishedFilter() };
  if (query.search) filter.$text = { $search: query.search };
  if (query.category) filter.category = query.category;
  if (query.featured === "true") filter.featured = true;

  const total = await Video.countDocuments(filter);
  const { page, limit } = query;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const docs = await Video.find(filter)
    .populate("category")
    .sort({ publishedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return { items: docs.map(mapVideo), meta: { page, limit, total, totalPages } };
}

export async function getPublishedVideoBySlug(slug: string): Promise<VideoDTO | null> {
  "use cache";
  cacheTag(CACHE_TAGS.video(slug), CACHE_TAGS.videos);
  cacheLife("minutes");

  await connectAndRegisterModels();
  const doc = await Video.findOne({ slug, ...publishedFilter() })
    .populate("category")
    .lean();
  return doc ? mapVideo(doc) : null;
}

export async function getFeaturedVideos(limit = 4): Promise<VideoDTO[]> {
  "use cache";
  cacheTag(CACHE_TAGS.videos);
  cacheLife("minutes");

  await connectAndRegisterModels();
  const docs = await Video.find({ ...publishedFilter(), featured: true })
    .populate("category")
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();
  return docs.map(mapVideo);
}

export async function getAllVideos(query: ListQuery): Promise<Paginated<VideoDTO>> {
  await connectAndRegisterModels();
  const filter: Record<string, unknown> = {};
  if (query.search) filter.$text = { $search: query.search };
  if (query.category) filter.category = query.category;
  if (query.featured === "true") filter.featured = true;
  if (query.status && query.status !== "all") filter.status = query.status;

  const total = await Video.countDocuments(filter);
  const { page, limit } = query;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const docs = await Video.find(filter)
    .populate("category")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return { items: docs.map(mapVideo), meta: { page, limit, total, totalPages } };
}

export async function getVideoById(id: string): Promise<VideoDTO | null> {
  await connectAndRegisterModels();
  const doc = await Video.findById(id).populate("category").lean();
  return doc ? mapVideo(doc) : null;
}
