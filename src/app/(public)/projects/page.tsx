import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPublishedProjects } from "@/lib/services/projects";
import { getCategoriesByKind } from "@/lib/services/categories";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ExternalLink, GitFork, FolderOpen } from "lucide-react";

export const instant = false;

export const metadata: Metadata = {
  title: "Projects",
  description: "Browse my portfolio of web development projects.",
};

export default async function ProjectsPage(props: { searchParams: Promise<Record<string, string>> }) {
  const sp = await props.searchParams;
  const query = { page: Number(sp.page) || 1, limit: 12, search: sp.search, category: sp.category, tech: sp.tech };
  const [result, categories] = await Promise.all([
    getPublishedProjects(query),
    getCategoriesByKind("project"),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-20">
      <h1 className="text-3xl font-bold">Projects</h1>
      <p className="mt-1 text-muted">Things I&apos;ve built</p>

      {categories.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/projects"
            className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
              !sp.category ? "bg-primary text-primary-contrast border-primary" : "border-border-base text-muted hover:text-foreground"
            }`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/projects?category=${c.id}`}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                sp.category === c.id ? "bg-primary text-primary-contrast border-primary" : "border-border-base text-muted hover:text-foreground"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      {result.items.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-12 w-12" />}
          title="No projects found"
          description="Check back later for new projects."
        />
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {result.items.map((p) => (
            <article key={p.id} className="group rounded-xl border border-border-base bg-surface overflow-hidden hover:border-primary/40 transition-colors">
              {p.coverImage && (
                <Link href={`/projects/${p.slug}`} className="block aspect-video relative overflow-hidden">
                  <Image src={p.coverImage} alt={p.title} fill className="object-cover transition-transform group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                </Link>
              )}
              <div className="p-5">
                <Link href={`/projects/${p.slug}`}>
                  <h2 className="font-semibold group-hover:text-primary transition-colors">{p.title}</h2>
                </Link>
                <p className="mt-1 text-sm text-muted line-clamp-2">{p.summary}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.technologies.slice(0, 3).map((t) => <Badge key={t} variant="primary">{t}</Badge>)}
                </div>
                <div className="mt-3 flex gap-3">
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary text-xs flex items-center gap-1"><ExternalLink className="h-3 w-3" /> Live</a>}
                  {p.sourceUrl && <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary text-xs flex items-center gap-1"><GitFork className="h-3 w-3" /> Code</a>}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
