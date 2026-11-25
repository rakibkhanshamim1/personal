import { revalidateTag } from "next/cache";
import { requireAdminApi } from "@/lib/auth/dal";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { Project } from "@/models";
import { bulkIdsSchema } from "@/lib/validations/common";
import { withApiHandler, parseJsonBody, assertSameOrigin } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";

export const DELETE = withApiHandler(async (request: Request) => {
  assertSameOrigin(request);
  await requireAdminApi();
  const { ids } = await parseJsonBody(request, bulkIdsSchema);

  await connectAndRegisterModels();
  const docs = await Project.find({ _id: { $in: ids } }).select("slug").lean();
  await Project.deleteMany({ _id: { $in: ids } });

  revalidateTag(CACHE_TAGS.projects, "max");
  for (const doc of docs) revalidateTag(CACHE_TAGS.project(doc.slug), "max");

  return ok({ deleted: docs.length });
});
