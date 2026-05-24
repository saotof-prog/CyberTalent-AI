"use client";

import { useState, useEffect } from "react";

type Job = {
  id: string;
  title: string;
  mode: string;
  type: string;
  country: string | null;
  location: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  isUrgent: boolean;
  matchScore: number;
  tags: string[];
};

const MODE_LABELS: Record<string, string> = {
  REMOTE: "Remote",
  ONSITE: "On-site",
  HYBRID: "Hybrid",
};

const TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  FREELANCE: "Freelance",
  INTERNSHIP: "Stage",
};

export default function JobRecommendations() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/candidate/recommendations")
      .then((r) => r.json())
      .then((data) => { setJobs(data); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="bg-[#0d1520] border border-[#00c896]/20 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-4 bg-[#0084ff] rounded" />
          <span className="font-mono text-sm text-[#0084ff]">OFFRES RECOMMANDÉES PAR L'IA</span>
        </div>
        <div className="text-center py-8 text-gray-500 font-mono text-sm animate-pulse">
          Analyse en cours...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0d1520] border border-[#00c896]/20 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-4 bg-[#0084ff] rounded" />
        <span className="font-mono text-sm text-[#0084ff]">OFFRES RECOMMANDÉES PAR L'IA</span>
        {jobs.length > 0 && (
          <span className="ml-auto font-mono text-xs text-gray-500">{jobs.length} offres compatibles</span>
        )}
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-8 text-gray-500 font-mono text-sm">
          Aucune offre compatible pour l'instant. Complete ton profil et ajoute des skills.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div key={job.id} className="bg-[#111d2e] border border-gray-800 hover:border-[#0084ff]/40 rounded-xl p-4 transition">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-mono text-sm font-bold text-white">{job.title}</h3>
                    {job.isUrgent && (
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#ff4060]/10 border border-[#ff4060]/30 text-[#ff4060]">
                        URGENT
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <span className="font-mono text-xs text-gray-400">
                      {job.location ? job.location + ", " : ""}{job.country ?? ""}
                    </span>
                    <span className="font-mono text-xs text-gray-500">
                      {MODE_LABELS[job.mode]} · {TYPE_LABELS[job.type]}
                    </span>
                    {job.salaryMin && (
                      <span className="font-mono text-xs text-[#00c896]">
                        ${job.salaryMin.toLocaleString()} — ${job.salaryMax?.toLocaleString() ?? "?"}/mois
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {job.tags.slice(0, 5).map((tag) => (
                      <span key={tag} className="font-mono text-[10px] px-2 py-0.5 rounded-full border border-gray-700 text-gray-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* MATCH SCORE */}
                <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg border border-[#0084ff]/30 bg-[#0d1520] shrink-0">
                  <div className={
                    "font-mono text-xl font-bold " +
                    (job.matchScore >= 70 ? "text-[#00c896]" : job.matchScore >= 40 ? "text-[#ffaa00]" : "text-gray-400")
                  }>
                    {job.matchScore}
                  </div>
                  <div className="font-mono text-[10px] text-gray-500">match</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}