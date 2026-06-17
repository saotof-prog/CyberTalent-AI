"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GithubSync({
  username,
  syncedAt,
}: {
  username: string | null;
  syncedAt: Date | null;
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const router = useRouter();

  async function handleSync() {
    if (!username) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/github/sync", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setResult(`✓ ${data.reposCount} repos synchronisés`);
        router.refresh();
      } else {
        setResult(`✗ ${data.detail ?? data.error}`);
      }
    } catch {
      setResult("✗ Erreur réseau");
    }
    setLoading(false);
    setTimeout(() => setResult(null), 5000);
  }

  if (!username) {
    return (
      <div className="font-mono text-xs text-gray-500">
        Ajoute ton GitHub dans ton profil pour synchroniser.
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleSync}
        disabled={loading}
        className="font-mono text-xs px-4 py-2 rounded-lg border border-[#00c896]/30 text-[#00c896] hover:bg-[#00c896]/10 transition disabled:opacity-50"
      >
        {loading ? "⏳ Sync en cours..." : "⬡ Sync GitHub"}
      </button>
      {result && <span className="font-mono text-xs text-gray-400">{result}</span>}
      {syncedAt && !result && (
        <span className="font-mono text-xs text-gray-600">
          Dernière sync : {new Date(syncedAt).toLocaleDateString("fr-FR")}
        </span>
      )}
    </div>
  );
}
