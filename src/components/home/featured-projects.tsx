import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink, GitFork } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ProjectDTO } from "@/types";

export function FeaturedProjects({ projects }: { projects: ProjectDTO[] }) {
  if (!projects.length) return null;

  return (
    <section className="py-20 bg-surface">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold">
              Featured <span className="text-primary">Projects</span>
            </h2>
            <p className="mt-1 text-muted">Some of my recent work</p>
          </div>
          <Link
            href="/projects"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((p) => (
            <article
              key={p.id}
              className="group rounded-xl border border-border-base bg-background overflow-hidden hover:border-primary/40 transition-colors"
            >
              {p.coverImage && (
                <Link href={`/projects/${p.slug}`} className="block aspect-video relative overflow-hidden">
                  <Image
                    src={p.coverImage}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </Link>
              )}
              <div className="p-5">
                <Link href={`/projects/${p.slug}`}>
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                    {p.title}
                  </h3>
                </Link>
                <p className="mt-1 text-sm text-muted line-clamp-2">{p.summary}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.technologies.slice(0, 4).map((t) => (
                    <Badge key={t} variant="primary">{t}</Badge>
                  ))}
                </div>
                <div className="mt-4 flex gap-3">
                  {p.liveUrl && (
                    <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  {p.sourceUrl && (
                    <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition-colors">
                      <GitFork className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/projects" className="text-sm font-medium text-primary">
            View all projects →
          </Link>
        </div>
      </div>
    </section>
  );
}
