import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { Category } from "@/models/category";
import { Project } from "@/models/project";
import { BlogPost } from "@/models/blog-post";
import { Video } from "@/models/video";
import { mapCategory } from "./mappers";
import type { CategoryDTO, CategoryKind } from "@/types";

export async function getCategoriesByKind(kind: CategoryKind): Promise<CategoryDTO[]> {
  "use cache";
  cacheTag(CACHE_TAGS.categories);
  cacheLife("minutes");

  await connectAndRegisterModels();
  const docs = await Category.find({ kind }).sort({ name: 1 }).lean();
  return docs.map(mapCategory);
}

export async function getAllCategories(): Promise<CategoryDTO[]> {
  await connectAndRegisterModels();
  const docs = await Category.find().sort({ kind: 1, name: 1 }).lean();
  return docs.map(mapCategory);
}

export async function getAllCategoriesWithCount(): Promise<CategoryDTO[]> {
  await connectAndRegisterModels();
  const docs = await Category.find().sort({ kind: 1, name: 1 }).lean();

  const counts = await Promise.all(
    docs.map(async (doc) => {
      const id = doc._id;
      let count = 0;
      if (doc.kind === "project") count = await Project.countDocuments({ category: id });
      else if (doc.kind === "blog") count = await BlogPost.countDocuments({ category: id });
      else if (doc.kind === "video") count = await Video.countDocuments({ category: id });
      return count;
    }),
  );

  return docs.map((doc, i) => ({ ...mapCategory(doc), usageCount: counts[i] }));
}

export async function getCategoryById(id: string): Promise<CategoryDTO | null> {
  await connectAndRegisterModels();
  const doc = await Category.findById(id).lean();
  return doc ? mapCategory(doc) : null;
}

export async function categoryUsageCount(id: string, kind: CategoryKind): Promise<number> {
  await connectAndRegisterModels();
  if (kind === "project") return Project.countDocuments({ category: id });
  if (kind === "blog") return BlogPost.countDocuments({ category: id });
  return Video.countDocuments({ category: id });
}
