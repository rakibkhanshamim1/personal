import { revalidateTag } from "next/cache";
import { requireAdminApi } from "@/lib/auth/dal";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { Video } from "@/models";
import { videoUpdateSchema } from "@/lib/validations/content";
import { getVideoById } from "@/lib/services/videos";
import { mapVideo } from "@/lib/services/mappers";
import { parseVideoUrl } from "@/lib/utils/video";
import { withApiHandler, parseJsonBody, assertSameOrigin, NotFoundError } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";

type Ctx = { params: Promise<{ id: string }> };

export const GET = withApiHandler(async (_req: Request, ctx: Ctx) => {
  const { id } = await ctx.params;
  await requireAdminApi();
  const item = await getVideoById(id);
  if (!item) throw new NotFoundError("Video");
  return ok(item);
});

export const PUT = withApiHandler(async (request: Request, ctx: Ctx) => {
  assertSameOrigin(request);
  await requireAdminApi();
  const { id } = await ctx.params;
  const body = await parseJsonBody(request, videoUpdateSchema);

  await connectAndRegisterModels();
  const old = await Video.findById(id).lean();
  if (!old) throw new NotFoundError("Video");

  const updates: Record<string, unknown> = { ...body };
  if (body.videoUrl) {
    const info = parseVideoUrl(body.videoUrl);
    updates.platform = info?.platform ?? "direct";
    updates.videoId = info?.videoId ?? "";
    updates.embedUrl = info?.embedUrl ?? body.videoUrl;
    updates.watchUrl = info?.watchUrl ?? body.videoUrl;
    if (!body.thumbnail) updates.thumbnail = info?.thumbnailUrl || "";
  }
  if (body.status === "published" && !old.publishedAt && !body.publishedAt) {
    updates.publishedAt = new Date();
  }

  const doc = await Video.findByIdAndUpdate(id, updates, { new: true }).populate("category").lean();

  revalidateTag(CACHE_TAGS.videos, "max");
  revalidateTag(CACHE_TAGS.video(old.slug), "max");
  if (body.slug && body.slug !== old.slug) revalidateTag(CACHE_TAGS.video(body.slug), "max");

  return ok(mapVideo(doc!));
});

export const DELETE = withApiHandler(async (request: Request, ctx: Ctx) => {
  assertSameOrigin(request);
  await requireAdminApi();
  const { id } = await ctx.params;

  await connectAndRegisterModels();
  const doc = await Video.findByIdAndDelete(id).lean();
  if (!doc) throw new NotFoundError("Video");

  revalidateTag(CACHE_TAGS.videos, "max");
  revalidateTag(CACHE_TAGS.video(doc.slug), "max");
  return ok({ message: "Video deleted" });
});
