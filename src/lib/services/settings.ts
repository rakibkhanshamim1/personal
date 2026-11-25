import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { SiteSettings } from "@/models/site-settings";
import { mapSettings } from "./mappers";
import type { SiteSettingsDTO } from "@/types";

export async function getSettings(): Promise<SiteSettingsDTO> {
  "use cache";
  cacheTag(CACHE_TAGS.settings);
  cacheLife("minutes");

  await connectAndRegisterModels();
  const doc = await SiteSettings.findOne({ key: "primary" }).lean();
  if (!doc) {
    const created = await SiteSettings.create({});
    return mapSettings(created);
  }
  return mapSettings(doc);
}

export async function getSettingsRaw() {
  await connectAndRegisterModels();
  return SiteSettings.findOne({ key: "primary" }).lean();
}
