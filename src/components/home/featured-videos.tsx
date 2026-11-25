import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import type { VideoDTO } from "@/types";

export function FeaturedVideos({ videos }: { videos: VideoDTO[] }) {
  if (!videos.length) return null;

  return (
    <section className="py-20 bg-surface">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold">
              Featured <span className="text-primary">Videos</span>
            </h2>
            <p className="mt-1 text-muted">Tutorials and walkthroughs</p>
          </div>
          <Link
            href="/videos"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {videos.map((v) => (
            <article
              key={v.id}
              className="group rounded-xl border border-border-base bg-background overflow-hidden hover:border-primary/40 transition-colors"
            >
              <Link href={`/videos/${v.slug}`} className="block aspect-video relative overflow-hidden">
                {v.thumbnail ? (
                  <Image
                    src={v.thumbnail}
                    alt={v.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-muted-surface" />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-primary/90 p-3 text-primary-contrast">
                    <Play className="h-6 w-6" />
                  </div>
                </div>
                {v.duration > 0 && (
                  <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
                    {formatDuration(v.duration)}
                  </span>
                )}
              </Link>
              <div className="p-5">
                <Link href={`/videos/${v.slug}`}>
                  <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                    {v.title}
                  </h3>
                </Link>
                {v.description && (
                  <p className="mt-1 text-sm text-muted line-clamp-2">{v.description}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
