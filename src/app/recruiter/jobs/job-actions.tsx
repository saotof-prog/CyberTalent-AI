"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function JobActions({
  jobId,
  isActive,
}: {
  jobId: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    await fetch(`/api/jobs/${jobId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    router.refresh();
    setLoading(false);
  };

  const remove = async () => {
    if (!confirm("Supprimer cette offre ?")) return;
    setLoading(true);
    await fetch(`/api/jobs/${jobId}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-2 shrink-0">
      <button
        onClick={toggle}
        disabled={loading}
        className={
          "font-mono text-xs px-3 py-1.5 rounded-lg border transition disabled:opacity-50 " +
          (isActive
            ? "border-gray-700 text-gray-400 hover:border-gray-500"
            : "border-[#00c896]/40 text-[#00c896] hover:bg-[#00c896]/10")
        }
      >
        {isActive ? "Désactiver" : "Activer"}
      </button>
      <button
        onClick={remove}
        disabled={loading}
        className="font-mono text-xs px-3 py-1.5 rounded-lg border border-[#ff4060]/20 text-[#ff4060]/60 hover:text-[#ff4060] hover:border-[#ff4060]/40 transition disabled:opacity-50"
      >
        Supprimer
      </button>
    </div>
  );
}