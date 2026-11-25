import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { Skill } from "@/models/skill";
import { mapSkill } from "./mappers";
import type { SkillDTO } from "@/types";

export async function getSkills(): Promise<SkillDTO[]> {
  "use cache";
  cacheTag(CACHE_TAGS.skills);
  cacheLife("minutes");

  await connectAndRegisterModels();
  const docs = await Skill.find().sort({ group: 1, order: 1, name: 1 }).lean();
  return docs.map(mapSkill);
}

export async function getSkillById(id: string): Promise<SkillDTO | null> {
  await connectAndRegisterModels();
  const doc = await Skill.findById(id).lean();
  return doc ? mapSkill(doc) : null;
}
