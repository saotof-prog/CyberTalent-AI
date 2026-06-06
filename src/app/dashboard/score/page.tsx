import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ScoreButton from "./score-button";

export default async function ScorePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      candidateProfile: {
        include: { scoreHistory: { orderBy: { createdAt: "desc" }, take: 5 } },
      },
    },
  });

  if (!user?.candidateProfile) redirect("/onboarding");
  const profile = user.candidateProfile;

  // Parser les données IA depuis aiFlags
  const strengths = profile.aiFlags
    .filter(f => f.startsWith("STRENGTH:"))
    .map(f => f.replace("STRENGTH:", ""));

  const improvements = profile.aiFlags
    .filter(f => f.startsWith("IMPROVE:"))
    .map(f => f.replace("IMPROVE:", ""));

  const questions = profile.aiFlags
    .filter(f => f.startsWith("QUESTION:"))
    .map(f => f.replace("QUESTION:", ""));

  const fakeDetected = profile.aiFlags.includes("FAKE_SKILLS_DETECTED");

  const scoreLevel = profile.cyberScore >= 75 ? "EXPERT"
    : profile.cyberScore >= 50 ? "ADVANCED"
    : profile.cyberScore >= 25 ? "INTERMEDIATE"
    : "BEGINNER";

  const levelColor = {
    EXPERT: "text-[#00c896]",
    ADVANCED: "text-[#0084ff]",
    INTERMEDIATE: "text-[#ffaa00]",
    BEGINNER: "text-gray-400",
  }[scoreLevel];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-bold text-white mb-1">
          Mon <span className="text-[#00c896]">Score IA</span> 📊
        </h1>
        <p className="font-mono text-xs text-gray-400">Calculé par Google Gemini AI</p>
      </div>

      {/* Score principal */}
      <div className="bg-[#0d1520] border border-[#00c896]/20 rounded-xl p-8 mb-6 text-center">
        <div className="font-mono text-8xl font-bold text-[#00c896] mb-2">
          {profile.cyberScore}
        </div>
        <div className={`font-mono text-sm font-bold mb-1 ${levelColor}`}>
          {scoreLevel}
        </div>
        <div className="font-mono text-xs text-gray-400 mb-4">CyberScore / 100</div>
        <div className="w-full h-3 bg-[#111d2e] rounded-full overflow-hidden mb-6 max-w-md mx-auto">
          <div
            className="h-full bg-[#00c896] rounded-full transition-all"
            style={{width: `${profile.cyberScore}%`}}
          />
        </div>
        {profile.aiSummary && (
          <p className="font-mono text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed italic">
            &ldquo;{profile.aiSummary}&rdquo;
          </p>
        )}
        {!profile.aiSummary && (
          <p className="font-mono text-xs text-gray-500">
            Clique sur &ldquo;Recalculer&rdquo; pour générer ton analyse IA
          </p>
        )}
        <div className="mt-6">
          <ScoreButton />
        </div>
      </div>

      {/* Alerte fake skills */}
      {fakeDetected && (
        <div className="bg-[#ff4060]/10 border border-[#ff4060]/30 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 font-mono text-sm text-[#ff4060] font-bold">
            ⚠ Incohérence détectée
          </div>
          <p className="font-mono text-xs text-gray-400 mt-1">
            L&apos;IA a détecté des incohérences dans ton profil. Vérifie tes certifications et skills.
          </p>
        </div>
      )}

      {/* Points forts + Améliorations */}
      {(strengths.length > 0 || improvements.length > 0) && (
        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          {/* Points forts */}
          {strengths.length > 0 && (
            <div className="bg-[#0d1520] border border-[#00c896]/20 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 bg-[#00c896] rounded" />
                <span className="font-mono text-sm text-[#00c896]">POINTS FORTS</span>
              </div>
              <div className="flex flex-col gap-2">
                {strengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 font-mono text-xs text-gray-300">
                    <span className="text-[#00c896] mt-0.5">✓</span>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Axes d'amélioration */}
          {improvements.length > 0 && (
            <div className="bg-[#0d1520] border border-[#ffaa00]/20 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 bg-[#ffaa00] rounded" />
                <span className="font-mono text-sm text-[#ffaa00]">A AMELIORER</span>
              </div>
              <div className="flex flex-col gap-2">
                {improvements.map((imp, i) => (
                  <div key={i} className="flex items-start gap-2 font-mono text-xs text-gray-300">
                    <span className="text-[#ffaa00] mt-0.5">→</span>
                    {imp}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Questions d'interview */}
      {questions.length > 0 && (
        <div className="bg-[#0d1520] border border-[#0084ff]/20 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-[#0084ff] rounded" />
            <span className="font-mono text-sm text-[#0084ff]">
              QUESTIONS D&apos;INTERVIEW GENEREES PAR L&apos;IA
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {questions.map((q, i) => (
              <div key={i} className="p-3 bg-[#111d2e] rounded-lg border border-[#0084ff]/10">
                <span className="font-mono text-xs text-[#0084ff] mr-2">Q{i + 1}.</span>
                <span className="font-mono text-xs text-gray-300">{q}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historique */}
      {profile.scoreHistory.length > 0 && (
        <div className="bg-[#0d1520] border border-[#00c896]/20 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-[#00c896] rounded" />
            <span className="font-mono text-sm text-[#00c896]">HISTORIQUE</span>
          </div>
          <div className="flex flex-col gap-3">
            {profile.scoreHistory.map((h) => (
              <div key={h.id} className="flex items-center justify-between p-3 bg-[#111d2e] rounded-lg">
                <div>
                  <div className="font-mono text-xs text-gray-400">{h.reason}</div>
                  <div className="font-mono text-xs text-gray-600">
                    {new Date(h.createdAt).toLocaleDateString("fr-FR")}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-gray-500">{h.scoreBefore}</span>
                  <span className="font-mono text-xs text-gray-500">→</span>
                  <span className="font-mono text-sm font-bold text-[#00c896]">{h.scoreAfter}</span>
                  <span className={`font-mono text-xs ${h.delta >= 0 ? "text-[#00c896]" : "text-[#ff4060]"}`}>
                    {h.delta >= 0 ? "+" : ""}{h.delta}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}