import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminCertificationsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const certs = await prisma.certification.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      candidate: { select: { firstName: true, lastName: true, cyberScore: true } },
    },
  });

  const total = certs.length;
  const verified = certs.filter((c) => c.status === "VERIFIED").length;
  const rejected = certs.filter((c) => c.status === "REJECTED").length;
  const pending = certs.filter((c) => c.status === "PENDING" || c.status === "VERIFYING").length;

  const statusColor: Record<string, string> = {
    PENDING: "border-[#ffaa00] text-[#ffaa00]",
    VERIFYING: "border-[#0084ff] text-[#0084ff]",
    VERIFIED: "border-[#00c896] text-[#00c896]",
    REJECTED: "border-[#ff4060] text-[#ff4060]",
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-bold text-white mb-1">
          🏆 Gestion des <span className="text-[#0084ff]">Certifications</span>
        </h1>
        <p className="font-mono text-xs text-gray-400">{total} certification(s)</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="bg-[#0d1520] border border-[#0084ff]/20 rounded-xl p-4">
          <div className="font-mono text-xs text-gray-400">Total</div>
          <div className="font-mono text-2xl font-bold text-white">{total}</div>
        </div>
        <div className="bg-[#0d1520] border border-[#00c896]/20 rounded-xl p-4">
          <div className="font-mono text-xs text-gray-400">Vérifiées</div>
          <div className="font-mono text-2xl font-bold text-[#00c896]">{verified}</div>
        </div>
        <div className="bg-[#0d1520] border border-[#ffaa00]/20 rounded-xl p-4">
          <div className="font-mono text-xs text-gray-400">En attente</div>
          <div className="font-mono text-2xl font-bold text-[#ffaa00]">{pending}</div>
        </div>
        <div className="bg-[#0d1520] border border-[#ff4060]/20 rounded-xl p-4">
          <div className="font-mono text-xs text-gray-400">Rejetées</div>
          <div className="font-mono text-2xl font-bold text-[#ff4060]">{rejected}</div>
        </div>
      </div>

      {certs.length === 0 ? (
        <div className="text-center py-12 font-mono text-sm text-gray-500">Aucune certification</div>
      ) : (
        <>
          {/* Mobile: card layout */}
          <div className="flex flex-col gap-3 lg:hidden">
            {certs.map((c) => (
              <div
                key={c.id}
                className="bg-[#0d1520] border border-[#0084ff]/20 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-sm text-white truncate">{c.name}</div>
                    <div className="font-mono text-xs text-gray-400 truncate">
                      {c.candidate.firstName} {c.candidate.lastName}
                    </div>
                  </div>
                  <span
                    className={`shrink-0 font-mono text-[10px] px-2 py-0.5 rounded-full border ${statusColor[c.status] ?? "border-gray-500 text-gray-500"}`}
                  >
                    {c.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="font-mono text-gray-500">
                    {new Date(c.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                  <span className="font-mono text-gray-500">{c.issuer}</span>
                  <span className="font-mono text-gray-500">
                    Score: {c.candidate.cyberScore ?? "—"}
                  </span>
                  <span className="font-mono text-gray-500">
                    Confiance: {c.aiConfidence != null ? `${Math.round(c.aiConfidence * 100)}%` : "—"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table layout */}
          <div className="hidden lg:block bg-[#0d1520] border border-[#0084ff]/20 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#0084ff]/10">
                    <th className="font-mono text-xs text-gray-400 text-left p-3">Date</th>
                    <th className="font-mono text-xs text-gray-400 text-left p-3">Candidat</th>
                    <th className="font-mono text-xs text-gray-400 text-left p-3">Certification</th>
                    <th className="font-mono text-xs text-gray-400 text-left p-3">Organisme</th>
                    <th className="font-mono text-xs text-gray-400 text-left p-3">Score</th>
                    <th className="font-mono text-xs text-gray-400 text-left p-3">Statut</th>
                    <th className="font-mono text-xs text-gray-400 text-left p-3">Confiance IA</th>
                  </tr>
                </thead>
                <tbody>
                  {certs.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-[#0084ff]/5 hover:bg-[#111d2e] transition"
                    >
                      <td className="p-3 font-mono text-xs text-gray-500">
                        {new Date(c.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="p-3 font-mono text-sm text-white">
                        {c.candidate.firstName} {c.candidate.lastName}
                      </td>
                      <td className="p-3 font-mono text-sm text-white">{c.name}</td>
                      <td className="p-3 font-mono text-xs text-gray-400">{c.issuer}</td>
                      <td className="p-3 font-mono text-sm text-white">{c.candidate.cyberScore}</td>
                      <td className="p-3">
                        <span
                          className={`font-mono text-xs px-2 py-0.5 rounded-full border ${statusColor[c.status] ?? "border-gray-500 text-gray-500"}`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-xs text-gray-400">
                        {c.aiConfidence != null ? `${Math.round(c.aiConfidence * 100)}%` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
