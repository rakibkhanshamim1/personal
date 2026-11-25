import { revalidateTag } from "next/cache";
import { requireAdminApi } from "@/lib/auth/dal";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { Project } from "@/models";
import { projectSchema } from "@/lib/validations/content";
import { listQuerySchema } from "@/lib/validations/common";
import { getPublishedProjects, getAllProjects } from "@/lib/services/projects";
import { mapProject } from "@/lib/services/mappers";
import { withApiHandler, parseJsonBody, assertSameOrigin } from "@/lib/api/handler";
import { ok, created } from "@/lib/api/response";
import type { NextRequest } from "next/server";

export const GET = withApiHandler(async (request: NextRequest) => {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const query = listQuerySchema.parse(params);

  const isAdmin = !!(await requireAdminApi().catch(() => null));
  const result = isAdmin ? await getAllProjects(query) : await getPublishedProjects(query);

  return ok(result.items, { meta: result.meta });
});

export const POST = withApiHandler(async (request: Request) => {
  assertSameOrigin(request);
  await requireAdminApi();
  const body = await parseJsonBody(request, projectSchema);

  await connectAndRegisterModels();
  const doc = await Project.create(body);
  const populated = await Project.findById(doc._id).populate("category").lean();

  revalidateTag(CACHE_TAGS.projects, "max");
  return created(mapProject(populated!));
});
