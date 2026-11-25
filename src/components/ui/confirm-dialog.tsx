"use client";

import { Modal } from "./modal";
import { Button } from "./button";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  loading?: boolean;
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  loading,
}: Props) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-muted mb-6">{description}</p>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? "Deleting…" : confirmText}
        </Button>
      </div>
    </Modal>
  );
}
