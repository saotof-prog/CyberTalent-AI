"use client";
import { useState } from "react";

export default function SaveButton({
  candidateId,
  initialSaved,
}: {
  candidateId: string;
  initialSaved: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      const res = await fetch("/api/recruiter/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateId }),
      });
      const data = await res.json();
      setSaved(data.saved);
    } catch {
      alert("Erreur réseau");
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`font-mono text-sm px-6 py-3 rounded-lg transition font-bold border ${
        saved
          ? "border-[#ffaa00] text-[#ffaa00] hover:bg-[#ffaa00]/10"
          : "border-[#ff4060]/30 text-[#ff4060] hover:bg-[#ff4060]/10"
      }`}
    >
      {loading ? "..." : saved ? "★ Sauvegardé" : "☆ Sauvegarder"}
    </button>
  );
}