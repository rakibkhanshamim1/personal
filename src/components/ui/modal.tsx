"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export function Modal({ open, onClose, title, children, className }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    else if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className={cn(
        "fixed inset-0 z-50 m-auto max-h-[85vh] w-full max-w-lg rounded-xl border border-border-base bg-background p-0 text-foreground shadow-2xl backdrop:bg-black/50",
        "open:animate-in open:fade-in-0 open:zoom-in-95",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border-base px-6 py-4">
        {title && <h2 className="text-lg font-semibold">{title}</h2>}
        <button
          type="button"
          onClick={onClose}
          className="ml-auto rounded-lg p-1.5 text-muted hover:bg-muted-surface hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="px-6 py-4 overflow-y-auto max-h-[calc(85vh-4rem)]">{children}</div>
    </dialog>
  );
}
