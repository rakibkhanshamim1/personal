import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedProjectBySlug } from "@/lib/services/projects";
import { Badge } from "@/components/ui/badge";
import { LazyImage } from "@/components/ui/lazy-image";
import { ArrowLeft, ExternalLink, GitFork, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const instant = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.seo.seoTitle || project.title,
    description: project.seo.seoDescription || project.summary,
    openGraph: {
      title: project.seo.seoTitle || project.title,
      description: project.seo.seoDescription || project.summary,
      images: project.seo.seoImage || project.coverImage ? [{ url: project.seo.seoImage || project.coverImage }] : [],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-20">
      <Link href="/projects" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to projects
      </Link>

      <h1 className="text-3xl font-bold">{project.title}</h1>
      <p className="mt-2 text-muted">{project.summary}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {project.category && <Badge>{project.category.name}</Badge>}
        {project.startDate && (
          <span className="flex items-center gap-1 text-xs text-muted">
            <Calendar className="h-3 w-3" /> {formatDate(project.startDate)}
          </span>
        )}
        <div className="flex gap-3 ml-auto">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-contrast hover:bg-primary-hover">
              <ExternalLink className="h-3.5 w-3.5" /> Live Demo
            </a>
          )}
          {project.sourceUrl && (
            <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-border-base px-4 py-2 text-xs font-medium hover:bg-muted-surface">
              <GitFork className="h-3.5 w-3.5" /> Source Code
            </a>
          )}
        </div>
      </div>

      {project.coverImage && (
        <LazyImage
          src={project.coverImage}
          alt={project.title}
          wrapperClassName="mt-8 aspect-video rounded-xl border border-border-base"
          className="w-full h-full object-cover"
        />
      )}

      {project.technologies.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {project.technologies.map((t) => <Badge key={t} variant="primary">{t}</Badge>)}
        </div>
      )}

      {project.description && (
        <div className="mt-8 prose" dangerouslySetInnerHTML={{ __html: project.description }} />
      )}

      {project.gallery && project.gallery.length > 0 && (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {project.gallery.map((imgUrl, i) => (
            <LazyImage
              key={i}
              src={imgUrl}
              alt={`${project.title} screenshot ${i + 1}`}
              wrapperClassName="aspect-video rounded-lg border border-border-base"
              className="w-full h-full object-cover"
            />
          ))}
        </div>
      )}
    </div>
  );
}
