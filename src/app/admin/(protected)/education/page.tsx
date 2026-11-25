"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Spinner } from "@/components/ui/loading";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatMonthYear } from "@/lib/utils";
import type { EducationDTO } from "@/types";

export default function AdminEducationPage() {
  const [items, setItems] = useState<EducationDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<EducationDTO | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() { setLoading(true); const r = await fetch("/api/education"); const j = await r.json(); if (j.success) setItems(j.data); setLoading(false); }
  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setSaving(true);
    const fd = new FormData(e.currentTarget);
    const body = {
      degree: fd.get("degree"), institution: fd.get("institution"), institutionUrl: fd.get("institutionUrl"),
      location: fd.get("location"), field: fd.get("field"), grade: fd.get("grade"),
      description: fd.get("description"),
      startDate: fd.get("startDate"), endDate: fd.get("endDate") || null,
      current: fd.get("current") === "on", order: Number(fd.get("order")) || 0,
    };
    const url = editing ? `/api/education/${editing.id}` : "/api/education";
    const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json(); setSaving(false);
    if (!res.ok) { toast.error(json.error ?? "Failed"); return; }
    toast.success(editing ? "Updated" : "Created"); setModalOpen(false); setEditing(null); load();
  }

  async function handleDelete() { if (!deleteTarget) return; setSaving(true); await fetch(`/api/education/${deleteTarget}`, { method: "DELETE" }); setSaving(false); setDeleteTarget(null); load(); }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Education</h1>
        <Button onClick={() => { setEditing(null); setModalOpen(true); }}><Plus className="h-4 w-4" /> Add Education</Button>
      </div>
      {loading ? <div className="flex justify-center py-16"><Spinner className="h-8 w-8" /></div> : (
        <div className="space-y-3">
          {items.map((ed) => (
            <div key={ed.id} className="rounded-xl border border-border-base bg-surface p-5 flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{ed.degree}</h3>
                <p className="text-sm text-primary">{ed.institution}</p>
                <p className="text-xs text-muted">{formatMonthYear(ed.startDate)} — {ed.current ? "Present" : ed.endDate ? formatMonthYear(ed.endDate) : ""}</p>
              </div>
              <div className="flex gap-1">
                <button type="button" onClick={() => { setEditing(ed); setModalOpen(true); }} className="p-1.5 rounded hover:bg-muted-surface text-muted hover:text-foreground"><Pencil className="h-4 w-4" /></button>
                <button type="button" onClick={() => setDeleteTarget(ed.id)} className="p-1.5 rounded hover:bg-danger/10 text-muted hover:text-danger"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} title={editing ? "Edit Education" : "Add Education"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="text-sm font-medium">Degree</label><Input name="degree" defaultValue={editing?.degree} required /></div>
          <div><label className="text-sm font-medium">Institution</label><Input name="institution" defaultValue={editing?.institution} required /></div>
          <div><label className="text-sm font-medium">Institution URL</label><Input name="institutionUrl" defaultValue={editing?.institutionUrl} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="text-sm font-medium">Field</label><Input name="field" defaultValue={editing?.field} /></div>
            <div><label className="text-sm font-medium">Grade</label><Input name="grade" defaultValue={editing?.grade} /></div>
          </div>
          <div><label className="text-sm font-medium">Location</label><Input name="location" defaultValue={editing?.location} /></div>
          <div><label className="text-sm font-medium">Description</label><Textarea name="description" defaultValue={editing?.description} rows={3} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="text-sm font-medium">Start Date</label><Input name="startDate" type="date" defaultValue={editing?.startDate?.split("T")[0]} required /></div>
            <div><label className="text-sm font-medium">End Date</label><Input name="endDate" type="date" defaultValue={editing?.endDate?.split("T")[0] ?? ""} /></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2"><input type="checkbox" name="current" id="ed-cur" defaultChecked={editing?.current} className="h-4 w-4" /><label htmlFor="ed-cur" className="text-sm">Currently studying</label></div>
            <div><label className="text-sm font-medium">Order</label><Input name="order" type="number" defaultValue={editing?.order ?? 0} className="w-20" /></div>
          </div>
          <div className="flex justify-end gap-3"><Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</Button></div>
        </form>
      </Modal>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={saving} />
    </div>
  );
}
