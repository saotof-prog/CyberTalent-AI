"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CertVerifyButton({ certId }: { certId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleVerify() {
    setLoading(true);
    try {
      const res = await fetch(`/api/certifications/${certId}/verify`, { method: "POST" });
      const data = await res.json();
      if (res.ok && data.status === "VERIFIED") {
        alert("✅ Certification validée !");
      } else if (res.ok && data.status === "PENDING") {
        alert("⚠️ " + (data.notes || "Ajoute un lien de vérification pour valider automatiquement."));
      } else {
        alert("❌ Erreur lors de la vérification.");
      }
      router.refresh();
    } catch {
      alert("❌ Erreur réseau.");
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleVerify}
      disabled={loading}
      className="font-mono text-xs px-3 py-1.5 rounded-lg border border-[#00c896]/30 text-[#00c896] hover:bg-[#00c896]/10 transition disabled:opacity-50"
    >
      {loading ? "⏳" : "🔍 Vérifier"}
    </button>
  );
}
