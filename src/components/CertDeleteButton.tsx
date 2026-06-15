"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast";

export default function CertDeleteButton({ certId }: { certId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function handleDelete() {
    if (!confirm("Supprimer cette certification ?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/certifications/${certId}`, { method: "DELETE" });
      if (res.ok) router.refresh();
      else toast("Erreur lors de la suppression", "error");
    } catch {
      toast("Erreur réseau", "error");
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="font-mono text-xs text-gray-500 hover:text-[#ff4060] transition disabled:opacity-50"
      title="Supprimer"
    >
      {loading ? "..." : "✕"}
    </button>
  );
}
