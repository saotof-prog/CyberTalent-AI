import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminJobActions from "./job-actions";

export default async function AdminJobsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      company: { select: { name: true } },
      recruiter: { select: { firstName: true, lastName: true } },
      _count: { select: { applications: true } },
    },
  });

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-bold text-white mb-1">
          💼 Gestion des <span className="text-[#0084ff]">Offres</span>
        </h1>
        <p className="font-mono text-xs text-gray-400">{jobs.length} offre(s)</p>
      </div>

      <div className="flex flex-col gap-3">
        {jobs.map((j) => (
          <div key={j.id} className="bg-[#0d1520] border border-[#0084ff]/20 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-mono text-base font-bold text-white">{j.title}</h3>
                <p className="font-mono text-xs text-gray-400">
                  {j.company?.name ?? "—"} · {j.recruiter.firstName} {j.recruiter.lastName}
                </p>
              </div>
              <AdminJobActions jobId={j.id} isActive={j.isActive} />
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="font-mono text-gray-500">📍 {j.location ?? "—"}</span>
              <span className={`font-mono px-2 py-0.5 rounded border ${
                j.type === "FULL_TIME" ? "text-[#00c896] border-[#00c896]" :
                j.type === "CONTRACT" ? "text-yellow-400 border-yellow-400" :
                j.type === "FREELANCE" ? "text-purple-400 border-purple-400" :
                "text-gray-400 border-gray-400"
              }`}>{j.type}</span>
              <span className="font-mono text-gray-500">📩 {j._count.applications} candidature(s)</span>
              <span className={`font-mono text-xs ${j.isActive ? "text-[#00c896]" : "text-[#ff4060]"}`}>
                {j.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        ))}
        {jobs.length === 0 && (
          <div className="text-center py-12 font-mono text-sm text-gray-500">
            Aucune offre
          </div>
        )}
      </div>
    </div>
  );
}
