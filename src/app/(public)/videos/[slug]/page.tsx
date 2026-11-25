import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedVideoBySlug } from "@/lib/services/videos";
import { ArrowLeft } from "lucide-react";
import { PLATFORM_LABELS } from "@/lib/utils/video";
import { Badge } from "@/components/ui/badge";

export const instant = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const video = await getPublishedVideoBySlug(slug);
  if (!video) return {};
  return {
    title: video.seo.seoTitle || video.title,
    description: video.seo.seoDescription || video.description,
    openGraph: {
      title: video.seo.seoTitle || video.title,
      description: video.seo.seoDescription || video.description,
      type: "video.other",
      images: video.seo.seoImage || video.thumbnail ? [{ url: video.seo.seoImage || video.thumbnail }] : [],
    },
  };
}

export default async function VideoPage({ params }: Props) {
  const { slug } = await params;
  const video = await getPublishedVideoBySlug(slug);
  if (!video) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-20">
      <Link href="/videos" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to videos
      </Link>

      <h1 className="text-3xl font-bold">{video.title}</h1>
      <div className="mt-2 flex items-center gap-3 text-sm text-muted">
        <Badge variant="primary">{PLATFORM_LABELS[video.platform]}</Badge>
        {video.category && <Badge>{video.category.name}</Badge>}
      </div>

      <div className="mt-8 aspect-video rounded-xl overflow-hidden border border-border-base bg-black">
        {video.platform === "direct" ? (
          <video src={video.videoUrl} controls className="w-full h-full" />
        ) : (
          <iframe
            src={video.embedUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        )}
      </div>

      {video.description && (
        <div className="mt-8 prose" dangerouslySetInnerHTML={{ __html: video.description }} />
      )}
    </div>
  );
}
