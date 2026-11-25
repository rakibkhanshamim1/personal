import "server-only";
import { cacheLife } from "next/cache";
import { cacheTag } from "next/cache";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { Project } from "@/models/project";
import { mapProject } from "./mappers";
import type { ProjectDTO, Paginated } from "@/types";
import type { ListQuery } from "@/lib/validations/common";

function publishedFilter() {
  return { status: "published" as const };
}

export async function getPublishedProjects(query: ListQuery): Promise<Paginated<ProjectDTO>> {
  "use cache";
  cacheTag(CACHE_TAGS.projects);
  cacheLife("minutes");

  await connectAndRegisterModels();
  const filter: Record<string, unknown> = { ...publishedFilter() };

  if (query.search) filter.$text = { $search: query.search };
  if (query.category) filter.category = query.category;
  if (query.tech) filter.technologies = query.tech;
  if (query.featured === "true") filter.featured = true;

  const total = await Project.countDocuments(filter);
  const limit = query.limit;
  const page = query.page;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  let sortObj: Record<string, 1 | -1> = { order: 1, createdAt: -1 };
  if (query.sort === "newest") sortObj = { createdAt: -1 };
  if (query.sort === "oldest") sortObj = { createdAt: 1 };

  const docs = await Project.find(filter)
    .populate("category")
    .sort(sortObj)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return {
    items: docs.map(mapProject),
    meta: { page, limit, total, totalPages },
  };
}

export async function getPublishedProjectBySlug(slug: string): Promise<ProjectDTO | null> {
  "use cache";
  cacheTag(CACHE_TAGS.project(slug), CACHE_TAGS.projects);
  cacheLife("minutes");

  await connectAndRegisterModels();
  const doc = await Project.findOne({ slug, ...publishedFilter() })
    .populate("category")
    .lean();
  return doc ? mapProject(doc) : null;
}

export async function getFeaturedProjects(limit = 4): Promise<ProjectDTO[]> {
  "use cache";
  cacheTag(CACHE_TAGS.projects);
  cacheLife("minutes");

  await connectAndRegisterModels();
  const docs = await Project.find({ ...publishedFilter(), featured: true })
    .populate("category")
    .sort({ order: 1, createdAt: -1 })
    .limit(limit)
    .lean();
  return docs.map(mapProject);
}

export async function getAllProjects(query: ListQuery): Promise<Paginated<ProjectDTO>> {
  await connectAndRegisterModels();
  const filter: Record<string, unknown> = {};

  if (query.search) filter.$text = { $search: query.search };
  if (query.category) filter.category = query.category;
  if (query.tech) filter.technologies = query.tech;
  if (query.featured === "true") filter.featured = true;
  if (query.status && query.status !== "all") filter.status = query.status;

  const total = await Project.countDocuments(filter);
  const limit = query.limit;
  const page = query.page;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const docs = await Project.find(filter)
    .populate("category")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return {
    items: docs.map(mapProject),
    meta: { page, limit, total, totalPages },
  };
}

export async function getProjectById(id: string): Promise<ProjectDTO | null> {
  await connectAndRegisterModels();
  const doc = await Project.findById(id).populate("category").lean();
  return doc ? mapProject(doc) : null;
}
