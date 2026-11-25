import { revalidateTag } from "next/cache";
import { requireAdminApi } from "@/lib/auth/dal";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { Skill } from "@/models";
import { skillSchema } from "@/lib/validations/personal";
import { getSkills } from "@/lib/services/skills";
import { mapSkill } from "@/lib/services/mappers";
import { withApiHandler, parseJsonBody, assertSameOrigin } from "@/lib/api/handler";
import { ok, created } from "@/lib/api/response";

export const GET = withApiHandler(async () => {
  return ok(await getSkills());
});

export const POST = withApiHandler(async (request: Request) => {
  assertSameOrigin(request);
  await requireAdminApi();
  const body = await parseJsonBody(request, skillSchema);

  await connectAndRegisterModels();
  const doc = await Skill.create(body);

  revalidateTag(CACHE_TAGS.skills, "max");
  return created(mapSkill(doc));
});
