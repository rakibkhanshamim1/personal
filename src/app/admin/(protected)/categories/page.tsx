"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Modal } from "@/components/ui/modal";
import { Spinner } from "@/components/ui/loading";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";
import type { CategoryDTO } from "@/types";

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<CategoryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryDTO | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/categories");
    const json = await res.json();
    if (json.success) setItems(json.data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const body = { name: fd.get("name"), slug: fd.get("slug"), kind: fd.get("kind"), description: fd.get("description"), color: fd.get("color") };
    const url = editing ? `/api/categories/${editing.id}` : "/api/categories";
    const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) { toast.error(json.error ?? "Failed"); return; }
    toast.success(editing ? "Updated" : "Created");
    setModalOpen(false); setEditing(null); load();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setSaving(true);
    const res = await fetch(`/api/categories/${deleteTarget}`, { method: "DELETE" });
    const json = await res.json();
    setSaving(false); setDeleteTarget(null);
    if (!res.ok) { toast.error(json.error ?? "Failed"); return; }
    toast.success("Deleted"); load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={() => { setEditing(null); setModalOpen(true); }}><Plus className="h-4 w-4" /> New Category</Button>
      </div>

      {loading ? <div className="flex justify-center py-16"><Spinner className="h-8 w-8" /></div> : (
        <div className="overflow-x-auto rounded-xl border border-border-base">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs text-muted uppercase"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Kind</th><th className="px-4 py-3">Usage</th><th className="px-4 py-3 w-24">Actions</th></tr></thead>
            <tbody className="divide-y divide-border-base">
              {items.map((c) => (
                <tr key={c.id} className="hover:bg-muted-surface/50">
                  <td className="px-4 py-3 font-medium flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: c.color }} />{c.name}</td>
                  <td className="px-4 py-3"><Badge>{c.kind}</Badge></td>
                  <td className="px-4 py-3 text-muted">{c.usageCount ?? 0} items</td>
                  <td className="px-4 py-3"><div className="flex gap-1">
                    <button type="button" onClick={() => { setEditing(c); setModalOpen(true); }} className="p-1.5 rounded hover:bg-muted-surface text-muted hover:text-foreground"><Pencil className="h-4 w-4" /></button>
                    <button type="button" onClick={() => setDeleteTarget(c.id)} className="p-1.5 rounded hover:bg-danger/10 text-muted hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} title={editing ? "Edit Category" : "New Category"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="text-sm font-medium">Name</label><Input name="name" defaultValue={editing?.name} required onChange={(e) => {
            if (!editing) { const s = e.currentTarget.form?.elements.namedItem("slug") as HTMLInputElement; if (s) s.value = slugify(e.target.value); }
          }} /></div>
          <div><label className="text-sm font-medium">Slug</label><Input name="slug" defaultValue={editing?.slug} required /></div>
          <div><label className="text-sm font-medium">Kind</label>
            <Select name="kind" defaultValue={editing?.kind ?? "project"} disabled={!!editing}><option value="project">Project</option><option value="blog">Blog</option><option value="video">Video</option></Select>
          </div>
          <div><label className="text-sm font-medium">Description</label><Input name="description" defaultValue={editing?.description} /></div>
          <div><label className="text-sm font-medium">Color</label><Input name="color" type="color" defaultValue={editing?.color ?? "#06b6d4"} /></div>
          <div className="flex justify-end gap-3"><Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</Button></div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={saving} title="Delete category?" description="Items using this category must be reassigned first." />
    </div>
  );
}
