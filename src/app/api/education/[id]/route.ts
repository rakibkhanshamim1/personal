import { revalidateTag } from "next/cache";
import { requireAdminApi } from "@/lib/auth/dal";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { Education } from "@/models";
import { educationSchema } from "@/lib/validations/personal";
import { getEducationById } from "@/lib/services/education";
import { mapEducation } from "@/lib/services/mappers";
import { withApiHandler, parseJsonBody, assertSameOrigin, NotFoundError } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";

type Ctx = { params: Promise<{ id: string }> };

export const GET = withApiHandler(async (_req: Request, ctx: Ctx) => {
  const { id } = await ctx.params;
  const item = await getEducationById(id);
  if (!item) throw new NotFoundError("Education");
  return ok(item);
});

export const PUT = withApiHandler(async (request: Request, ctx: Ctx) => {
  assertSameOrigin(request);
  await requireAdminApi();
  const { id } = await ctx.params;
  const body = await parseJsonBody(request, educationSchema);

  await connectAndRegisterModels();
  const doc = await Education.findByIdAndUpdate(id, body, { new: true }).lean();
  if (!doc) throw new NotFoundError("Education");

  revalidateTag(CACHE_TAGS.education, "max");
  return ok(mapEducation(doc));
});

export const DELETE = withApiHandler(async (request: Request, ctx: Ctx) => {
  assertSameOrigin(request);
  await requireAdminApi();
  const { id } = await ctx.params;

  await connectAndRegisterModels();
  const doc = await Education.findByIdAndDelete(id);
  if (!doc) throw new NotFoundError("Education");

  revalidateTag(CACHE_TAGS.education, "max");
  return ok({ message: "Education deleted" });
});
