import { revalidateTag } from "next/cache";
import { requireAdminApi } from "@/lib/auth/dal";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { Education } from "@/models";
import { educationSchema } from "@/lib/validations/personal";
import { getEducations } from "@/lib/services/education";
import { mapEducation } from "@/lib/services/mappers";
import { withApiHandler, parseJsonBody, assertSameOrigin } from "@/lib/api/handler";
import { ok, created } from "@/lib/api/response";

export const GET = withApiHandler(async () => {
  return ok(await getEducations());
});

export const POST = withApiHandler(async (request: Request) => {
  assertSameOrigin(request);
  await requireAdminApi();
  const body = await parseJsonBody(request, educationSchema);

  await connectAndRegisterModels();
  const doc = await Education.create(body);

  revalidateTag(CACHE_TAGS.education, "max");
  return created(mapEducation(doc));
});
