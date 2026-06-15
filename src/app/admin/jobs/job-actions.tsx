"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminJobActions({ jobId, isActive }: { jobId: string; isActive: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggleActive() {
    setLoading(true);
    try {
      await fetch("/api/admin/jobs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, isActive: !isActive }),
      });
      router.refresh();
    } catch {}
    setLoading(false);
  }

  return (
    <button
      onClick={toggleActive}
      disabled={loading}
      className={`font-mono text-xs px-3 py-1 rounded border transition disabled:opacity-50 ${
        isActive
          ? "border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
          : "border-[#00c896]/30 text-[#00c896] hover:bg-[#00c896]/10"
      }`}
    >
      {loading ? "..." : isActive ? "Désactiver" : "Activer"}
    </button>
  );
}
