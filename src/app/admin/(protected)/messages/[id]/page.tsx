export const instant = false;

import { notFound } from "next/navigation";
import { getMessageById } from "@/lib/services/messages";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MessageActions } from "./actions";

type Props = { params: Promise<{ id: string }> };

export default async function MessageDetailPage({ params }: Props) {
  const { id } = await params;
  const message = await getMessageById(id);
  if (!message) notFound();

  return (
    <div className="max-w-2xl">
      <Link href="/admin/messages" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to messages
      </Link>
      <div className="rounded-xl border border-border-base bg-surface p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold">{message.subject || "No subject"}</h1>
            <p className="text-sm text-muted mt-1">From: {message.name} &lt;{message.email}&gt;</p>
            <p className="text-xs text-muted">{formatDate(message.createdAt)}</p>
          </div>
          <Badge variant={message.status === "unread" ? "warning" : message.status === "read" ? "success" : "default"}>{message.status}</Badge>
        </div>
        <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">{message.message}</div>
        <MessageActions id={id} currentStatus={message.status} />
      </div>
    </div>
  );
}
