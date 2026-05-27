import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function SkillsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      candidateProfile: {
        include: { skills: { include: { skill: true } } },
      },
    },
  });

  if (!user?.candidateProfile) redirect("/onboarding");
  const skills = user.candidateProfile.skills;

  const levelColor: Record<string, string> = {
    BEGINNER: "text-gray-400 border-gray-600",
    INTERMEDIATE: "text-[#0084ff] border-[#0084ff]",
    ADVANCED: "text-[#ffaa00] border-[#ffaa00]",
    EXPERT: "text-[#00c896] border-[#00c896]",
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-bold text-white mb-1">
          Mes <span className="text-[#ffaa00]">Skills</span> 💡
        </h1>
        <p className="font-mono text-xs text-gray-400">{skills.length} compétence(s) ajoutée(s)</p>
      </div>

      {skills.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {skills.map((s) => (
            <div key={s.id} className="bg-[#0d1520] border border-[#ffaa00]/20 rounded-xl p-4">
              <div className="font-mono text-sm font-bold text-white mb-2">{s.skill?.name ?? s.skillId}</div>
              <span className={`font-mono text-xs px-2 py-1 rounded border ${levelColor[s.level] ?? "text-gray-400 border-gray-600"}`}>
                {s.level}
              </span>
              {s.yearsExp && (
                <div className="font-mono text-xs text-gray-500 mt-2">{s.yearsExp} ans exp.</div>
              )}
            </div>
          ))}
        </div>
      )}

      {skills.length === 0 && (
        <div className="text-center py-12 text-gray-500 font-mono text-sm bg-[#0d1520] border border-[#ffaa00]/20 rounded-xl mb-8">
          Aucun skill ajouté pour linstant.
        </div>
      )}
    </div>
  );
}