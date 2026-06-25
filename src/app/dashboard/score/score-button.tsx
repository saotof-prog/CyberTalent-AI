"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ScoreButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    setLoading(true);
    await fetch("/api/score/recalculate", { method: "POST" });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="font-mono text-sm px-6 py-3 bg-[#00FF41] text-black font-bold rounded-lg hover:bg-[#00FF41] transition disabled:opacity-50"
    >
      {loading ? "⏳ Calcul en cours..." : "⚡ Recalculer mon score"}
    </button>
  );
}
