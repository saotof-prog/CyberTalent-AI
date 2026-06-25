import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CertificationUpload from "@/components/CertificationUpload";
import LabUpload from "@/components/LabUpload";
import SkillsManager from "@/components/skills-manager";
import JobRecommendations from "@/components/job-recommendations";
import GithubSync from "@/components/GithubSync";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      candidateProfile: {
        include: {
          certifications: true,
          skills: true,
          labs: true,
        },
      },
    },
  });

  const profile = user?.candidateProfile;
  if (!profile) redirect("/onboarding");

  const totalCerts = profile.certifications.length;
  const totalLabs = profile.labs.length;
  const score = Number(profile.cyberScore) || 0;

  return (
    <div className="min-h-screen bg-[#080c14]">
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-6 md:mb-8">
          <h1 className="font-mono text-2xl md:text-3xl font-bold text-white mb-2">
            Bonjour, <span className="text-[#00FF41]">{profile.firstName}</span> 👋
          </h1>
          <p className="text-gray-400 font-mono text-xs md:text-sm">
            {profile.headline || "// Tableau de bord CyberTalent AI"}
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
          {/* SCORE */}
          <div className="bg-[#0d1520] border border-[#00FF41]/20 rounded-xl p-4 md:p-6">
            <div className="font-mono text-xs text-gray-400 mb-2">CYBER SCORE</div>
            <div className="font-mono text-5xl md:text-6xl font-bold text-[#00FF41]">{score}</div>
            <div className="font-mono text-xs text-gray-500 mt-2">
              {score === 0 ? "Complete ton profil pour scorer" : "Top " + (100 - score) + "%"}
            </div>
            <div className="mt-4 h-2 bg-[#0A0A0A] rounded-full overflow-hidden">
              <div className="h-full bg-[#00FF41] rounded-full" style={{ width: score + "%" }} />
            </div>
          </div>

          {/* CERTIFICATIONS */}
          <div className="bg-[#0d1520] border border-[#00FF41]/20 rounded-xl p-4 md:p-6">
            <div className="font-mono text-xs text-gray-400 mb-2">CERTIFICATIONS</div>
            <div className="font-mono text-4xl font-bold text-white mb-4">{totalCerts}</div>
            {totalCerts > 0 && (
              <div className="flex flex-col gap-2">
                {profile.certifications.slice(0, 3).map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-center justify-between p-2 bg-[#0A0A0A] rounded-lg"
                  >
                    <div>
                      <div className="font-mono text-xs text-white">{cert.name}</div>
                      <div className="font-mono text-xs text-gray-400">{cert.issuer}</div>
                    </div>
                    <span
                      className={
                        "font-mono text-xs px-2 py-1 rounded border " +
                        (cert.status === "VERIFIED"
                          ? "border-[#00FF41] text-[#00FF41]"
                          : "border-[#ffaa00] text-[#ffaa00]")
                      }
                    >
                      {cert.status === "VERIFIED" ? "✓" : "⏳"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LABS */}
          <div className="bg-[#0d1520] border border-[#00FF41]/20 rounded-xl p-4 md:p-6">
            <div className="font-mono text-xs text-gray-400 mb-2">LABS COMPLÉTÉS</div>
            <div className="font-mono text-4xl font-bold text-white">{totalLabs}</div>
            <div className="font-mono text-xs text-gray-500 mt-2">HackTheBox, TryHackMe...</div>
          </div>
        </div>

        {/* PROFIL INFO */}
        <div className="bg-[#0d1520] border border-[#00FF41]/20 rounded-xl p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <div className="w-1 h-4 bg-[#00FF41] rounded" />
            <span className="font-mono text-sm text-[#00FF41]">MON PROFIL</span>
            <div className="ml-auto flex items-center gap-3">
              <span className="font-mono text-xs text-gray-400">
                {profile.profileComplete}% complété
              </span>
              <Link
                href="/dashboard/edit"
                className="font-mono text-xs px-3 py-1 rounded border border-[#00FF41]/30 text-[#00FF41] hover:bg-[#00FF41]/10 transition"
              >
                ✎ Modifier
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div>
              <div className="font-mono text-xs text-gray-400 mb-1">NOM COMPLET</div>
              <div className="font-mono text-xs md:text-sm text-white">
                {profile.firstName} {profile.lastName}
              </div>
            </div>
            <div>
              <div className="font-mono text-xs text-gray-400 mb-1">LOCALISATION</div>
              <div className="font-mono text-xs md:text-sm text-white">
                {profile.location || "—"}, {profile.country || "—"}
              </div>
            </div>
            <div>
              <div className="font-mono text-xs text-gray-400 mb-1">GITHUB</div>
              <div className="font-mono text-xs md:text-sm text-[#00FF41] truncate">
                {profile.githubUsername ? "@" + profile.githubUsername : "—"}
              </div>
              <div className="mt-2">
                <GithubSync username={profile.githubUsername} syncedAt={profile.githubSyncedAt} />
              </div>
            </div>
            <div>
              <div className="font-mono text-xs text-gray-400 mb-1">DISPONIBILITÉ</div>
              <div
                className={
                  "font-mono text-xs md:text-sm " +
                  (profile.isAvailable ? "text-[#00FF41]" : "text-[#FF3333]")
                }
              >
                {profile.isAvailable ? "✓ Disponible" : "✗ Indisponible"}
              </div>
            </div>
          </div>
          {profile.bio && (
            <div className="mt-4 pt-4 border-t border-[#00FF41]/10">
              <div className="font-mono text-xs text-gray-400 mb-1">BIO</div>
              <div className="font-mono text-xs md:text-sm text-gray-300">{profile.bio}</div>
            </div>
          )}
        </div>

        {/* SKILLS + CERTIFICATIONS — 2-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <SkillsManager />
          <CertificationUpload />
        </div>

        {/* LABS + OFFRES — 2-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div id="add-lab">
            <LabUpload />
          </div>
          <JobRecommendations />
        </div>
      </div>
    </div>
  );
}
