"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CertVerifyButton({ certId }: { certId: string }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const router = useRouter();

  async function handleVerify() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/certifications/${certId}/verify`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data.status === "VERIFIED" ? "✓ Vérifiée" : "✗ Rejetée");
        router.refresh();
      } else {
        setResult("✗ Erreur");
      }
    } catch {
      setResult("✗ Erreur réseau");
    }
    setLoading(false);
    setTimeout(() => setResult(null), 5000);
  }

  return (
    <button
      onClick={handleVerify}
      disabled={loading}
      className="font-mono text-xs px-3 py-1.5 rounded-lg border border-[#00c896]/30 text-[#00c896] hover:bg-[#00c896]/10 transition disabled:opacity-50"
    >
      {loading ? "⏳" : result || "🔍 Vérifier IA"}
    </button>
  );
}
