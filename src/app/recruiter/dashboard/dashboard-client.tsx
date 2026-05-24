"use client";

import { useState } from "react";
import Link from "next/link";
import RecruiterFilters from "./filters";

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

export default function RecruiterDashboardClient({
  initialCandidates,
}: {
  initialCandidates: Candidate[];
}) {
  const [aiCandidates, setAiCandidates] = useState<Candidate[] | null>(null);
  const [aiRanked, setAiRanked] = useState(false);

  const displayCandidates = aiCandidates ?? initialCandidates;

  return (
    <>
      <RecruiterFilters
        onAiResults={(candidates, ranked) => {
          setAiCandidates(candidates);
          setAiRanked(ranked);
        }}
      />

      {/* Badge mode IA */}
      {aiRanked && (
        <div className="flex items-center gap-2 mb-4">
          <span className="font-mono text-xs text-[#ff4060] bg-[#ff4060]/10 border border-[#ff4060]/30 px-3 py-1 rounded-full">
            ⚡ Résultats classés par matching
          </span>
          <button
            onClick={() => { setAiCandidates(null); setAiRanked(false); }}
            className="font-mono text-xs text-gray-500 hover:text-gray-300 underline"
          >
            Réinitialiser
          </button>
        </div>
      )}

      <p className="text-gray-400 font-mono text-xs mb-4">
        {displayCandidates.length} candidat{displayCandidates.length > 1 ? "s" : ""}
        {aiRanked ? " · classés par pertinence" : " · classés par score"}
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {displayCandidates.map((candidate, idx) => (
          <Link key={candidate.id} href={`/recruiter/candidate/${candidate.id}`}>
            <div className="bg-[#0d1520] border border-[#ff4060]/20 rounded-xl p-5 hover:border-[#ff4060] transition cursor-pointer">
              <div className="flex items-center gap-4">

                {/* Rang ou match */}
                <div className="flex flex-col items-center justify-center w-16 h-16 bg-[#111d2e] border border-[#ff4060]/30 rounded-lg shrink-0">
                  {candidate.aiRelevance !== undefined && aiRanked ? (
                    <>
                      <div className="font-mono text-lg font-bold text-[#ff4060]">
                        {candidate.aiRelevance}%
                      </div>
                      <div className="font-mono text-[10px] text-gray-500">match</div>
                    </>
                  ) : (
                    <>
                      <div className="font-mono text-xl font-bold text-[#ff4060]">
                        #{idx + 1}
                      </div>
                      <div className="font-mono text-xs text-gray-500">rank</div>
                    </>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="font-mono text-lg font-bold text-white">
                      {candidate.firstName} {candidate.lastName}
                    </h3>
                    <span className="font-mono text-xs text-gray-400">
                      {candidate.location && `${candidate.location}, `}{candidate.country}
                    </span>
                    {candidate.isAvailable && (
                      <span className="font-mono text-xs px-2 py-1 rounded bg-[#00c896]/10 border border-[#00c896]/30 text-[#00c896]">
                        ✓ Disponible
                      </span>
                    )}
                  </div>

                  {candidate.headline && (
                    <p className="font-mono text-sm text-gray-400 mb-1">
                      {candidate.headline}
                    </p>
                  )}

                  {/* Raison du match */}
                  {aiRanked && candidate.aiReason && (
                    <p className="font-mono text-xs text-[#ff4060]/60 italic mb-2">
                      ↳ {candidate.aiReason}
                    </p>
                  )}

                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-xs text-gray-500">
                      📜 {candidate.certifications.length} certs
                    </span>
                    <span className="font-mono text-xs text-gray-500">
                      🧪 {candidate.labs.length} labs
                    </span>
                    <span className="font-mono text-xs text-gray-500">
                      ⚡ {candidate.skills.length} skills
                    </span>
                    {candidate.githubUsername && (
                      <span className="font-mono text-xs text-[#00c896]">
                        @{candidate.githubUsername}
                      </span>
                    )}
                  </div>
                </div>

                {/* CyberScore */}
                <div className="flex flex-col items-center justify-center w-24 h-24 bg-[#111d2e] border border-[#ff4060]/30 rounded-lg shrink-0">
                  <div className="font-mono text-3xl font-bold text-[#ff4060]">
                    {candidate.cyberScore}
                  </div>
                  <div className="font-mono text-xs text-gray-500">score</div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {displayCandidates.length === 0 && (
        <div className="text-center py-16 text-gray-500 font-mono text-sm">
          Aucun candidat trouvé. Ajustez vos filtres.
        </div>
      )}
    </>
  );
}