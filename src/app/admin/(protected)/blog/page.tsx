"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAdminList } from "@/hooks/use-admin-fetch";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/loading";
import { Plus, Pencil, Trash2, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { BlogPostDTO } from "@/types";

export default function AdminBlogPage() {
  const list = useAdminList<BlogPostDTO>({ url: "/api/blog" });
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { list.fetchItems({ page: 1 }); }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const ok = await list.deleteItem(deleteTarget);
    setDeleting(false); setDeleteTarget(null);
    if (ok) list.fetchItems({ page: list.meta.page });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Link href="/admin/blog/new"><Button><Plus className="h-4 w-4" /> New Post</Button></Link>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <SearchBar value={list.search} onChange={list.setSearch} placeholder="Search posts…" className="max-w-xs" />
        <Button variant="secondary" size="sm" onClick={() => list.fetchItems({ page: 1 })}>Search</Button>
      </div>
      {list.loading ? <div className="flex justify-center py-16"><Spinner className="h-8 w-8" /></div> : list.items.length === 0 ? (
        <EmptyState icon={<FileText className="h-12 w-12" />} title="No posts yet" action={<Link href="/admin/blog/new"><Button size="sm"><Plus className="h-4 w-4" /> Create one</Button></Link>} />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-border-base">
            <table className="w-full text-sm">
              <thead className="bg-surface text-left text-xs text-muted uppercase"><tr><th className="px-4 py-3">Title</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Date</th><th className="px-4 py-3 w-24">Actions</th></tr></thead>
              <tbody className="divide-y divide-border-base">
                {list.items.map((p) => (
                  <tr key={p.id} className="hover:bg-muted-surface/50">
                    <td className="px-4 py-3 font-medium">{p.title}</td>
                    <td className="px-4 py-3"><Badge variant={p.status === "published" ? "success" : "default"}>{p.status}</Badge></td>
                    <td className="px-4 py-3 text-muted">{formatDate(p.createdAt)}</td>
                    <td className="px-4 py-3"><div className="flex gap-1">
                      <Link href={`/admin/blog/${p.id}/edit`} className="p-1.5 rounded hover:bg-muted-surface text-muted hover:text-foreground"><Pencil className="h-4 w-4" /></Link>
                      <button type="button" onClick={() => setDeleteTarget(p.id)} className="p-1.5 rounded hover:bg-danger/10 text-muted hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={list.meta.page} totalPages={list.meta.totalPages} onPageChange={(p) => list.fetchItems({ page: p })} />
        </>
      )}
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} />
    </div>
  );
}
