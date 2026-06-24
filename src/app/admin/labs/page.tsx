import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminLabsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const labs = await prisma.labCompletion.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      candidate: { select: { firstName: true, lastName: true, cyberScore: true } },
    },
  });

  const total = labs.length;
  const verified = labs.filter((l) => l.isVerified).length;
  const pending = labs.filter((l) => !l.isVerified).length;

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
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-bold text-white mb-1">
          🧪 Gestion des <span className="text-[#0084ff]">Labs</span>
        </h1>
        <p className="font-mono text-xs text-gray-400">{total} lab(s)</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-[#0d1520] border border-[#0084ff]/20 rounded-xl p-4">
          <div className="font-mono text-xs text-gray-400">Total</div>
          <div className="font-mono text-2xl font-bold text-white">{total}</div>
        </div>
        <div className="bg-[#0d1520] border border-[#00c896]/20 rounded-xl p-4">
          <div className="font-mono text-xs text-gray-400">Vérifiés</div>
          <div className="font-mono text-2xl font-bold text-[#00c896]">{verified}</div>
        </div>
        <div className="bg-[#0d1520] border border-[#ffaa00]/20 rounded-xl p-4">
          <div className="font-mono text-xs text-gray-400">En attente</div>
          <div className="font-mono text-2xl font-bold text-[#ffaa00]">{pending}</div>
        </div>
      </div>

      {labs.length === 0 ? (
        <div className="text-center py-12 font-mono text-sm text-gray-500">Aucun lab</div>
      ) : (
        <div className="bg-[#0d1520] border border-[#0084ff]/20 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#0084ff]/10">
                  <th className="font-mono text-xs text-gray-400 text-left p-3">Date</th>
                  <th className="font-mono text-xs text-gray-400 text-left p-3">Candidat</th>
                  <th className="font-mono text-xs text-gray-400 text-left p-3">Lab</th>
                  <th className="font-mono text-xs text-gray-400 text-left p-3">Plateforme</th>
                  <th className="font-mono text-xs text-gray-400 text-left p-3">Difficulté</th>
                  <th className="font-mono text-xs text-gray-400 text-left p-3">Score</th>
                  <th className="font-mono text-xs text-gray-400 text-left p-3">Statut</th>
                  <th className="font-mono text-xs text-gray-400 text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {labs.map((l) => (
                  <tr
                    key={l.id}
                    className="border-b border-[#0084ff]/5 hover:bg-[#111d2e] transition"
                  >
                    <td className="p-3 font-mono text-xs text-gray-500">
                      {new Date(l.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="p-3 font-mono text-sm text-white">
                      {l.candidate.firstName} {l.candidate.lastName}
                    </td>
                    <td className="p-3 font-mono text-sm text-white">{l.labName}</td>
                    <td className="p-3">
                      <span
                        className={`font-mono text-xs px-2 py-0.5 rounded-full border ${platformColors[l.platform] ?? "text-gray-400 border-gray-400/40"}`}
                      >
                        {l.platform}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-xs text-gray-400">{l.difficulty}</td>
                    <td className="p-3 font-mono text-sm text-white">{l.candidate.cyberScore}</td>
                    <td className="p-3">
                      <span
                        className={`font-mono text-xs px-2 py-0.5 rounded-full border ${
                          l.isVerified
                            ? "border-[#00c896] text-[#00c896]"
                            : "border-[#ffaa00] text-[#ffaa00]"
                        }`}
                      >
                        {l.isVerified ? "Vérifié" : "En attente"}
                      </span>
                    </td>
                    <td className="p-3">
                      <Link
                        href={`/admin/labs/${l.id}`}
                        className="font-mono text-xs text-[#0084ff] hover:underline"
                      >
                        Détails
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
