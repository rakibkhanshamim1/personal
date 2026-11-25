import { revalidateTag } from "next/cache";
import { requireAdminApi } from "@/lib/auth/dal";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { Video } from "@/models";
import { videoSchema } from "@/lib/validations/content";
import { listQuerySchema } from "@/lib/validations/common";
import { getPublishedVideos, getAllVideos } from "@/lib/services/videos";
import { mapVideo } from "@/lib/services/mappers";
import { parseVideoUrl } from "@/lib/utils/video";
import { withApiHandler, parseJsonBody, assertSameOrigin } from "@/lib/api/handler";
import { ok, created } from "@/lib/api/response";
import type { NextRequest } from "next/server";

export const GET = withApiHandler(async (request: NextRequest) => {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const query = listQuerySchema.parse(params);

  const isAdmin = !!(await requireAdminApi().catch(() => null));
  const result = isAdmin ? await getAllVideos(query) : await getPublishedVideos(query);

  return ok(result.items, { meta: result.meta });
});

export const POST = withApiHandler(async (request: Request) => {
  assertSameOrigin(request);
  await requireAdminApi();
  const body = await parseJsonBody(request, videoSchema);

  const videoInfo = parseVideoUrl(body.videoUrl);

  await connectAndRegisterModels();
  const doc = await Video.create({
    ...body,
    platform: videoInfo?.platform ?? "direct",
    videoId: videoInfo?.videoId ?? "",
    embedUrl: videoInfo?.embedUrl ?? body.videoUrl,
    watchUrl: videoInfo?.watchUrl ?? body.videoUrl,
    thumbnail: body.thumbnail || videoInfo?.thumbnailUrl || "",
    publishedAt: body.publishedAt ?? (body.status === "published" ? new Date() : null),
  });

  const populated = await Video.findById(doc._id).populate("category").lean();

  revalidateTag(CACHE_TAGS.videos, "max");
  return created(mapVideo(populated!));
});
