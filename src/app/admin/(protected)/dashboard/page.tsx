"use client";

import { useEffect, useState } from "react";
import { FolderOpen, FileText, Video, Mail, Image as ImageIcon, Tags } from "lucide-react";
import { formatBytes, formatRelative } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/loading";

type Stats = {
  projects: { total: number; published: number; draft: number; featured: number };
  blog: { total: number; published: number; draft: number; featured: number };
  videos: { total: number; published: number; draft: number; featured: number };
  messages: { total: number; unread: number; read: number; archived: number };
  media: { total: number; totalSize: number };
  taxonomy: { categories: number; tags: number };
};

type ActivityItem = { id: string; type: string; title: string; status: string; href: string; timestamp: string };

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard").then((r) => r.json()),
      fetch("/api/contact?status=unread&limit=1").then((r) => r.json()),
    ]).then(([dash, msgs]) => {
      if (dash.success) {
        setStats(dash.data.stats);
        setActivity(dash.data.activity ?? []);
      }
      if (msgs.success) setUnread(msgs.meta?.total ?? 0);
      setLoading(false);
    });
  }, []);

  if (loading || !stats) {
    return <div className="flex justify-center py-16"><Spinner className="h-8 w-8" /></div>;
  }

  const cards = [
    { label: "Projects", icon: <FolderOpen className="h-5 w-5" />, total: stats.projects.total, published: stats.projects.published, draft: stats.projects.draft },
    { label: "Blog Posts", icon: <FileText className="h-5 w-5" />, total: stats.blog.total, published: stats.blog.published, draft: stats.blog.draft },
    { label: "Videos", icon: <Video className="h-5 w-5" />, total: stats.videos.total, published: stats.videos.published, draft: stats.videos.draft },
    { label: "Messages", icon: <Mail className="h-5 w-5" />, total: stats.messages.total, extra: `${unread} unread` },
    { label: "Media", icon: <ImageIcon className="h-5 w-5" />, total: stats.media.total, extra: formatBytes(stats.media.totalSize) },
    { label: "Taxonomy", icon: <Tags className="h-5 w-5" />, total: stats.taxonomy.categories + stats.taxonomy.tags, extra: `${stats.taxonomy.categories} cat / ${stats.taxonomy.tags} tags` },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-border-base bg-surface p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted">{c.label}</span>
              <div className="text-primary">{c.icon}</div>
            </div>
            <div className="text-2xl font-bold">{c.total}</div>
            {"published" in c && (
              <p className="text-xs text-muted mt-1">{c.published} published · {c.draft} draft</p>
            )}
            {"extra" in c && <p className="text-xs text-muted mt-1">{c.extra}</p>}
          </div>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        {activity.length === 0 ? (
          <p className="text-sm text-muted">No activity yet.</p>
        ) : (
          <div className="space-y-2">
            {activity.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="flex items-center justify-between rounded-lg border border-border-base bg-surface p-3 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Badge variant={item.status === "published" ? "success" : item.status === "unread" ? "warning" : "default"}>
                    {item.type}
                  </Badge>
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
                <span className="text-xs text-muted">{formatRelative(item.timestamp)}</span>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
