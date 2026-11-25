import { revalidateTag } from "next/cache";
import { requireAdminApi } from "@/lib/auth/dal";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { Skill } from "@/models";
import { skillUpdateSchema } from "@/lib/validations/personal";
import { getSkillById } from "@/lib/services/skills";
import { mapSkill } from "@/lib/services/mappers";
import { withApiHandler, parseJsonBody, assertSameOrigin, NotFoundError } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";

type Ctx = { params: Promise<{ id: string }> };

export const GET = withApiHandler(async (_req: Request, ctx: Ctx) => {
  const { id } = await ctx.params;
  const item = await getSkillById(id);
  if (!item) throw new NotFoundError("Skill");
  return ok(item);
});

export const PUT = withApiHandler(async (request: Request, ctx: Ctx) => {
  assertSameOrigin(request);
  await requireAdminApi();
  const { id } = await ctx.params;
  const body = await parseJsonBody(request, skillUpdateSchema);

  await connectAndRegisterModels();
  const doc = await Skill.findByIdAndUpdate(id, body, { new: true }).lean();
  if (!doc) throw new NotFoundError("Skill");

  revalidateTag(CACHE_TAGS.skills, "max");
  return ok(mapSkill(doc));
});

export const DELETE = withApiHandler(async (request: Request, ctx: Ctx) => {
  assertSameOrigin(request);
  await requireAdminApi();
  const { id } = await ctx.params;

  await connectAndRegisterModels();
  const doc = await Skill.findByIdAndDelete(id);
  if (!doc) throw new NotFoundError("Skill");

  revalidateTag(CACHE_TAGS.skills, "max");
  return ok({ message: "Skill deleted" });
});
