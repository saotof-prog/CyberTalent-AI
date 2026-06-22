"use client";
import { ReactNode } from "react";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
}

export default function ConfirmModal({
  open,
  title = "Confirmation",
  message = "Êtes‑vous sûr ?",
  onConfirm,
  onCancel,
  children,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        {message && <p className="mb-4">{message}</p>}
        {children}
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded"
            onClick={onCancel}
          >
            Annuler
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={onConfirm}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}
