import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function SavedCandidatesPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const recruiter = await prisma.recruiterProfile.findFirst({
    where: { user: { clerkId: userId } },
  });

  if (!recruiter) redirect("/recruiter/dashboard");

  const saved = await prisma.savedCandidate.findMany({
    where: { recruiterId: recruiter.id },
    orderBy: { savedAt: "desc" },
  });

  const candidateIds = saved.map((s) => s.candidateId);
  const candidateProfiles = await prisma.candidateProfile.findMany({
    where: { id: { in: candidateIds } },
    include: {
      certifications: { where: { status: "VERIFIED" } },
      labs: true,
      skills: true,
    },
  });
  const candidates = candidateIds.map((id) => candidateProfiles.find((c) => c.id === id) ?? null);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-bold text-white mb-1">
          Candidats <span className="text-[#FF3333]">Sauvegardés</span> ★
        </h1>
        <p className="font-mono text-xs text-gray-400">{saved.length} candidat(s) sauvegardé(s)</p>
      </div>

      {saved.length === 0 ? (
        <div className="text-center py-16 bg-[#0d1520] border border-[#FF3333]/20 rounded-xl">
          <div className="text-4xl mb-4">★</div>
          <p className="font-mono text-sm text-gray-500 mb-4">
            Aucun candidat sauvegardé pour linstant.
          </p>
          <Link
            href="/recruiter/dashboard"
            className="font-mono text-xs px-6 py-3 bg-[#FF3333] text-white rounded-lg hover:bg-[#ff2040] transition inline-block"
          >
            Parcourir les candidats
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {saved.map((s, idx) => {
            const candidate = candidates[idx];
            if (!candidate) return null;
            return (
              <Link
                key={s.id}
                href={`/recruiter/candidate/${s.candidateId}`}
                className="bg-[#0d1520] border border-[#FF3333]/20 rounded-xl p-5 hover:border-[#FF3333] transition block"
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center justify-center w-16 h-16 bg-[#0A0A0A] border border-[#FF3333]/30 rounded-lg flex-shrink-0">
                    <div className="font-mono text-xl font-bold text-[#FF3333]">
                      {candidate.cyberScore}
                    </div>
                    <div className="font-mono text-xs text-gray-500">score</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="font-mono text-lg font-bold text-white">
                        {candidate.firstName} {candidate.lastName}
                      </h3>
                      {candidate.isAvailable && (
                        <span className="font-mono text-xs px-2 py-1 rounded bg-[#00FF41]/10 border border-[#00FF41]/30 text-[#00FF41]">
                          Disponible
                        </span>
                      )}
                      <span className="font-mono text-xs text-gray-500 ml-auto">
                        Sauvegardé le {new Date(s.savedAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    <p className="font-mono text-sm text-gray-400 mb-2">{candidate.headline}</p>
                    <div className="flex items-center gap-4 flex-wrap">
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
                        <span className="font-mono text-xs text-[#00FF41]">
                          @{candidate.githubUsername}
                        </span>
                      )}
                    </div>
                    {s.note && (
                      <div className="mt-2 font-mono text-xs text-gray-500 italic">
                        Note: {s.note}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
