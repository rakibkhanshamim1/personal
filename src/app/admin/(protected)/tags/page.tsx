"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Modal } from "@/components/ui/modal";
import { Spinner } from "@/components/ui/loading";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";
import type { TagDTO } from "@/types";

export default function AdminTagsPage() {
  const [items, setItems] = useState<TagDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TagDTO | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() { setLoading(true); const r = await fetch("/api/tags"); const j = await r.json(); if (j.success) setItems(j.data); setLoading(false); }
  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setSaving(true);
    const fd = new FormData(e.currentTarget);
    const body = { name: fd.get("name"), slug: fd.get("slug") };
    const url = editing ? `/api/tags/${editing.id}` : "/api/tags";
    const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json(); setSaving(false);
    if (!res.ok) { toast.error(json.error ?? "Failed"); return; }
    toast.success(editing ? "Updated" : "Created"); setModalOpen(false); setEditing(null); load();
  }

  async function handleDelete() {
    if (!deleteTarget) return; setSaving(true);
    const res = await fetch(`/api/tags/${deleteTarget}`, { method: "DELETE" });
    const json = await res.json(); setSaving(false); setDeleteTarget(null);
    if (!res.ok) { toast.error(json.error ?? "Failed"); return; }
    toast.success("Deleted"); load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tags</h1>
        <Button onClick={() => { setEditing(null); setModalOpen(true); }}><Plus className="h-4 w-4" /> New Tag</Button>
      </div>
      {loading ? <div className="flex justify-center py-16"><Spinner className="h-8 w-8" /></div> : (
        <div className="overflow-x-auto rounded-xl border border-border-base">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs text-muted uppercase"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Slug</th><th className="px-4 py-3">Posts</th><th className="px-4 py-3 w-24">Actions</th></tr></thead>
            <tbody className="divide-y divide-border-base">
              {items.map((t) => (
                <tr key={t.id} className="hover:bg-muted-surface/50">
                  <td className="px-4 py-3 font-medium">{t.name}</td>
                  <td className="px-4 py-3 text-muted">{t.slug}</td>
                  <td className="px-4 py-3 text-muted">{t.usageCount ?? 0}</td>
                  <td className="px-4 py-3"><div className="flex gap-1">
                    <button type="button" onClick={() => { setEditing(t); setModalOpen(true); }} className="p-1.5 rounded hover:bg-muted-surface text-muted hover:text-foreground"><Pencil className="h-4 w-4" /></button>
                    <button type="button" onClick={() => setDeleteTarget(t.id)} className="p-1.5 rounded hover:bg-danger/10 text-muted hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} title={editing ? "Edit Tag" : "New Tag"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="text-sm font-medium">Name</label><Input name="name" defaultValue={editing?.name} required onChange={(e) => { if (!editing) { const s = e.currentTarget.form?.elements.namedItem("slug") as HTMLInputElement; if (s) s.value = slugify(e.target.value); }}} /></div>
          <div><label className="text-sm font-medium">Slug</label><Input name="slug" defaultValue={editing?.slug} required /></div>
          <div className="flex justify-end gap-3"><Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</Button></div>
        </form>
      </Modal>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={saving} title="Delete tag?" description="Blog posts using this tag must be updated first." />
    </div>
  );
}
