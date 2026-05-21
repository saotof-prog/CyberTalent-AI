import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import ScoreButton from "./score-button";

const prisma = new PrismaClient();

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
        <div className="font-mono text-8xl font-bold text-[#00c896] mb-4">{profile.cyberScore}</div>
        <div className="font-mono text-sm text-gray-400 mb-2">CyberScore / 100</div>
        <div className="w-full h-3 bg-[#111d2e] rounded-full overflow-hidden mb-6 max-w-md mx-auto">
          <div className="h-full bg-[#00c896] rounded-full transition-all" style={{width: `${profile.cyberScore}%`}} />
        </div>
        {profile.aiSummary && (
          <p className="font-mono text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {profile.aiSummary}
          </p>
        )}
        <div className="mt-6">
          <ScoreButton />
        </div>
      </div>

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
                  <div className="font-mono text-xs text-gray-600">{new Date(h.createdAt).toLocaleDateString("fr-FR")}</div>
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