"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { toast } from "sonner";
import type { VideoDTO } from "@/types";

export function VideoEditForm({ video }: { video: VideoDTO }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const body = {
      title: fd.get("title"),
      slug: fd.get("slug"),
      description: fd.get("description"),
      videoUrl: fd.get("videoUrl"),
      thumbnail: fd.get("thumbnail"),
      duration: Number(fd.get("duration")) || 0,
      status: fd.get("status"),
      featured: fd.get("featured") === "on",
    };
    try {
      const res = await fetch(`/api/videos/${video.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const json = await res.json();
      if (!res.ok) { toast.error(json.error ?? "Failed"); return; }
      toast.success("Video updated");
      router.push("/admin/videos");
      router.refresh();
    } catch { toast.error("Something went wrong"); } finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div><label className="text-sm font-medium">Title</label><Input name="title" defaultValue={video.title} required /></div>
      <div><label className="text-sm font-medium">Slug</label><Input name="slug" defaultValue={video.slug} required /></div>
      <div><label className="text-sm font-medium">Video URL</label><Input name="videoUrl" defaultValue={video.videoUrl} required /></div>
      <div><label className="text-sm font-medium">Thumbnail URL</label><Input name="thumbnail" defaultValue={video.thumbnail} /></div>
      <div><label className="text-sm font-medium">Description</label><Textarea name="description" defaultValue={video.description} rows={4} /></div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className="text-sm font-medium">Duration (sec)</label><Input name="duration" type="number" defaultValue={video.duration} /></div>
        <div><label className="text-sm font-medium">Status</label><Select name="status" defaultValue={video.status}><option value="draft">Draft</option><option value="published">Published</option></Select></div>
        <div className="flex items-end gap-2 pb-1"><input type="checkbox" name="featured" id="vid-feat" defaultChecked={video.featured} className="h-4 w-4" /><label htmlFor="vid-feat" className="text-sm font-medium">Featured</label></div>
      </div>
      <Button type="submit" disabled={loading}>{loading ? "Saving…" : "Update Video"}</Button>
    </form>
  );
}
