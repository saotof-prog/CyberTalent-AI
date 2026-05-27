import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import SaveButton from "./save-button";

export default async function CandidateProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;

  const candidate = await prisma.candidateProfile.findUnique({
    where: { id },
    include: {
      user: true,
      certifications: true,
      labs: true,
      skills: { include: { skill: true } },
    },
  });

  if (!candidate) redirect("/recruiter/dashboard");

  // Vérifier si déjà sauvegardé
  const recruiter = await prisma.recruiterProfile.findFirst({
    where: { user: { clerkId: userId } },
  });

  const isSaved = recruiter ? !!(await prisma.savedCandidate.findUnique({
    where: {
      recruiterId_candidateId: {
        recruiterId: recruiter.id,
        candidateId: candidate.id,
      },
    },
  })) : false;

  const githubUrl = "https://github.com/" + candidate.githubUsername;
  const mailtoUrl = "mailto:" + candidate.user.email;

  const diffColor: Record<string, string> = {
    EASY: "text-[#00c896] border-[#00c896]",
    MEDIUM: "text-[#ffaa00] border-[#ffaa00]",
    HARD: "text-[#ff4060] border-[#ff4060]",
    INSANE: "text-purple-400 border-purple-400",
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-white">
      <div className="p-4 md:p-6 max-w-4xl mx-auto">

        {/* HEADER PROFIL */}
        <div className="bg-[#0d1520] border border-[#ff4060]/20 rounded-xl p-5 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="font-mono text-2xl md:text-3xl font-bold text-white mb-1">
                {candidate.firstName} {candidate.lastName}
              </h1>
              <p className="font-mono text-[#ff4060] text-sm mb-3">{candidate.headline}</p>
              <div className="flex flex-wrap items-center gap-3 text-gray-400 font-mono text-xs">
                {candidate.location && (
                  <span>📍 {candidate.location}, {candidate.country}</span>
                )}
                {candidate.githubUsername && (
                  <a href={githubUrl} target="_blank" className="text-[#00c896] hover:underline">
                    ⬡ @{candidate.githubUsername}
                  </a>
                )}
                {candidate.isAvailable && (
                  <span className="px-2 py-1 rounded bg-[#00c896]/10 border border-[#00c896]/30 text-[#00c896]">
                    ✓ Disponible
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center w-24 h-24 md:w-28 md:h-28 bg-[#111d2e] border-2 border-[#ff4060]/50 rounded-xl flex-shrink-0">
              <div className="font-mono text-3xl md:text-4xl font-bold text-[#ff4060]">{candidate.cyberScore}</div>
              <div className="font-mono text-xs text-gray-500">CyberScore</div>
            </div>
          </div>
          {candidate.bio && (
            <p className="font-mono text-sm text-gray-400 mt-4 leading-relaxed border-t border-gray-800 pt-4">
              {candidate.bio}
            </p>
          )}
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-[#0d1520] border border-[#ff4060]/20 rounded-xl p-4 text-center">
            <div className="font-mono text-2xl md:text-3xl font-bold text-[#ff4060]">{candidate.certifications.length}</div>
            <div className="font-mono text-xs text-gray-400 mt-1">Certifications</div>
          </div>
          <div className="bg-[#0d1520] border border-[#ff4060]/20 rounded-xl p-4 text-center">
            <div className="font-mono text-2xl md:text-3xl font-bold text-[#0084ff]">{candidate.labs.length}</div>
            <div className="font-mono text-xs text-gray-400 mt-1">Labs</div>
          </div>
          <div className="bg-[#0d1520] border border-[#ff4060]/20 rounded-xl p-4 text-center">
            <div className="font-mono text-2xl md:text-3xl font-bold text-[#ffaa00]">{candidate.skills.length}</div>
            <div className="font-mono text-xs text-gray-400 mt-1">Skills</div>
          </div>
        </div>

        {/* CERTIFICATIONS + SKILLS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* CERTIFICATIONS */}
          <div className="bg-[#0d1520] border border-[#ff4060]/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 bg-[#ff4060] rounded" />
              <span className="font-mono text-sm text-[#ff4060]">
                CERTIFICATIONS ({candidate.certifications.length})
              </span>
            </div>
            {candidate.certifications.length === 0 ? (
              <p className="font-mono text-xs text-gray-600">Aucune certification</p>
            ) : (
              <div className="flex flex-col gap-2">
                {candidate.certifications.map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between bg-[#111d2e] rounded-lg px-3 py-2">
                    <div>
                      <div className="font-mono text-sm text-white">{cert.name}</div>
                      <div className="font-mono text-xs text-gray-500">{cert.issuer}</div>
                    </div>
                    <span className={
                      cert.status === "VERIFIED"
                        ? "font-mono text-xs px-2 py-0.5 rounded bg-[#00c896]/10 text-[#00c896] border border-[#00c896]/30"
                        : "font-mono text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-500"
                    }>
                      {cert.status === "VERIFIED" ? "✓ Vérifié" : "⏳"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SKILLS */}
          <div className="bg-[#0d1520] border border-[#ff4060]/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 bg-[#ff4060] rounded" />
              <span className="font-mono text-sm text-[#ff4060]">SKILLS ({candidate.skills.length})</span>
            </div>
            {candidate.skills.length === 0 ? (
              <p className="font-mono text-xs text-gray-600">Aucun skill renseigné</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <span key={skill.id} className="font-mono text-xs px-3 py-1 rounded-full bg-[#ff4060]/10 border border-[#ff4060]/20 text-[#ff4060]">
                    {skill.skill?.name ?? skill.skillId} · {skill.level}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* LABS */}
        <div className="bg-[#0d1520] border border-[#ff4060]/20 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-[#ff4060] rounded" />
            <span className="font-mono text-sm text-[#ff4060]">LABS ({candidate.labs.length})</span>
          </div>
          {candidate.labs.length === 0 ? (
            <p className="font-mono text-xs text-gray-600">Aucun lab complété</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {candidate.labs.map((lab) => (
                <div key={lab.id} className="bg-[#111d2e] rounded-lg px-4 py-3 border border-gray-800">
                  <div className="font-mono text-sm text-white mb-1">{lab.labName}</div>
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-xs text-gray-500">{lab.platform}</div>
                    <span className={`font-mono text-xs px-2 py-0.5 rounded border ${diffColor[lab.difficulty] ?? "text-gray-400 border-gray-600"}`}>
                      {lab.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <SaveButton
            candidateId={candidate.id}
            initialSaved={isSaved}
          />
          <a
            href={mailtoUrl}
            className="font-mono text-sm px-6 py-3 bg-[#ff4060] hover:bg-[#ff2040] text-white rounded-lg transition font-bold text-center"
          >
            ✉ Contacter ce candidat
          </a>
        </div>

      </div>
    </div>
  );
}