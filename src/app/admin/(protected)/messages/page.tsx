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
import { Trash2, Mail, Eye } from "lucide-react";
import { formatRelative } from "@/lib/utils";
import type { ContactMessageDTO } from "@/types";

export default function AdminMessagesPage() {
  const list = useAdminList<ContactMessageDTO>({ url: "/api/contact" });
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { list.fetchItems({ page: 1 }); }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await fetch(`/api/contact/${deleteTarget}`, { method: "DELETE" });
    const json = await res.json();
    setDeleting(false); setDeleteTarget(null);
    if (!res.ok) { return; }
    list.fetchItems({ page: list.meta.page });
  }

  const statusVariant = (s: string) => s === "unread" ? "warning" : s === "read" ? "success" : "default";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <SearchBar value={list.search} onChange={list.setSearch} placeholder="Search messages…" className="max-w-xs" />
        <Button variant="secondary" size="sm" onClick={() => list.fetchItems({ page: 1 })}>Search</Button>
        {list.selected.size > 0 && (
          <Button variant="danger" size="sm" onClick={async () => {
            setDeleting(true);
            await list.bulkDelete(Array.from(list.selected));
            setDeleting(false); list.setSelected(new Set()); list.fetchItems({ page: list.meta.page });
          }} disabled={deleting}>Delete {list.selected.size}</Button>
        )}
      </div>
      {list.loading ? <div className="flex justify-center py-16"><Spinner className="h-8 w-8" /></div> : list.items.length === 0 ? (
        <EmptyState icon={<Mail className="h-12 w-12" />} title="No messages" description="Messages from your contact form will appear here." />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-border-base">
            <table className="w-full text-sm">
              <thead className="bg-surface text-left text-xs text-muted uppercase"><tr>
                <th className="px-4 py-3 w-10"><input type="checkbox" onChange={(e) => { e.target.checked ? list.setSelected(new Set(list.items.map(i => i.id))) : list.setSelected(new Set()); }} /></th>
                <th className="px-4 py-3">From</th><th className="px-4 py-3">Subject</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Received</th><th className="px-4 py-3 w-24">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-border-base">
                {list.items.map((m) => (
                  <tr key={m.id} className="hover:bg-muted-surface/50">
                    <td className="px-4 py-3"><input type="checkbox" checked={list.selected.has(m.id)} onChange={(e) => { const n = new Set(list.selected); e.target.checked ? n.add(m.id) : n.delete(m.id); list.setSelected(n); }} /></td>
                    <td className="px-4 py-3"><div className="font-medium">{m.name}</div><div className="text-xs text-muted">{m.email}</div></td>
                    <td className="px-4 py-3 text-muted">{m.subject || "—"}</td>
                    <td className="px-4 py-3"><Badge variant={statusVariant(m.status)}>{m.status}</Badge></td>
                    <td className="px-4 py-3 text-muted text-xs">{formatRelative(m.createdAt)}</td>
                    <td className="px-4 py-3"><div className="flex gap-1">
                      <Link href={`/admin/messages/${m.id}`} className="p-1.5 rounded hover:bg-muted-surface text-muted hover:text-foreground"><Eye className="h-4 w-4" /></Link>
                      <button type="button" onClick={() => setDeleteTarget(m.id)} className="p-1.5 rounded hover:bg-danger/10 text-muted hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={list.meta.page} totalPages={list.meta.totalPages} onPageChange={(p) => list.fetchItems({ page: p })} />
        </>
      )}
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} title="Delete message?" />
    </div>
  );
}
