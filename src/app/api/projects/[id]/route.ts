import { revalidateTag } from "next/cache";
import { requireAdminApi } from "@/lib/auth/dal";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { Project } from "@/models";
import { projectUpdateSchema } from "@/lib/validations/content";
import { getProjectById } from "@/lib/services/projects";
import { mapProject } from "@/lib/services/mappers";
import { withApiHandler, parseJsonBody, assertSameOrigin, NotFoundError } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";

type Ctx = { params: Promise<{ id: string }> };

export const GET = withApiHandler(async (_req: Request, ctx: Ctx) => {
  const { id } = await ctx.params;
  await requireAdminApi();
  const item = await getProjectById(id);
  if (!item) throw new NotFoundError("Project");
  return ok(item);
});

export const PUT = withApiHandler(async (request: Request, ctx: Ctx) => {
  assertSameOrigin(request);
  await requireAdminApi();
  const { id } = await ctx.params;
  const body = await parseJsonBody(request, projectUpdateSchema);

  await connectAndRegisterModels();
  const old = await Project.findById(id).lean();
  if (!old) throw new NotFoundError("Project");

  const doc = await Project.findByIdAndUpdate(id, body, { new: true }).populate("category").lean();
  revalidateTag(CACHE_TAGS.projects, "max");
  revalidateTag(CACHE_TAGS.project(old.slug), "max");
  if (body.slug && body.slug !== old.slug) revalidateTag(CACHE_TAGS.project(body.slug), "max");

  return ok(mapProject(doc!));
});

export const DELETE = withApiHandler(async (request: Request, ctx: Ctx) => {
  assertSameOrigin(request);
  await requireAdminApi();
  const { id } = await ctx.params;

  await connectAndRegisterModels();
  const doc = await Project.findByIdAndDelete(id).lean();
  if (!doc) throw new NotFoundError("Project");

  revalidateTag(CACHE_TAGS.projects, "max");
  revalidateTag(CACHE_TAGS.project(doc.slug), "max");

  return ok({ message: "Project deleted" });
});
