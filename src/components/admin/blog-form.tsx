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
import type { BlogPostDTO, CategoryDTO, TagDTO } from "@/types";

type Props = { post?: BlogPostDTO; categories: CategoryDTO[]; tags: TagDTO[] };

export function BlogForm({ post, categories, tags }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(post?.content ?? "");
  const isEdit = !!post;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const selectedTags = Array.from(fd.getAll("tags")).filter(Boolean) as string[];
    const body: Record<string, unknown> = {
      title: fd.get("title"),
      slug: fd.get("slug"),
      excerpt: fd.get("excerpt"),
      content,
      coverImage: fd.get("coverImage"),
      category: fd.get("category") || null,
      tags: selectedTags,
      status: fd.get("status"),
      featured: fd.get("featured") === "on",
    };

    try {
      const url = isEdit ? `/api/blog/${post.id}` : "/api/blog";
      const res = await fetch(url, { method: isEdit ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const json = await res.json();
      if (!res.ok) { toast.error(json.error ?? "Failed to save"); return; }
      toast.success(isEdit ? "Post updated" : "Post created");
      router.push("/admin/blog");
      router.refresh();
    } catch { toast.error("Something went wrong"); } finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
      <div>
        <label className="text-sm font-medium">Title</label>
        <Input name="title" defaultValue={post?.title} required onChange={(e) => {
          if (!isEdit) {
            const s = e.currentTarget.form?.elements.namedItem("slug") as HTMLInputElement;
            if (s) s.value = slugify(e.target.value);
          }
        }} />
      </div>
      <div><label className="text-sm font-medium">Slug</label><Input name="slug" defaultValue={post?.slug} required /></div>
      <div><label className="text-sm font-medium">Excerpt</label><Textarea name="excerpt" defaultValue={post?.excerpt} rows={2} /></div>
      <div>
        <label className="text-sm font-medium mb-1 block">Content</label>
        <RichTextEditor content={content} onChange={setContent} placeholder="Write your blog post…" />
      </div>
      <div><label className="text-sm font-medium">Cover Image URL</label><Input name="coverImage" defaultValue={post?.coverImage} /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="text-sm font-medium">Category</label>
          <Select name="category" defaultValue={post?.category?.id ?? ""}><option value="">None</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
        </div>
        <div><label className="text-sm font-medium">Status</label>
          <Select name="status" defaultValue={post?.status ?? "draft"}><option value="draft">Draft</option><option value="published">Published</option></Select>
        </div>
      </div>
      {tags.length > 0 && (
        <div>
          <label className="text-sm font-medium">Tags</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {tags.map((t) => (
              <label key={t.id} className="flex items-center gap-1.5 text-sm">
                <input type="checkbox" name="tags" value={t.id} defaultChecked={post?.tags.some((pt) => pt.id === t.id)} className="h-3.5 w-3.5 rounded border-border-base" />
                {t.name}
              </label>
            ))}
          </div>
        </div>
      )}
      <div className="flex items-center gap-2">
        <input type="checkbox" name="featured" id="blog-featured" defaultChecked={post?.featured} className="h-4 w-4 rounded border-border-base" />
        <label htmlFor="blog-featured" className="text-sm font-medium">Featured</label>
      </div>
      <Button type="submit" disabled={loading}>{loading ? "Saving…" : isEdit ? "Update Post" : "Create Post"}</Button>
    </form>
  );
}
