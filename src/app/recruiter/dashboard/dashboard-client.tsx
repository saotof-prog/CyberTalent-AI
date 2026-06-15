"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

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

function PaginationLink({
  page,
  disabled,
  active,
  label,
}: {
  page: number;
  disabled?: boolean;
  active?: boolean;
  label?: string;
}) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  params.set("page", String(page));

  if (disabled) {
    return (
      <span className="font-mono text-xs text-gray-600 px-3 py-1.5 rounded border border-gray-800 cursor-not-allowed">
        {label ?? page}
      </span>
    );
  }

  if (active) {
    return (
      <span className="font-mono text-xs text-white bg-[#ff4060] px-3 py-1.5 rounded border border-[#ff4060]">
        {page}
      </span>
    );
  }

  return (
    <Link
      href={`/recruiter/dashboard?${params.toString()}`}
      className="font-mono text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded border border-gray-800 hover:border-[#ff4060]/30 transition"
    >
      {label ?? page}
    </Link>
  );
}

export default function RecruiterDashboardClient({
  initialCandidates,
  currentPage,
  totalPages,
}: {
  initialCandidates: Candidate[];
  currentPage: number;
  totalPages: number;
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

      {aiRanked && (
        <div className="flex items-center gap-2 mb-4">
          <span className="font-mono text-xs text-[#ff4060] bg-[#ff4060]/10 border border-[#ff4060]/30 px-3 py-1 rounded-full">
            ⚡ Résultats classés par matching
          </span>
          <button
            onClick={() => {
              setAiCandidates(null);
              setAiRanked(false);
            }}
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

      <div className="flex flex-col gap-3">
        {displayCandidates.map((candidate, idx) => (
          <Link key={candidate.id} href={`/recruiter/candidate/${candidate.id}`}>
            <div className="bg-[#0d1520] border border-[#ff4060]/20 rounded-xl p-5 hover:border-[#ff4060] transition cursor-pointer">
              <div className="flex items-center gap-4">
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
                      <div className="font-mono text-xl font-bold text-[#ff4060]">#{idx + 1}</div>
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
                      {candidate.location && `${candidate.location}, `}
                      {candidate.country}
                    </span>
                    {candidate.isAvailable && (
                      <span className="font-mono text-xs px-2 py-1 rounded bg-[#00c896]/10 border border-[#00c896]/30 text-[#00c896]">
                        ✓ Disponible
                      </span>
                    )}
                  </div>

                  {candidate.headline && (
                    <p className="font-mono text-sm text-gray-400 mb-1">{candidate.headline}</p>
                  )}

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

      {displayCandidates.length === 0 && !aiRanked && (
        <div className="text-center py-16 text-gray-500 font-mono text-sm">
          Aucun candidat trouvé. Ajustez vos filtres.
        </div>
      )}

      {totalPages > 1 && !aiRanked && (
        <div className="flex items-center justify-center gap-4 mt-8 pb-8">
          <PaginationLink page={currentPage - 1} disabled={currentPage <= 1} label="← Précédent" />
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => {
                const d = Math.abs(p - currentPage);
                return d === 0 || d === 1 || d === 2 || p === 1 || p === totalPages;
              })
              .reduce<(number | "gap")[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push("gap");
                acc.push(p);
                return acc;
              }, [])
              .map((item, i) =>
                item === "gap" ? (
                  <span key={`gap-${i}`} className="font-mono text-xs text-gray-600 px-1">
                    ...
                  </span>
                ) : (
                  <PaginationLink key={item} page={item} active={item === currentPage} />
                )
              )}
          </div>
          <PaginationLink
            page={currentPage + 1}
            disabled={currentPage >= totalPages}
            label="Suivant →"
          />
        </div>
      )}
    </>
  );
}
