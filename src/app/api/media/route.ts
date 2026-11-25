import { revalidateTag } from "next/cache";
import { requireAdminApi } from "@/lib/auth/dal";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { Media } from "@/models";
import { listQuerySchema } from "@/lib/validations/common";
import { getMediaItems } from "@/lib/services/media";
import { mapMedia } from "@/lib/services/mappers";
import { uploadFile } from "@/lib/services/upload";
import { withApiHandler, ApiError } from "@/lib/api/handler";
import { ok, created } from "@/lib/api/response";
import type { NextRequest } from "next/server";

export const GET = withApiHandler(async (request: NextRequest) => {
  await requireAdminApi();
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const query = listQuerySchema.parse(params);
  const result = await getMediaItems(query);
  return ok(result.items, { meta: result.meta });
});

export const POST = withApiHandler(async (request: Request) => {
  const admin = await requireAdminApi();

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) throw new ApiError("No file provided", 400);

  const result = await uploadFile(file);

  await connectAndRegisterModels();
  const doc = await Media.create({ ...result, uploadedBy: admin.id });

  revalidateTag(CACHE_TAGS.media, "max");
  return created(mapMedia(doc));
});
