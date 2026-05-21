"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RecalculateButton() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  async function handleClick() {
    setLoading(true);
    setDone(false);
    const res = await fetch("/api/score/recalculate", { method: "POST" });
    const data = await res.json();
    setLoading(false);
    setDone(true);
    router.refresh();
    setTimeout(() => setDone(false), 3000);
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="font-mono text-xs px-4 py-2 rounded-lg border border-[#ff4060]/40 text-[#ff4060] hover:bg-[#ff4060]/10 transition disabled:opacity-50"
    >
      {loading ? "⏳ Calcul en cours..." : done ? "✓ Scores mis à jour" : "⚡ Recalculer les scores"}
    </button>
  );
}