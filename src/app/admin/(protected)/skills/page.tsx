"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Spinner } from "@/components/ui/loading";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { SkillDTO } from "@/types";

export default function AdminSkillsPage() {
  const [items, setItems] = useState<SkillDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SkillDTO | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() { setLoading(true); const r = await fetch("/api/skills"); const j = await r.json(); if (j.success) setItems(j.data); setLoading(false); }
  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setSaving(true);
    const fd = new FormData(e.currentTarget);
    const body = { name: fd.get("name"), group: fd.get("group"), level: Number(fd.get("level")), icon: fd.get("icon"), featured: fd.get("featured") === "on", order: Number(fd.get("order")) || 0 };
    const url = editing ? `/api/skills/${editing.id}` : "/api/skills";
    const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json(); setSaving(false);
    if (!res.ok) { toast.error(json.error ?? "Failed"); return; }
    toast.success(editing ? "Updated" : "Created"); setModalOpen(false); setEditing(null); load();
  }

  async function handleDelete() { if (!deleteTarget) return; setSaving(true); await fetch(`/api/skills/${deleteTarget}`, { method: "DELETE" }); setSaving(false); setDeleteTarget(null); load(); }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Skills</h1>
        <Button onClick={() => { setEditing(null); setModalOpen(true); }}><Plus className="h-4 w-4" /> Add Skill</Button>
      </div>
      {loading ? <div className="flex justify-center py-16"><Spinner className="h-8 w-8" /></div> : (
        <div className="overflow-x-auto rounded-xl border border-border-base">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs text-muted uppercase"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Group</th><th className="px-4 py-3">Level</th><th className="px-4 py-3 w-24">Actions</th></tr></thead>
            <tbody className="divide-y divide-border-base">
              {items.map((s) => (
                <tr key={s.id} className="hover:bg-muted-surface/50">
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3"><Badge variant="primary">{s.group}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2"><div className="h-2 w-24 rounded-full bg-muted-surface overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${s.level}%` }} /></div><span className="text-xs text-muted">{s.level}%</span></div>
                  </td>
                  <td className="px-4 py-3"><div className="flex gap-1">
                    <button type="button" onClick={() => { setEditing(s); setModalOpen(true); }} className="p-1.5 rounded hover:bg-muted-surface text-muted hover:text-foreground"><Pencil className="h-4 w-4" /></button>
                    <button type="button" onClick={() => setDeleteTarget(s.id)} className="p-1.5 rounded hover:bg-danger/10 text-muted hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} title={editing ? "Edit Skill" : "Add Skill"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="text-sm font-medium">Name</label><Input name="name" defaultValue={editing?.name} required /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="text-sm font-medium">Group</label><Select name="group" defaultValue={editing?.group ?? "frontend"}><option value="frontend">Frontend</option><option value="backend">Backend</option><option value="tools">Tools</option><option value="other">Other</option></Select></div>
            <div><label className="text-sm font-medium">Level (0-100)</label><Input name="level" type="number" min={0} max={100} defaultValue={editing?.level ?? 80} required /></div>
          </div>
          <div><label className="text-sm font-medium">Icon</label><Input name="icon" defaultValue={editing?.icon} placeholder="Lucide icon key (optional)" /></div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2"><input type="checkbox" name="featured" id="sk-feat" defaultChecked={editing?.featured} className="h-4 w-4" /><label htmlFor="sk-feat" className="text-sm">Featured</label></div>
            <div><label className="text-sm font-medium">Order</label><Input name="order" type="number" defaultValue={editing?.order ?? 0} className="w-20" /></div>
          </div>
          <div className="flex justify-end gap-3"><Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</Button></div>
        </form>
      </Modal>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={saving} />
    </div>
  );
}
