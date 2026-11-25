import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { BlogPostDTO } from "@/types";

export function LatestBlog({ posts }: { posts: BlogPostDTO[] }) {
  if (!posts.length) return null;

  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold">
              Latest <span className="text-primary">Blog Posts</span>
            </h2>
            <p className="mt-1 text-muted">Thoughts and tutorials</p>
          </div>
          <Link
            href="/blog"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <article
              key={p.id}
              className="group rounded-xl border border-border-base bg-surface overflow-hidden hover:border-primary/40 transition-colors"
            >
              {p.coverImage && (
                <Link href={`/blog/${p.slug}`} className="block aspect-video relative overflow-hidden">
                  <Image
                    src={p.coverImage}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </Link>
              )}
              <div className="p-5">
                <div className="flex items-center gap-3 text-xs text-muted mb-2">
                  {p.publishedAt && <span>{formatDate(p.publishedAt)}</span>}
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {p.readingTime} min read
                  </span>
                </div>
                <Link href={`/blog/${p.slug}`}>
                  <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                    {p.title}
                  </h3>
                </Link>
                <p className="mt-1 text-sm text-muted line-clamp-2">{p.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
