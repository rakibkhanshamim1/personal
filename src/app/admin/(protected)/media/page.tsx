"use client";

import { useEffect, useState, useRef } from "react";
import { useAdminList } from "@/hooks/use-admin-fetch";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/loading";
import { Upload, Trash2, Copy, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { formatBytes } from "@/lib/utils";
import type { MediaDTO } from "@/types";
import Image from "next/image";

export default function AdminMediaPage() {
  const list = useAdminList<MediaDTO>({ url: "/api/media" });
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { list.fetchItems({ page: 1 }); }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/media", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) { toast.error(json.error ?? "Upload failed"); return; }
      toast.success("Uploaded");
      list.fetchItems({ page: 1 });
    } catch { toast.error("Upload failed"); } finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await fetch(`/api/media/${deleteTarget}`, { method: "DELETE" });
    setDeleting(false); setDeleteTarget(null);
    if (res.ok) list.fetchItems({ page: list.meta.page });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Media Library</h1>
        <div>
          <input ref={fileRef} type="file" accept="image/*,.pdf,.svg,.webp,.avif" className="hidden" onChange={handleUpload} />
          <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? <Spinner className="h-4 w-4" /> : <Upload className="h-4 w-4" />} Upload
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <SearchBar value={list.search} onChange={list.setSearch} placeholder="Search files…" className="max-w-xs" />
        <Button variant="secondary" size="sm" onClick={() => list.fetchItems({ page: 1 })}>Search</Button>
      </div>
      {list.loading ? <div className="flex justify-center py-16"><Spinner className="h-8 w-8" /></div> : list.items.length === 0 ? (
        <EmptyState icon={<ImageIcon className="h-12 w-12" />} title="No media yet" description="Upload images and files here." />
      ) : (
        <>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {list.items.map((m) => (
              <div key={m.id} className="group rounded-xl border border-border-base bg-surface overflow-hidden">
                <div className="relative aspect-square bg-muted-surface">
                  {m.mimeType.startsWith("image/") ? (
                    <Image src={m.url} alt={m.alt || m.filename} fill className="object-cover" sizes="(max-width: 640px) 50vw, 25vw" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted"><ImageIcon className="h-10 w-10" /></div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium truncate">{m.filename}</p>
                  <p className="text-xs text-muted">{formatBytes(m.size)}</p>
                  <div className="flex gap-1 mt-2">
                    <button type="button" onClick={() => { navigator.clipboard.writeText(m.url); toast.success("URL copied"); }} className="p-1 rounded hover:bg-muted-surface text-muted hover:text-foreground"><Copy className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => setDeleteTarget(m.id)} className="p-1 rounded hover:bg-danger/10 text-muted hover:text-danger"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={list.meta.page} totalPages={list.meta.totalPages} onPageChange={(p) => list.fetchItems({ page: p })} />
        </>
      )}
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} title="Delete file?" description="The file will be permanently removed." />
    </div>
  );
}
