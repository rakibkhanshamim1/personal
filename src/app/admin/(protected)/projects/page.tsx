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
import { Plus, Pencil, Trash2, FolderOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { ProjectDTO } from "@/types";

export default function AdminProjectsPage() {
  const list = useAdminList<ProjectDTO>({ url: "/api/projects" });
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { list.fetchItems({ page: 1 }); }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const ok = await list.deleteItem(deleteTarget);
    setDeleting(false);
    setDeleteTarget(null);
    if (ok) list.fetchItems({ page: list.meta.page });
  }

  async function handleBulkDelete() {
    const ids = Array.from(list.selected);
    if (!ids.length) return;
    setDeleting(true);
    const ok = await list.bulkDelete(ids);
    setDeleting(false);
    if (ok) { list.setSelected(new Set()); list.fetchItems({ page: list.meta.page }); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link href="/admin/projects/new"><Button><Plus className="h-4 w-4" /> New Project</Button></Link>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <SearchBar value={list.search} onChange={(v) => { list.setSearch(v); }} placeholder="Search projects…" className="max-w-xs" />
        <Button variant="secondary" size="sm" onClick={() => list.fetchItems({ page: 1 })}>Search</Button>
        {list.selected.size > 0 && (
          <Button variant="danger" size="sm" onClick={handleBulkDelete} disabled={deleting}>
            Delete {list.selected.size} selected
          </Button>
        )}
      </div>

      {list.loading ? (
        <div className="flex justify-center py-16"><Spinner className="h-8 w-8" /></div>
      ) : list.items.length === 0 ? (
        <EmptyState icon={<FolderOpen className="h-12 w-12" />} title="No projects yet" action={<Link href="/admin/projects/new"><Button size="sm"><Plus className="h-4 w-4" /> Create one</Button></Link>} />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-border-base">
            <table className="w-full text-sm">
              <thead className="bg-surface text-left text-xs text-muted uppercase">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <input type="checkbox" onChange={(e) => {
                      if (e.target.checked) list.setSelected(new Set(list.items.map((i) => i.id)));
                      else list.setSelected(new Set());
                    }} checked={list.selected.size === list.items.length && list.items.length > 0} />
                  </th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Featured</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-base">
                {list.items.map((p) => (
                  <tr key={p.id} className="hover:bg-muted-surface/50">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={list.selected.has(p.id)} onChange={(e) => {
                        const next = new Set(list.selected);
                        e.target.checked ? next.add(p.id) : next.delete(p.id);
                        list.setSelected(next);
                      }} />
                    </td>
                    <td className="px-4 py-3 font-medium">{p.title}</td>
                    <td className="px-4 py-3"><Badge variant={p.status === "published" ? "success" : "default"}>{p.status}</Badge></td>
                    <td className="px-4 py-3">{p.featured && <Badge variant="primary">Featured</Badge>}</td>
                    <td className="px-4 py-3 text-muted">{formatDate(p.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Link href={`/admin/projects/${p.id}/edit`} className="p-1.5 rounded hover:bg-muted-surface text-muted hover:text-foreground"><Pencil className="h-4 w-4" /></Link>
                        <button type="button" onClick={() => setDeleteTarget(p.id)} className="p-1.5 rounded hover:bg-danger/10 text-muted hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={list.meta.page} totalPages={list.meta.totalPages} onPageChange={(p) => list.fetchItems({ page: p })} />
        </>
      )}

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} title="Delete project?" description="This action cannot be undone." />
    </div>
  );
}
