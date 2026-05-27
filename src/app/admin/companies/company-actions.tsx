"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminCompanyActions({
  companyId,
  isVerified,
}: {
  companyId: string;
  isVerified: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggleVerify() {
    setLoading(true);
    try {
      await fetch("/api/admin/companies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, isVerified: !isVerified }),
      });
      router.refresh();
    } catch {}
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-2">
      {isVerified && (
        <span className="font-mono text-xs text-[#00c896] border border-[#00c896]/30 px-2 py-1 rounded">
          ✓ Vérifié
        </span>
      )}
      <button
        onClick={toggleVerify}
        disabled={loading}
        className={`font-mono text-xs px-3 py-1 rounded border transition disabled:opacity-50 ${
          isVerified
            ? "border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
            : "border-[#00c896]/30 text-[#00c896] hover:bg-[#00c896]/10"
        }`}
      >
        {loading ? "..." : isVerified ? "Révoquer" : "Vérifier"}
      </button>
    </div>
  );
}
