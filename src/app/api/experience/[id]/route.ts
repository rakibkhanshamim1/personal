import { revalidateTag } from "next/cache";
import { requireAdminApi } from "@/lib/auth/dal";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { Experience } from "@/models";
import { experienceSchema } from "@/lib/validations/personal";
import { getExperienceById } from "@/lib/services/experience";
import { mapExperience } from "@/lib/services/mappers";
import { withApiHandler, parseJsonBody, assertSameOrigin, NotFoundError } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";

type Ctx = { params: Promise<{ id: string }> };

export const GET = withApiHandler(async (_req: Request, ctx: Ctx) => {
  const { id } = await ctx.params;
  const item = await getExperienceById(id);
  if (!item) throw new NotFoundError("Experience");
  return ok(item);
});

export const PUT = withApiHandler(async (request: Request, ctx: Ctx) => {
  assertSameOrigin(request);
  await requireAdminApi();
  const { id } = await ctx.params;
  const body = await parseJsonBody(request, experienceSchema);

  await connectAndRegisterModels();
  const doc = await Experience.findByIdAndUpdate(id, body, { new: true }).lean();
  if (!doc) throw new NotFoundError("Experience");

  revalidateTag(CACHE_TAGS.experience, "max");
  return ok(mapExperience(doc));
});

export const DELETE = withApiHandler(async (request: Request, ctx: Ctx) => {
  assertSameOrigin(request);
  await requireAdminApi();
  const { id } = await ctx.params;

  await connectAndRegisterModels();
  const doc = await Experience.findByIdAndDelete(id);
  if (!doc) throw new NotFoundError("Experience");

  revalidateTag(CACHE_TAGS.experience, "max");
  return ok({ message: "Experience deleted" });
});
