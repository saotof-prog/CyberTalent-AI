import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminLabVerifyActions from "./verify-actions";

export default async function AdminLabDetailPage(props: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await props.params;

  const lab = await prisma.labCompletion.findUnique({
    where: { id },
    include: {
      candidate: { include: { user: true } },
    },
  });

  if (!lab) notFound();

  const platformColors: Record<string, string> = {
    HACKTHEBOX: "text-[#00c896] border-[#00c896]/40",
    TRYHACKME: "text-[#ff4060] border-[#ff4060]/40",
    VULNHUB: "text-purple-400 border-purple-400/40",
    PWNEDLABS: "text-yellow-400 border-yellow-400/40",
    OFFENSIVESECURITY: "text-[#ffaa00] border-[#ffaa00]/40",
    PORTSWIGGER: "text-[#0084ff] border-[#0084ff]/40",
    CUSTOM: "text-gray-400 border-gray-400/40",
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <a
          href="/admin/labs"
          className="font-mono text-xs text-gray-500 hover:text-white transition"
        >
          ← Retour labs
        </a>
        <h1 className="font-mono text-2xl font-bold text-white mt-2">
          🧪 {lab.labName}
        </h1>
        <p className="font-mono text-xs text-gray-400">{lab.platform} • {lab.difficulty}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <div className="bg-[#0d1520] border border-[#0084ff]/20 rounded-xl p-4 space-y-3">
          <h2 className="font-mono text-sm text-[#0084ff]">Informations</h2>
          <div className="space-y-2">
            <div>
              <span className="font-mono text-xs text-gray-500">Statut</span>
              <div>
                <span
                  className={`font-mono text-xs px-2 py-0.5 rounded-full border ${
                    lab.isVerified
                      ? "border-[#00c896] text-[#00c896]"
                      : "border-[#ffaa00] text-[#ffaa00]"
                  }`}
                >
                  {lab.isVerified ? "Vérifié" : "En attente"}
                </span>
              </div>
            </div>
            <div>
              <span className="font-mono text-xs text-gray-500">Plateforme</span>
              <div>
                <span
                  className={`font-mono text-xs px-2 py-0.5 rounded-full border ${platformColors[lab.platform] ?? "text-gray-400 border-gray-400/40"}`}
                >
                  {lab.platform}
                </span>
              </div>
            </div>
            <div>
              <span className="font-mono text-xs text-gray-500">Difficulté</span>
              <div className="font-mono text-sm text-white">{lab.difficulty}</div>
            </div>
            {lab.category && (
              <div>
                <span className="font-mono text-xs text-gray-500">Catégorie</span>
                <div className="font-mono text-sm text-white">{lab.category}</div>
              </div>
            )}
            <div>
              <span className="font-mono text-xs text-gray-500">Points</span>
              <div className="font-mono text-sm text-white">{lab.points}</div>
            </div>
            {lab.isFirstBlood && (
              <div>
                <span className="font-mono text-xs text-gray-500">First Blood</span>
                <div className="font-mono text-sm text-[#ffaa00]">🏆 Oui</div>
              </div>
            )}
            <div>
              <span className="font-mono text-xs text-gray-500">Complété le</span>
              <div className="font-mono text-sm text-white">
                {new Date(lab.completedAt).toLocaleDateString("fr-FR")}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0d1520] border border-[#0084ff]/20 rounded-xl p-4 space-y-3">
          <h2 className="font-mono text-sm text-[#0084ff]">Candidat</h2>
          <div className="space-y-2">
            <div>
              <span className="font-mono text-xs text-gray-500">Nom</span>
              <div className="font-mono text-sm text-white">
                {lab.candidate.firstName} {lab.candidate.lastName}
              </div>
            </div>
            <div>
              <span className="font-mono text-xs text-gray-500">Email</span>
              <div className="font-mono text-sm text-white">{lab.candidate.user.email}</div>
            </div>
            <div>
              <span className="font-mono text-xs text-gray-500">CyberScore</span>
              <div className="font-mono text-sm text-[#0084ff]">{lab.candidate.cyberScore}</div>
            </div>
          </div>
        </div>
      </div>

      {lab.proofUrl && (
        <div className="bg-[#0d1520] border border-[#0084ff]/20 rounded-xl p-4 mb-4">
          <h2 className="font-mono text-sm text-[#0084ff] mb-2">Preuve</h2>
          <a
            href={lab.proofUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-[#0084ff] hover:underline break-all"
          >
            {lab.proofUrl}
          </a>
        </div>
      )}

      {!lab.isVerified && (
        <AdminLabVerifyActions labId={lab.id} labName={lab.labName} />
      )}
    </div>
  );
}
