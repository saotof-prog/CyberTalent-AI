"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

type Candidate = {
  id: string;
  firstName: string;
  lastName: string;
  headline?: string | null;
  cyberScore: number;
  country?: string | null;
  location?: string | null;
  githubUsername?: string | null;
  isAvailable: boolean;
  aiRelevance?: number;
  aiReason?: string;
  skills: { skill: { name: string }; level: string }[];
  certifications: { name: string; status: string }[];
  labs: { id: string }[];
};

type Props = {
  onAiResults: (candidates: Candidate[] | null, ranked: boolean) => void;
};

export default function RecruiterFilters({ onAiResults }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      onAiResults(null, false);
      router.push("/recruiter/dashboard?" + params.toString());
    },
    [router, searchParams, onAiResults]
  );

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/candidate/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          minScore: searchParams.get("score")
            ? parseInt(searchParams.get("score")!)
            : undefined,
          country: searchParams.get("country") || undefined,
        }),
      });
      const data = await res.json();
      onAiResults(data.candidates ?? [], data.aiRanked);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0d1520] border border-[#ff4060]/20 rounded-xl p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-4 bg-[#ff4060] rounded" />
        <span className="font-mono text-sm text-[#ff4060]">FILTRES DE RECHERCHE</span>
      </div>

      {/* Barre de recherche par matching */}
      <div className="flex gap-3 mb-4">
        <input
          placeholder='Ex: "Pentester OSCP avec expérience réseau"'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 bg-[#111d2e] border border-[#ff4060]/40 rounded-lg px-3 py-2 font-mono text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ff4060]"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="bg-[#ff4060] hover:bg-[#ff2040] disabled:opacity-40 px-5 py-2 rounded-lg font-mono text-sm text-white flex items-center gap-2 transition-colors"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : "⚡ Matcher"}
        </button>
      </div>

      {/* Filtres classiques */}
      <div className="grid grid-cols-4 gap-4">
        <input
          placeholder="Rechercher..."
          defaultValue={searchParams.get("search") ?? ""}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="bg-[#111d2e] border border-[#ff4060]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#ff4060]"
        />
        <select
          defaultValue={searchParams.get("score") ?? ""}
          onChange={(e) => updateFilter("score", e.target.value)}
          className="bg-[#111d2e] border border-[#ff4060]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none"
        >
          <option value="">Score minimum</option>
          <option value="70">70+</option>
          <option value="80">80+</option>
          <option value="90">90+</option>
        </select>
        <select
          defaultValue={searchParams.get("cert") ?? ""}
          onChange={(e) => updateFilter("cert", e.target.value)}
          className="bg-[#111d2e] border border-[#ff4060]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none"
        >
          <option value="">Certification</option>
          <option value="OSCP">OSCP</option>
          <option value="CEH">CEH</option>
          <option value="CISSP">CISSP</option>
        </select>
        <select
          defaultValue={searchParams.get("country") ?? ""}
          onChange={(e) => updateFilter("country", e.target.value)}
          className="bg-[#111d2e] border border-[#ff4060]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none"
        >
          <option value="">Tous les pays</option>
          <option value="SN">Sénégal</option>
          <option value="MA">Maroc</option>
          <option value="CI">Côte d'Ivoire</option>
        </select>
      </div>
    </div>
  );
}