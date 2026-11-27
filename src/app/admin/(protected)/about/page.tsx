"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Spinner } from "@/components/ui/loading";
import { toast } from "sonner";
import type { AboutDTO } from "@/types";

export default function AdminAboutPage() {
  const [data, setData] = useState<AboutDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [biography, setBiography] = useState("");

  useEffect(() => {
    fetch("/api/about")
      .then((r) => r.json())
      .then((j) => {
        if (j.success && j.data) {
          setData(j.data);
          setBiography(j.data.biography ?? "");
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setSaving(true);
    const fd = new FormData(e.currentTarget);
    const body = {
      name: fd.get("name"), title: fd.get("title"), introduction: fd.get("introduction"),
      biography, profileImage: fd.get("profileImage"),
      resumeUrl: fd.get("resumeUrl"), location: fd.get("location"),
      email: fd.get("email"), phone: fd.get("phone"),
      availableForWork: fd.get("availableForWork") === "on",
      interests: (fd.get("interests") as string).split(",").map(s => s.trim()).filter(Boolean),
      highlights: [], socialLinks: [],
    };
    const res = await fetch("/api/about", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json(); setSaving(false);
    if (!res.ok) { toast.error(json.error ?? "Failed"); return; }
    toast.success("About updated"); setData(json.data);
  }

  if (loading) return <div className="flex justify-center py-16"><Spinner className="h-8 w-8" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">About Information</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="text-sm font-medium">Name</label><Input name="name" defaultValue={data?.name} required /></div>
          <div><label className="text-sm font-medium">Professional Title</label><Input name="title" defaultValue={data?.title} required /></div>
        </div>
        <div><label className="text-sm font-medium">Introduction</label><Textarea name="introduction" defaultValue={data?.introduction} rows={3} /></div>
        <div>
          <label className="text-sm font-medium mb-1 block">Biography (HTML)</label>
          <RichTextEditor content={biography} onChange={setBiography} placeholder="Write your biography…" />
        </div>
        <div><label className="text-sm font-medium">Profile Image URL</label><Input name="profileImage" defaultValue={data?.profileImage} /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="text-sm font-medium">Email</label><Input name="email" type="email" defaultValue={data?.email} /></div>
          <div><label className="text-sm font-medium">Phone</label><Input name="phone" defaultValue={data?.phone} /></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="text-sm font-medium">Location</label><Input name="location" defaultValue={data?.location} /></div>
          <div><label className="text-sm font-medium">Resume URL</label><Input name="resumeUrl" defaultValue={data?.resumeUrl} /></div>
        </div>
        <div><label className="text-sm font-medium">Interests (comma-separated)</label><Input name="interests" defaultValue={data?.interests.join(", ")} /></div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="availableForWork" id="avail" defaultChecked={data?.availableForWork} className="h-4 w-4" />
          <label htmlFor="avail" className="text-sm font-medium">Available for work</label>
        </div>
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Changes"}</Button>
      </form>
    </div>
  );
}
