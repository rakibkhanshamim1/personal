import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { Education } from "@/models/education";
import { mapEducation } from "./mappers";
import type { EducationDTO } from "@/types";

export async function getEducations(): Promise<EducationDTO[]> {
  "use cache";
  cacheTag(CACHE_TAGS.education);
  cacheLife("minutes");

  await connectAndRegisterModels();
  const docs = await Education.find().sort({ order: 1, startDate: -1 }).lean();
  return docs.map(mapEducation);
}

export async function getEducationById(id: string): Promise<EducationDTO | null> {
  await connectAndRegisterModels();
  const doc = await Education.findById(id).lean();
  return doc ? mapEducation(doc) : null;
}
