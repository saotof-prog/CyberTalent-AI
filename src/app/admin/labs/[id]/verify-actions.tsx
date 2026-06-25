"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLabVerifyActions({
  labId,
}: {
  labId: string;
  labName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [reason, setReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  async function handleApprove() {
    setLoading("approve");
    try {
      const res = await fetch(`/api/admin/labs/${labId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "APPROVE" }),
      });
      if (!res.ok) throw new Error("Erreur");
      router.refresh();
    } catch {
      alert("Erreur lors de l'approbation");
    } finally {
      setLoading(null);
    }
  }

  async function handleReject() {
    if (!reason.trim() && !confirm("Rejeter sans raison ?")) return;
    setLoading("reject");
    try {
      const res = await fetch(`/api/admin/labs/${labId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "REJECT", reason: reason.trim() || undefined }),
      });
      if (!res.ok) throw new Error("Erreur");
      router.refresh();
    } catch {
      alert("Erreur lors du rejet");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="bg-[#0d1520] border border-[#0084ff]/20 rounded-xl p-4">
      <h2 className="font-mono text-sm text-[#0084ff] mb-4">Actions de vérification</h2>

      {!showRejectForm ? (
        <div className="flex items-center gap-3">
          <button
            onClick={handleApprove}
            disabled={loading !== null}
            className="font-mono text-xs px-6 py-2 rounded-lg bg-[#00FF41]/15 border border-[#00FF41]/40 text-[#00FF41] hover:bg-[#00FF41]/25 disabled:opacity-50 transition"
          >
            {loading === "approve" ? "..." : "✅ Approuver"}
          </button>
          <button
            onClick={() => setShowRejectForm(true)}
            disabled={loading !== null}
            className="font-mono text-xs px-6 py-2 rounded-lg bg-[#FF3333]/15 border border-[#FF3333]/40 text-[#FF3333] hover:bg-[#FF3333]/25 disabled:opacity-50 transition"
          >
            {"❌ Rejeter"}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="font-mono text-xs text-gray-400">
              Raison du rejet (optionnelle)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Pourquoi ce lab est-il rejeté ?"
              className="w-full mt-1 bg-[#080c14] border border-[#0084ff]/20 rounded-lg p-3 font-mono text-sm text-white placeholder-gray-500 focus:border-[#0084ff] outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReject}
              disabled={loading !== null}
              className="font-mono text-xs px-6 py-2 rounded-lg bg-[#FF3333]/15 border border-[#FF3333]/40 text-[#FF3333] hover:bg-[#FF3333]/25 disabled:opacity-50 transition"
            >
              {loading === "reject" ? "..." : "Confirmer le rejet"}
            </button>
            <button
              onClick={() => { setShowRejectForm(false); setReason(""); }}
              className="font-mono text-xs px-4 py-2 rounded-lg text-gray-400 hover:text-white transition"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
