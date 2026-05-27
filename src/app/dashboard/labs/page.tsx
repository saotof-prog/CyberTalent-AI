import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import LabUpload from "@/components/LabUpload";

export default async function LabsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { candidateProfile: { include: { labs: true } } },
  });

  if (!user?.candidateProfile) redirect("/onboarding");
  const labs = user.candidateProfile.labs;

  const diffColor: Record<string, string> = {
    EASY: "text-[#00c896] border-[#00c896]",
    MEDIUM: "text-[#ffaa00] border-[#ffaa00]",
    HARD: "text-[#ff4060] border-[#ff4060]",
    INSANE: "text-purple-400 border-purple-400",
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-bold text-white mb-1">
          Mes <span className="text-[#0084ff]">Labs</span> 🧪
        </h1>
        <p className="font-mono text-xs text-gray-400">{labs.length} lab(s) complété(s)</p>
      </div>

      {labs.length === 0 ? (
        <div className="text-center py-12 bg-[#0d1520] border border-[#0084ff]/20 rounded-xl mb-8">
          <div className="text-4xl mb-3">🧪</div>
          <p className="font-mono text-sm text-gray-500">
            Aucun lab complété pour l&apos;instant.
          </p>
          <p className="font-mono text-xs text-gray-600 mt-1">
            Ajoute tes labs HackTheBox, TryHackMe, etc. ci-dessous
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mb-8">
          {labs.map((lab) => (
            <div key={lab.id} className="bg-[#0d1520] border border-[#0084ff]/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-mono text-sm font-bold text-white">{lab.labName}</div>
                <span className={`font-mono text-xs px-2 py-1 rounded border ${diffColor[lab.difficulty] ?? "text-gray-400 border-gray-400"}`}>
                  {lab.difficulty}
                </span>
              </div>
              <div className="font-mono text-xs text-gray-400">{lab.platform}</div>
              {lab.category && <div className="font-mono text-xs text-gray-500">{lab.category}</div>}
              <div className="font-mono text-xs text-gray-600 mt-1">
                {new Date(lab.completedAt).toLocaleDateString("fr-FR")}
              </div>
            </div>
          ))}
        </div>
      )}

      <LabUpload />
    </div>
  );
}