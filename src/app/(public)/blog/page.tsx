import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPublishedPosts } from "@/lib/services/blog";
import { getCategoriesByKind } from "@/lib/services/categories";
import { getAllTags } from "@/lib/services/tags";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const instant = false;

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles, tutorials and thoughts on web development.",
};

export default async function BlogPage(props: { searchParams: Promise<Record<string, string>> }) {
  const sp = await props.searchParams;
  const query = { page: Number(sp.page) || 1, limit: 12, search: sp.search, category: sp.category, tag: sp.tag };
  const [result, categories, tags] = await Promise.all([
    getPublishedPosts(query),
    getCategoriesByKind("blog"),
    getAllTags(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-20">
      <h1 className="text-3xl font-bold">Blog</h1>
      <p className="mt-1 text-muted">Thoughts, tutorials, and ideas</p>

      {(categories.length > 0 || tags.length > 0) && (
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/blog" className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${!sp.category && !sp.tag ? "bg-primary text-primary-contrast border-primary" : "border-border-base text-muted hover:text-foreground"}`}>
            All
          </Link>
          {categories.map((c) => (
            <Link key={c.id} href={`/blog?category=${c.id}`} className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${sp.category === c.id ? "bg-primary text-primary-contrast border-primary" : "border-border-base text-muted hover:text-foreground"}`}>
              {c.name}
            </Link>
          ))}
        </div>
      )}

      {result.items.length === 0 ? (
        <EmptyState icon={<FileText className="h-12 w-12" />} title="No posts yet" description="Check back soon for new articles." />
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {result.items.map((p) => (
            <article key={p.id} className="group rounded-xl border border-border-base bg-surface overflow-hidden hover:border-primary/40 transition-colors">
              {p.coverImage && (
                <Link href={`/blog/${p.slug}`} className="block aspect-video relative overflow-hidden">
                  <Image src={p.coverImage} alt={p.title} fill className="object-cover transition-transform group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                </Link>
              )}
              <div className="p-5">
                <div className="flex items-center gap-3 text-xs text-muted mb-2">
                  {p.publishedAt && <span>{formatDate(p.publishedAt)}</span>}
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {p.readingTime} min</span>
                </div>
                <Link href={`/blog/${p.slug}`}>
                  <h2 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">{p.title}</h2>
                </Link>
                <p className="mt-1 text-sm text-muted line-clamp-2">{p.excerpt}</p>
                {p.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {p.tags.slice(0, 3).map((t) => <Badge key={t.id}>{t.name}</Badge>)}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
