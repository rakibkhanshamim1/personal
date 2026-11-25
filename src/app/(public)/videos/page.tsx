import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPublishedVideos } from "@/lib/services/videos";
import { getCategoriesByKind } from "@/lib/services/categories";
import { EmptyState } from "@/components/ui/empty-state";
import { Play, VideoIcon } from "lucide-react";
import { formatDuration } from "@/lib/utils";

export const instant = false;

export const metadata: Metadata = {
  title: "Videos",
  description: "Video tutorials and walkthroughs.",
};

export default async function VideosPage(props: { searchParams: Promise<Record<string, string>> }) {
  const sp = await props.searchParams;
  const query = { page: Number(sp.page) || 1, limit: 12, search: sp.search, category: sp.category };
  const [result, categories] = await Promise.all([
    getPublishedVideos(query),
    getCategoriesByKind("video"),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-20">
      <h1 className="text-3xl font-bold">Videos</h1>
      <p className="mt-1 text-muted">Tutorials and walkthroughs</p>

      {categories.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/videos" className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${!sp.category ? "bg-primary text-primary-contrast border-primary" : "border-border-base text-muted hover:text-foreground"}`}>
            All
          </Link>
          {categories.map((c) => (
            <Link key={c.id} href={`/videos?category=${c.id}`} className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${sp.category === c.id ? "bg-primary text-primary-contrast border-primary" : "border-border-base text-muted hover:text-foreground"}`}>
              {c.name}
            </Link>
          ))}
        </div>
      )}

      {result.items.length === 0 ? (
        <EmptyState icon={<VideoIcon className="h-12 w-12" />} title="No videos yet" description="Check back soon." />
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {result.items.map((v) => (
            <article key={v.id} className="group rounded-xl border border-border-base bg-surface overflow-hidden hover:border-primary/40 transition-colors">
              <Link href={`/videos/${v.slug}`} className="block aspect-video relative overflow-hidden">
                {v.thumbnail ? (
                  <Image src={v.thumbnail} alt={v.title} fill className="object-cover transition-transform group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                ) : (
                  <div className="absolute inset-0 bg-muted-surface" />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-primary/90 p-2.5 text-primary-contrast"><Play className="h-5 w-5" /></div>
                </div>
                {v.duration > 0 && (
                  <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">{formatDuration(v.duration)}</span>
                )}
              </Link>
              <div className="p-5">
                <Link href={`/videos/${v.slug}`}>
                  <h2 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">{v.title}</h2>
                </Link>
                {v.description && <p className="mt-1 text-sm text-muted line-clamp-2">{v.description}</p>}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
