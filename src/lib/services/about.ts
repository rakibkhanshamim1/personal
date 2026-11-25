import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { About } from "@/models/about";
import { mapAbout } from "./mappers";
import type { AboutDTO } from "@/types";

export async function getAbout(): Promise<AboutDTO | null> {
  "use cache";
  cacheTag(CACHE_TAGS.about);
  cacheLife("minutes");

  await connectAndRegisterModels();
  const doc = await About.findOne({ key: "primary" }).lean();
  return doc ? mapAbout(doc) : null;
}

export async function getAboutRaw() {
  await connectAndRegisterModels();
  return About.findOne({ key: "primary" }).lean();
}
