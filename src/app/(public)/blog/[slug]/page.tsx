import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublishedPostBySlug } from "@/lib/services/blog";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Calendar as CalendarIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const instant = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.seo.seoTitle || post.title,
    description: post.seo.seoDescription || post.excerpt,
    openGraph: {
      title: post.seo.seoTitle || post.title,
      description: post.seo.seoDescription || post.excerpt,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      images: post.seo.seoImage || post.coverImage ? [{ url: post.seo.seoImage || post.coverImage }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-20">
      <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to blog
      </Link>

      <h1 className="text-3xl font-bold">{post.title}</h1>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted">
        {post.publishedAt && (
          <span className="flex items-center gap-1"><CalendarIcon className="h-3.5 w-3.5" /> {formatDate(post.publishedAt)}</span>
        )}
        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.readingTime} min read</span>
        {post.category && <Badge>{post.category.name}</Badge>}
      </div>

      {post.coverImage && (
        <div className="mt-8 relative aspect-video rounded-xl overflow-hidden border border-border-base">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" sizes="768px" priority />
        </div>
      )}

      <div className="mt-8 prose" dangerouslySetInnerHTML={{ __html: post.content }} />

      {post.tags.length > 0 && (
        <div className="mt-10 pt-6 border-t border-border-base flex flex-wrap gap-2">
          {post.tags.map((t) => <Badge key={t.id} variant="primary">{t.name}</Badge>)}
        </div>
      )}
    </article>
  );
}
