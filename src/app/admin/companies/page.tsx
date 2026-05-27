import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminCompanyActions from "./company-actions";

export default async function AdminCompaniesPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const companies = await prisma.company.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      recruiters: { include: { user: { select: { email: true } } } },
      _count: { select: { jobs: true } },
    },
  });

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-bold text-white mb-1">
          🏢 Gestion des <span className="text-[#0084ff]">Entreprises</span>
        </h1>
        <p className="font-mono text-xs text-gray-400">{companies.length} entreprise(s)</p>
      </div>

      <div className="flex flex-col gap-3">
        {companies.map((c) => (
          <div key={c.id} className="bg-[#0d1520] border border-[#0084ff]/20 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-mono text-base font-bold text-white">{c.name}</h3>
                <p className="font-mono text-xs text-gray-400">{c.industry ?? "—"} · {c.size ?? "—"}</p>
              </div>
              <AdminCompanyActions companyId={c.id} isVerified={c.isVerified} />
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="font-mono text-gray-500">Offres: {c._count.jobs}</span>
              <span className="font-mono text-gray-500">
                Recruteurs: {c.recruiters.length}
                {c.recruiters[0] && ` (${c.recruiters[0].user.email})`}
              </span>
              {c.website && (
                <a href={c.website} target="_blank" className="font-mono text-[#0084ff] hover:underline">
                  Site web →
                </a>
              )}
            </div>
          </div>
        ))}
        {companies.length === 0 && (
          <div className="text-center py-12 font-mono text-sm text-gray-500">
            Aucune entreprise
          </div>
        )}
      </div>
    </div>
  );
}
