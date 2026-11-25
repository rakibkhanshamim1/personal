"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { MessageStatus } from "@/types";

export function MessageActions({ id, currentStatus }: { id: string; currentStatus: MessageStatus }) {
  const router = useRouter();

  async function update(status: MessageStatus) {
    const res = await fetch(`/api/contact/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    if (!res.ok) { toast.error("Failed"); return; }
    toast.success(`Marked as ${status}`);
    router.refresh();
  }

  return (
    <div className="mt-6 flex gap-3 border-t border-border-base pt-4">
      {currentStatus !== "read" && <Button variant="secondary" size="sm" onClick={() => update("read")}>Mark as Read</Button>}
      {currentStatus !== "archived" && <Button variant="secondary" size="sm" onClick={() => update("archived")}>Archive</Button>}
      {currentStatus !== "unread" && <Button variant="ghost" size="sm" onClick={() => update("unread")}>Mark Unread</Button>}
      <a href={`mailto:${""}`} className="ml-auto"><Button variant="primary" size="sm">Reply via Email</Button></a>
    </div>
  );
}
