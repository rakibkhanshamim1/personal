import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { Experience } from "@/models/experience";
import { mapExperience } from "./mappers";
import type { ExperienceDTO } from "@/types";

export async function getExperiences(): Promise<ExperienceDTO[]> {
  "use cache";
  cacheTag(CACHE_TAGS.experience);
  cacheLife("minutes");

  await connectAndRegisterModels();
  const docs = await Experience.find().sort({ order: 1, startDate: -1 }).lean();
  return docs.map(mapExperience);
}

export async function getExperienceById(id: string): Promise<ExperienceDTO | null> {
  await connectAndRegisterModels();
  const doc = await Experience.findById(id).lean();
  return doc ? mapExperience(doc) : null;
}
