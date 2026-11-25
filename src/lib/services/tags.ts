import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { Tag } from "@/models/tag";
import { BlogPost } from "@/models/blog-post";
import { mapTag } from "./mappers";
import type { TagDTO } from "@/types";

export async function getAllTags(): Promise<TagDTO[]> {
  "use cache";
  cacheTag(CACHE_TAGS.tags);
  cacheLife("minutes");

  await connectAndRegisterModels();
  const docs = await Tag.find().sort({ name: 1 }).lean();
  return docs.map(mapTag);
}

export async function getAllTagsWithCount(): Promise<TagDTO[]> {
  await connectAndRegisterModels();
  const docs = await Tag.find().sort({ name: 1 }).lean();
  const counts = await Promise.all(
    docs.map((doc) => BlogPost.countDocuments({ tags: doc._id })),
  );
  return docs.map((doc, i) => ({ ...mapTag(doc), usageCount: counts[i] }));
}

export async function getTagById(id: string): Promise<TagDTO | null> {
  await connectAndRegisterModels();
  const doc = await Tag.findById(id).lean();
  return doc ? mapTag(doc) : null;
}

export async function tagUsageCount(id: string): Promise<number> {
  await connectAndRegisterModels();
  return BlogPost.countDocuments({ tags: id });
}
