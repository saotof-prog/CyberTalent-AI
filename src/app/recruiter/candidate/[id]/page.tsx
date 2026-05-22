import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function CandidateProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;  // ← await ici

  const candidate = await prisma.candidateProfile.findUnique({
    where: { id },  // ← utilise id directement
    include: {
      user: true,
      certifications: true,
      labs: true,
      skills: true,
    },
  });

  if (!candidate) redirect("/recruiter/dashboard");

  const githubUrl = "https://github.com/" + candidate.githubUsername;
  const mailtoUrl = "mailto:" + candidate.user.email;

  return (
    <div className="min-h-screen bg-[#080c14] text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#ff4060]/20 bg-[#080c14]/95 backdrop-blur sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/recruiter/dashboard" className="font-mono text-xs text-gray-400 hover:text-[#ff4060] transition">
            ← Retour
          </Link>
          <div className="w-px h-4 bg-gray-700" />
          <span className="font-mono text-[#ff4060] font-bold text-sm">PROFIL CANDIDAT</span>
        </div>
      </nav>

      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-[#0d1520] border border-[#ff4060]/20 rounded-xl p-8 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-mono text-3xl font-bold text-white mb-1">
                {candidate.firstName} {candidate.lastName}
              </h1>
              <p className="font-mono text-[#ff4060] text-sm mb-2">{candidate.headline}</p>
              <div className="flex items-center gap-4 text-gray-400 font-mono text-xs">
                <span>📍 {candidate.location}, {candidate.country}</span>
                {candidate.githubUsername && (
                  <a href={githubUrl} target="_blank" className="text-[#00c896] hover:underline">
                    @{candidate.githubUsername}
                  </a>
                )}
                {candidate.isAvailable && (
                  <span className="px-2 py-1 rounded bg-[#00c896]/10 border border-[#00c896]/30 text-[#00c896]">
                    ✓ Disponible
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center w-28 h-28 bg-[#111d2e] border-2 border-[#ff4060]/50 rounded-xl">
              <div className="font-mono text-4xl font-bold text-[#ff4060]">{candidate.cyberScore}</div>
              <div className="font-mono text-xs text-gray-500">CyberScore</div>
            </div>
          </div>
          {candidate.bio && (
            <p className="font-mono text-sm text-gray-400 mt-6 leading-relaxed border-t border-gray-800 pt-4">
              {candidate.bio}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-[#0d1520] border border-[#ff4060]/20 rounded-xl p-6">
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
                    <span className="font-mono text-sm text-white">{cert.name}</span>
                    <span className={
                      cert.status === "VERIFIED"
                        ? "font-mono text-xs px-2 py-0.5 rounded bg-[#00c896]/10 text-[#00c896] border border-[#00c896]/30"
                        : "font-mono text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-500"
                    }>
                      {cert.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#0d1520] border border-[#ff4060]/20 rounded-xl p-6">
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
                    {skill.skillId}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#0d1520] border border-[#ff4060]/20 rounded-xl p-6 col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 bg-[#ff4060] rounded" />
              <span className="font-mono text-sm text-[#ff4060]">LABS ({candidate.labs.length})</span>
            </div>
            {candidate.labs.length === 0 ? (
              <p className="font-mono text-xs text-gray-600">Aucun lab complété</p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {candidate.labs.map((lab) => (
                  <div key={lab.id} className="bg-[#111d2e] rounded-lg px-4 py-3 border border-gray-800">
                    <div className="font-mono text-sm text-white mb-1">{lab.labName}</div>
                    {lab.platform && (
                      <div className="font-mono text-xs text-gray-500">{lab.platform}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <a href={mailtoUrl} className="font-mono text-sm px-6 py-3 bg-[#ff4060] hover:bg-[#ff4060]/80 text-white rounded-lg transition font-bold">
            ✉ Contacter ce candidat
          </a>
        </div>
      </div>
    </div>
  );
}