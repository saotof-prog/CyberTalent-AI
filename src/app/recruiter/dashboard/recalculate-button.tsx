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
    await fetch("/api/score/recalculate", { method: "POST" });
    setLoading(false);
    setDone(true);
    router.refresh();
    setTimeout(() => setDone(false), 3000);
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="font-mono text-xs px-4 py-2 rounded-lg border border-[#FF3333]/40 text-[#FF3333] hover:bg-[#FF3333]/10 transition disabled:opacity-50"
    >
      {loading
        ? "⏳ Calcul en cours..."
        : done
          ? "✓ Scores mis à jour"
          : "⚡ Recalculer les scores"}
    </button>
  );
}
