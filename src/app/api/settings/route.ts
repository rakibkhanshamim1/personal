import { revalidateTag } from "next/cache";
import { requireAdminApi } from "@/lib/auth/dal";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { SiteSettings } from "@/models";
import { siteSettingsUpdateSchema } from "@/lib/validations/site";
import { getSettings } from "@/lib/services/settings";
import { mapSettings } from "@/lib/services/mappers";
import { withApiHandler, parseJsonBody, assertSameOrigin } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";

export const GET = withApiHandler(async () => {
  return ok(await getSettings());
});

export const PUT = withApiHandler(async (request: Request) => {
  assertSameOrigin(request);
  await requireAdminApi();
  const body = await parseJsonBody(request, siteSettingsUpdateSchema);

  await connectAndRegisterModels();
  const doc = await SiteSettings.findOneAndUpdate({ key: "primary" }, body, {
    new: true,
    upsert: true,
  }).lean();

  revalidateTag(CACHE_TAGS.settings, "max");
  return ok(mapSettings(doc!));
});
