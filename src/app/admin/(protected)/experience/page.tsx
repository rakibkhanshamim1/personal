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
import type { ExperienceDTO } from "@/types";

export default function AdminExperiencePage() {
  const [items, setItems] = useState<ExperienceDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ExperienceDTO | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() { setLoading(true); const r = await fetch("/api/experience"); const j = await r.json(); if (j.success) setItems(j.data); setLoading(false); }
  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setSaving(true);
    const fd = new FormData(e.currentTarget);
    const body = {
      role: fd.get("role"), company: fd.get("company"), companyUrl: fd.get("companyUrl"),
      location: fd.get("location"), employmentType: fd.get("employmentType"),
      description: fd.get("description"), technologies: (fd.get("technologies") as string).split(",").map(s => s.trim()).filter(Boolean),
      startDate: fd.get("startDate"), endDate: fd.get("endDate") || null,
      current: fd.get("current") === "on", order: Number(fd.get("order")) || 0,
    };
    const url = editing ? `/api/experience/${editing.id}` : "/api/experience";
    const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json(); setSaving(false);
    if (!res.ok) { toast.error(json.error ?? "Failed"); return; }
    toast.success(editing ? "Updated" : "Created"); setModalOpen(false); setEditing(null); load();
  }

  async function handleDelete() {
    if (!deleteTarget) return; setSaving(true);
    await fetch(`/api/experience/${deleteTarget}`, { method: "DELETE" });
    setSaving(false); setDeleteTarget(null); load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Experience</h1>
        <Button onClick={() => { setEditing(null); setModalOpen(true); }}><Plus className="h-4 w-4" /> Add Experience</Button>
      </div>
      {loading ? <div className="flex justify-center py-16"><Spinner className="h-8 w-8" /></div> : (
        <div className="space-y-3">
          {items.map((exp) => (
            <div key={exp.id} className="rounded-xl border border-border-base bg-surface p-5 flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{exp.role}</h3>
                <p className="text-sm text-primary">{exp.company}</p>
                <p className="text-xs text-muted">{formatMonthYear(exp.startDate)} — {exp.current ? "Present" : exp.endDate ? formatMonthYear(exp.endDate) : ""}</p>
              </div>
              <div className="flex gap-1">
                <button type="button" onClick={() => { setEditing(exp); setModalOpen(true); }} className="p-1.5 rounded hover:bg-muted-surface text-muted hover:text-foreground"><Pencil className="h-4 w-4" /></button>
                <button type="button" onClick={() => setDeleteTarget(exp.id)} className="p-1.5 rounded hover:bg-danger/10 text-muted hover:text-danger"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} title={editing ? "Edit Experience" : "Add Experience"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="text-sm font-medium">Role</label><Input name="role" defaultValue={editing?.role} required /></div>
          <div><label className="text-sm font-medium">Company</label><Input name="company" defaultValue={editing?.company} required /></div>
          <div><label className="text-sm font-medium">Company URL</label><Input name="companyUrl" defaultValue={editing?.companyUrl} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="text-sm font-medium">Location</label><Input name="location" defaultValue={editing?.location} /></div>
            <div><label className="text-sm font-medium">Type</label><Input name="employmentType" defaultValue={editing?.employmentType ?? "Full-time"} /></div>
          </div>
          <div><label className="text-sm font-medium">Description</label><Textarea name="description" defaultValue={editing?.description} rows={3} /></div>
          <div><label className="text-sm font-medium">Technologies</label><Input name="technologies" defaultValue={editing?.technologies.join(", ")} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="text-sm font-medium">Start Date</label><Input name="startDate" type="date" defaultValue={editing?.startDate?.split("T")[0]} required /></div>
            <div><label className="text-sm font-medium">End Date</label><Input name="endDate" type="date" defaultValue={editing?.endDate?.split("T")[0] ?? ""} /></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2"><input type="checkbox" name="current" id="exp-cur" defaultChecked={editing?.current} className="h-4 w-4" /><label htmlFor="exp-cur" className="text-sm">Current role</label></div>
            <div><label className="text-sm font-medium">Order</label><Input name="order" type="number" defaultValue={editing?.order ?? 0} className="w-20" /></div>
          </div>
          <div className="flex justify-end gap-3"><Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</Button></div>
        </form>
      </Modal>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={saving} />
    </div>
  );
}
