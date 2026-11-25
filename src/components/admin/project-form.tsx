"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";
import type { ProjectDTO, CategoryDTO } from "@/types";

type Props = {
  project?: ProjectDTO;
  categories: CategoryDTO[];
};

export function ProjectForm({ project, categories }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState(project?.description ?? "");
  const isEdit = !!project;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const body: Record<string, unknown> = {
      title: fd.get("title"),
      slug: fd.get("slug"),
      summary: fd.get("summary"),
      description,
      coverImage: fd.get("coverImage"),
      liveUrl: fd.get("liveUrl"),
      sourceUrl: fd.get("sourceUrl"),
      category: fd.get("category") || null,
      technologies: (fd.get("technologies") as string).split(",").map((s) => s.trim()).filter(Boolean),
      projectStatus: fd.get("projectStatus"),
      status: fd.get("status"),
      featured: fd.get("featured") === "on",
      order: Number(fd.get("order")) || 0,
    };

    try {
      const url = isEdit ? `/api/projects/${project.id}` : "/api/projects";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Failed to save");
        return;
      }
      toast.success(isEdit ? "Project updated" : "Project created");
      router.push("/admin/projects");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
      <div>
        <label className="text-sm font-medium">Title</label>
        <Input name="title" defaultValue={project?.title} required onChange={(e) => {
          if (!isEdit) {
            const slugEl = e.currentTarget.form?.elements.namedItem("slug") as HTMLInputElement;
            if (slugEl) slugEl.value = slugify(e.target.value);
          }
        }} />
      </div>
      <div>
        <label className="text-sm font-medium">Slug</label>
        <Input name="slug" defaultValue={project?.slug} required />
      </div>
      <div>
        <label className="text-sm font-medium">Summary</label>
        <Textarea name="summary" defaultValue={project?.summary} required rows={3} />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Description</label>
        <RichTextEditor content={description} onChange={setDescription} placeholder="Describe the project…" />
      </div>
      <div>
        <label className="text-sm font-medium">Cover Image URL</label>
        <Input name="coverImage" defaultValue={project?.coverImage} />
      </div>
      <div>
        <label className="text-sm font-medium">Technologies (comma-separated)</label>
        <Input name="technologies" defaultValue={project?.technologies.join(", ")} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Category</label>
          <Select name="category" defaultValue={project?.category?.id ?? ""}>
            <option value="">None</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Project Status</label>
          <Select name="projectStatus" defaultValue={project?.projectStatus ?? "completed"}>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="planned">Planned</option>
          </Select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Live URL</label>
          <Input name="liveUrl" defaultValue={project?.liveUrl} />
        </div>
        <div>
          <label className="text-sm font-medium">Source URL</label>
          <Input name="sourceUrl" defaultValue={project?.sourceUrl} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="text-sm font-medium">Publish Status</label>
          <Select name="status" defaultValue={project?.status ?? "draft"}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Order</label>
          <Input name="order" type="number" defaultValue={project?.order ?? 0} />
        </div>
        <div className="flex items-end gap-2 pb-1">
          <input type="checkbox" name="featured" id="featured" defaultChecked={project?.featured} className="h-4 w-4 rounded border-border-base" />
          <label htmlFor="featured" className="text-sm font-medium">Featured</label>
        </div>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Saving…" : isEdit ? "Update Project" : "Create Project"}
      </Button>
    </form>
  );
}
