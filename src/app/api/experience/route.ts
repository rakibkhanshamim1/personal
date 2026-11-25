import { revalidateTag } from "next/cache";
import { requireAdminApi } from "@/lib/auth/dal";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { Experience } from "@/models";
import { experienceSchema } from "@/lib/validations/personal";
import { getExperiences } from "@/lib/services/experience";
import { mapExperience } from "@/lib/services/mappers";
import { withApiHandler, parseJsonBody, assertSameOrigin } from "@/lib/api/handler";
import { ok, created } from "@/lib/api/response";

export const GET = withApiHandler(async () => {
  return ok(await getExperiences());
});

export const POST = withApiHandler(async (request: Request) => {
  assertSameOrigin(request);
  await requireAdminApi();
  const body = await parseJsonBody(request, experienceSchema);

  await connectAndRegisterModels();
  const doc = await Experience.create(body);

  revalidateTag(CACHE_TAGS.experience, "max");
  return created(mapExperience(doc));
});
