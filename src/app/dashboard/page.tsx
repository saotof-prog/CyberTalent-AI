import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import CertificationUpload from "@/components/CertificationUpload";
import LabUpload from "@/components/LabUpload";
import SkillsManager from "@/components/skills-manager";
import JobRecommendations from "@/components/job-recommendations";

const prisma = new PrismaClient();

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

  // Redirect based on user role
  if (user?.role === "RECRUITER") {
    // For recruiters, check if they have a recruiter profile or redirect to recruiter onboarding
    // Since we don't fetch recruiter profile in this query, we'll check if they have any candidate data
    // As a fallback, if they have no candidate data, send them to recruiter onboarding
    const hasCandidateData = user.candidateProfile &&
      (user.candidateProfile.certifications.length > 0 ||
       user.candidateProfile.skills.length > 0 ||
       user.candidateProfile.labs.length > 0);

    if (!hasCandidateData) {
      redirect("/onboarding/recruiter");
    }
    // If they have candidate data, they might be both roles - continue to candidate dashboard
    // (or we could show a role selector - but for now, let them access candidate dashboard)
  } else {
    // Default to candidate logic
    const profile = user?.candidateProfile;
    if (!profile) redirect("/onboarding");
  }

  const profile = user?.candidateProfile;
  if (!profile) redirect("/onboarding"); // This line is now redundant but kept for safety

  const totalCerts = profile.certifications.length;
  const totalLabs = profile.labs.length;
  const score = Number(profile.cyberScore) || 0;

  return (
    <div className="min-h-screen bg-[#080c14]">
      <div className="p-4 md:p-6 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-6 md:mb-8">
          <h1 className="font-mono text-2xl md:text-3xl font-bold text-white mb-2">
            Bonjour, <span className="text-[#00c896]">{profile.firstName}</span> 👋
          </h1>
          <p className="text-gray-400 font-mono text-xs md:text-sm">
            {profile.headline || "// Tableau de bord CyberTalent AI"}
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
          {/* SCORE */}
          <div className="bg-[#0d1520] border border-[#00c896]/20 rounded-xl p-4 md:p-6">
            <div className="font-mono text-xs text-gray-400 mb-2">CYBER SCORE</div>
            <div className="font-mono text-5xl md:text-6xl font-bold text-[#00c896]">{score}</div>
            <div className="font-mono text-xs text-gray-500 mt-2">
              {score === 0 ? "Complete ton profil pour scorer" : "Top " + (100 - score) + "%"}
            </div>
            <div className="mt-4 h-2 bg-[#111d2e] rounded-full overflow-hidden">
              <div className="h-full bg-[#00c896] rounded-full" style={{ width: score + "%" }} />
            </div>
          </div>

          {/* CERTIFICATIONS */}
          <div className="bg-[#0d1520] border border-[#00c896]/20 rounded-xl p-4 md:p-6">
            <div className="font-mono text-xs text-gray-400 mb-2">CERTIFICATIONS</div>
            <div className="font-mono text-4xl font-bold text-white mb-4">{totalCerts}</div>
            {totalCerts > 0 && (
              <div className="flex flex-col gap-2">
                {profile.certifications.slice(0, 3).map((cert: any) => (
                  <div key={cert.id} className="flex items-center justify-between p-2 bg-[#111d2e] rounded-lg">
                    <div>
                      <div className="font-mono text-xs text-white">{cert.name}</div>
                      <div className="font-mono text-xs text-gray-400">{cert.issuer}</div>
                    </div>
                    <span className={"font-mono text-xs px-2 py-1 rounded border " + (
                      cert.status === "VERIFIED"
                        ? "border-[#00c896] text-[#00c896]"
                        : "border-[#ffaa00] text-[#ffaa00]"
                    )}>
                      {cert.status === "VERIFIED" ? "✓" : "⏳"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LABS */}
          <div className="bg-[#0d1520] border border-[#00c896]/20 rounded-xl p-4 md:p-6">
            <div className="font-mono text-xs text-gray-400 mb-2">LABS COMPLÉTÉS</div>
            <div className="font-mono text-4xl font-bold text-white">{totalLabs}</div>
            <div className="font-mono text-xs text-gray-500 mt-2">HackTheBox, TryHackMe...</div>
          </div>
        </div>

        {/* PROFIL INFO */}
        <div className="bg-[#0d1520] border border-[#00c896]/20 rounded-xl p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <div className="w-1 h-4 bg-[#00c896] rounded" />
            <span className="font-mono text-sm text-[#00c896]">MON PROFIL</span>
            <span className="ml-auto font-mono text-xs text-gray-400">{profile.profileComplete}% complété</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div>
              <div className="font-mono text-xs text-gray-400 mb-1">NOM COMPLET</div>
              <div className="font-mono text-xs md:text-sm text-white">{profile.firstName} {profile.lastName}</div>
            </div>
            <div>
              <div className="font-mono text-xs text-gray-400 mb-1">LOCALISATION</div>
              <div className="font-mono text-xs md:text-sm text-white">
                {profile.location || "—"}, {profile.country || "—"}
              </div>
            </div>
            <div>
              <div className="font-mono text-xs text-gray-400 mb-1">GITHUB</div>
              <div className="font-mono text-xs md:text-sm text-[#00c896] truncate">
                {profile.githubUsername ? "@" + profile.githubUsername : "—"}
              </div>
            </div>
            <div>
              <div className="font-mono text-xs text-gray-400 mb-1">DISPONIBILITÉ</div>
              <div className={"font-mono text-xs md:text-sm " + (profile.isAvailable ? "text-[#00c896]" : "text-[#ff4060]")}>
                {profile.isAvailable ? "✓ Disponible" : "✗ Indisponible"}
              </div>
            </div>
          </div>
          {profile.bio && (
            <div className="mt-4 pt-4 border-t border-[#00c896]/10">
              <div className="font-mono text-xs text-gray-400 mb-1">BIO</div>
              <div className="font-mono text-xs md:text-sm text-gray-300">{profile.bio}</div>
            </div>
          )}
        </div>

        {/* SKILLS */}
        <div className="mb-6 md:mb-8">
          <SkillsManager />
        </div>

        {/* UPLOAD CERTIFICATION */}
        <div className="mb-6 md:mb-8">
          <CertificationUpload />
        </div>

        {/* UPLOAD LAB */}
        <div className="mb-6 md:mb-8" id="add-lab">
          <LabUpload />
        </div>

        {/* OFFRES */}
        <div className="mb-6 md:mb-8">
          <JobRecommendations />
        </div>

      </div>
    </div>
  );
}