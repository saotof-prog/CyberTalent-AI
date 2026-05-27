import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import JobActions from "./job-actions";

const prisma = new PrismaClient();

export default async function RecruiterJobsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const recruiter = await prisma.recruiterProfile.findFirst({
    where: { user: { clerkId: userId } },
  });
  if (!recruiter) redirect("/recruiter/dashboard");

  const jobs = await prisma.job.findMany({
    where: { recruiterId: recruiter.id },
    include: {
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const activeCount = jobs.filter((j) => j.isActive).length;

  return (
    <div className="min-h-screen bg-[#080c14] text-white">
      <div className="p-6 max-w-4xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#0d1520] border border-[#ff4060]/20 rounded-xl p-4">
            <div className="font-mono text-xs text-gray-400 mb-1">TOTAL OFFRES</div>
            <div className="font-mono text-3xl font-bold text-white">{jobs.length}</div>
          </div>
          <div className="bg-[#0d1520] border border-[#ff4060]/20 rounded-xl p-4">
            <div className="font-mono text-xs text-gray-400 mb-1">ACTIVES</div>
            <div className="font-mono text-3xl font-bold text-[#00c896]">{activeCount}</div>
          </div>
          <div className="bg-[#0d1520] border border-[#ff4060]/20 rounded-xl p-4">
            <div className="font-mono text-xs text-gray-400 mb-1">CANDIDATURES</div>
            <div className="font-mono text-3xl font-bold text-[#ff4060]">
              {jobs.reduce((acc, j) => acc + j._count.applications, 0)}
            </div>
          </div>
        </div>

        {/* Liste */}
        {jobs.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-mono text-gray-500 text-sm mb-4">
              Aucune offre publiée pour linstant.
            </p>
            <Link
              href="/recruiter/jobs/create"
              className="font-mono text-xs px-6 py-3 bg-[#ff4060] hover:bg-[#ff4060]/80 text-white rounded-lg transition"
            >
              🚀 Publier ma première offre
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-[#0d1520] border border-[#ff4060]/20 rounded-xl p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Titre + badges */}
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-mono text-base font-bold text-white">
                        {job.title}
                      </h3>
                      {job.isUrgent && (
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#ff4060]/10 border border-[#ff4060]/30 text-[#ff4060]">
                          URGENT
                        </span>
                      )}
                      <span
                        className={
                          "font-mono text-[10px] px-2 py-0.5 rounded border " +
                          (job.isActive
                            ? "bg-[#00c896]/10 border-[#00c896]/30 text-[#00c896]"
                            : "bg-gray-800 border-gray-700 text-gray-500")
                        }
                      >
                        {job.isActive ? "● ACTIVE" : "○ INACTIVE"}
                      </span>
                    </div>

                    {/* Infos */}
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <span className="font-mono text-xs text-gray-400">
                        {job.mode} · {job.type}
                      </span>
                      {job.country && (
                        <span className="font-mono text-xs text-gray-500">
                          📍 {job.location ? job.location + ", " : ""}{job.country}
                        </span>
                      )}
                      {job.salaryMin && (
                        <span className="font-mono text-xs text-[#00c896]">
                          ${job.salaryMin.toLocaleString()} — ${job.salaryMax?.toLocaleString() ?? "?"}/mois
                        </span>
                      )}
                      {job.minScore && (
                        <span className="font-mono text-xs text-gray-500">
                          Score min: {job.minScore}
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    {job.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {job.tags.slice(0, 5).map((tag) => (
                          <span
                            key={tag}
                            className="font-mono text-[10px] px-2 py-0.5 rounded-full border border-gray-700 text-gray-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Candidatures + date */}
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/recruiter/jobs/${job.id}/applications`}
                        className="font-mono text-xs text-[#ff4060] hover:underline"
                      >
                        👥 {job._count.applications} candidature
                        {job._count.applications > 1 ? "s" : ""}
                      </Link>
                      <span className="font-mono text-xs text-gray-600">
                        Publiée le{" "}
                        {new Date(job.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <JobActions jobId={job.id} isActive={job.isActive} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}