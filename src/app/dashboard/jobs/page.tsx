import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function JobsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const jobs = await prisma.job.findMany({
    where: { isActive: true },
    include: { company: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-bold text-white mb-1">
          Offres <span className="text-[#0084ff]">disponibles</span> 💼
        </h1>
        <p className="font-mono text-xs text-gray-400">{jobs.length} offre(s) active(s)</p>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-16 bg-[#0d1520] border border-[#0084ff]/20 rounded-xl">
          <div className="text-4xl mb-4">💼</div>
          <p className="font-mono text-sm text-gray-500">Aucune offre disponible pour linstant.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {jobs.map((job) => (
            <div key={job.id} className="bg-[#0d1520] border border-[#0084ff]/20 rounded-xl p-5 hover:border-[#0084ff] transition">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-mono text-base font-bold text-white">{job.title}</h3>
                    {job.isUrgent && (
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#ff4060]/10 border border-[#ff4060]/30 text-[#ff4060]">
                        URGENT
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <span className="font-mono text-xs text-gray-400">{job.mode} · {job.type}</span>
                    {job.country && <span className="font-mono text-xs text-gray-500">📍 {job.location ? job.location + ", " : ""}{job.country}</span>}
                    {job.salaryMin && (
                      <span className="font-mono text-xs text-[#00c896]">
                        ${job.salaryMin.toLocaleString()} — ${job.salaryMax?.toLocaleString() ?? "?"}/mois
                      </span>
                    )}
                    {job.minScore && (
                      <span className="font-mono text-xs text-gray-500">Score min: {job.minScore}</span>
                    )}
                  </div>
                  {job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {job.tags.slice(0, 5).map((tag) => (
                        <span key={tag} className="font-mono text-xs px-2 py-0.5 rounded-full border border-gray-700 text-gray-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button className="font-mono text-xs px-4 py-2 bg-[#0084ff] text-white rounded-lg hover:bg-[#0094ff] transition flex-shrink-0">
                  Postuler →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}