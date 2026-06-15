"use client";
import { useState } from "react";
import { useToast } from "@/components/toast";

export default function ApplyButton({
  jobId,
  alreadyApplied,
  scoreTooLow,
}: {
  jobId: string;
  alreadyApplied: boolean;
  scoreTooLow: boolean;
}) {
  const { toast } = useToast();
  const [applied, setApplied] = useState(alreadyApplied);
  const [loading, setLoading] = useState(false);

  async function handleApply() {
    if (applied || scoreTooLow) return;
    setLoading(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      if (res.ok) setApplied(true);
      else toast("Erreur lors de la candidature", "error");
    } catch {
      toast("Erreur réseau", "error");
    }
    setLoading(false);
  }

  if (applied) {
    return (
      <span className="font-mono text-xs px-4 py-2 rounded-lg border border-[#00c896]/30 text-[#00c896] flex-shrink-0">
        ✓ Postulé
      </span>
    );
  }

  if (scoreTooLow) {
    return (
      <span className="font-mono text-xs px-4 py-2 rounded-lg border border-[#ff4060]/30 text-[#ff4060] flex-shrink-0">
        Score insuffisant
      </span>
    );
  }

  return (
    <button
      onClick={handleApply}
      disabled={loading}
      className="font-mono text-xs px-4 py-2 bg-[#0084ff] text-white rounded-lg hover:bg-[#0094ff] transition flex-shrink-0 disabled:opacity-50"
    >
      {loading ? "..." : "Postuler →"}
    </button>
  );
}
