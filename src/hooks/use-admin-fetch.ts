"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { ApiResponse, Paginated, PaginationMeta } from "@/types";

type Opts = {
  url: string;
  initialPage?: number;
  initialLimit?: number;
};

export function useAdminList<T>(opts: Opts) {
  const [items, setItems] = useState<T[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: opts.initialPage ?? 1, limit: opts.initialLimit ?? 12, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const fetchItems = useCallback(async (params?: Record<string, string | number>) => {
    setLoading(true);
    try {
      const sp = new URLSearchParams();
      if (search) sp.set("search", search);
      if (params) {
        for (const [k, v] of Object.entries(params)) sp.set(k, String(v));
      }
      const res = await fetch(`${opts.url}?${sp}`);
      const json = await res.json();
      if (json.success) {
        setItems(json.data);
        if (json.meta) setMeta(json.meta);
      } else {
        toast.error(json.error ?? "Failed to load data");
      }
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [opts.url, search]);

  const deleteItem = useCallback(async (id: string) => {
    const res = await fetch(`${opts.url}/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) { toast.error(json.error ?? "Delete failed"); return false; }
    toast.success("Deleted");
    return true;
  }, [opts.url]);

  const bulkDelete = useCallback(async (ids: string[]) => {
    const res = await fetch(`${opts.url}/bulk`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    const json = await res.json();
    if (!res.ok) { toast.error(json.error ?? "Delete failed"); return false; }
    toast.success(`Deleted ${json.data.deleted} items`);
    return true;
  }, [opts.url]);

  return { items, meta, loading, search, setSearch, selected, setSelected, fetchItems, deleteItem, bulkDelete };
}
