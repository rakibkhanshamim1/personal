import { revalidateTag } from "next/cache";
import { requireAdminApi } from "@/lib/auth/dal";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { About } from "@/models";
import { aboutSchema } from "@/lib/validations/personal";
import { getAbout } from "@/lib/services/about";
import { mapAbout } from "@/lib/services/mappers";
import { withApiHandler, parseJsonBody, assertSameOrigin } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";

export const GET = withApiHandler(async () => {
  const about = await getAbout();
  return ok(about);
});

export const PUT = withApiHandler(async (request: Request) => {
  assertSameOrigin(request);
  await requireAdminApi();
  const body = await parseJsonBody(request, aboutSchema);

  await connectAndRegisterModels();
  const doc = await About.findOneAndUpdate({ key: "primary" }, body, {
    new: true,
    upsert: true,
  }).lean();

  revalidateTag(CACHE_TAGS.about, "max");
  return ok(mapAbout(doc!));
});
