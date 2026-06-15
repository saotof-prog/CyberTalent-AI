import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ApplicationStatusSelect from "@/components/ApplicationStatusSelect";

export default async function JobApplicationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      company: true,
      applications: {
        include: {
          candidate: {
            include: {
              certifications: { where: { status: "VERIFIED" } },
              labs: true,
              skills: { include: { skill: true } },
            },
          },
        },
        orderBy: { appliedAt: "desc" },
      },
    },
  });

  if (!job) redirect("/recruiter/jobs");

  return (
    <div className="min-h-screen bg-[#080c14] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/recruiter/jobs"
            className="font-mono text-xs text-[#ff4060] hover:underline mb-4 inline-block"
          >
            ← Retour aux offres
          </Link>
          <h1 className="font-mono text-2xl font-bold text-white mb-1">
            Candidatures — <span className="text-[#ff4060]">{job.title}</span>
          </h1>
          <p className="font-mono text-xs text-gray-400">
            {job.applications.length} candidature{job.applications.length > 1 ? "s" : ""}
            {job.company && ` · ${job.company.name}`}
          </p>
        </div>

        {job.applications.length === 0 ? (
          <div className="text-center py-16 bg-[#0d1520] border border-[#ff4060]/20 rounded-xl">
            <p className="font-mono text-sm text-gray-500">Aucune candidature pour cette offre.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {job.applications.map((app) => {
              const c = app.candidate;
              return (
                <Link
                  key={app.id}
                  href={`/recruiter/candidate/${c.id}`}
                  className="bg-[#0d1520] border border-[#ff4060]/20 rounded-xl p-5 hover:border-[#ff4060] transition block"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center w-16 h-16 bg-[#111d2e] border border-[#ff4060]/30 rounded-lg shrink-0">
                      <div className="font-mono text-xl font-bold text-[#ff4060]">
                        {c.cyberScore}
                      </div>
                      <div className="font-mono text-[10px] text-gray-500">score</div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-mono text-base font-bold text-white">
                          {c.firstName} {c.lastName}
                        </h3>
                        {c.isAvailable && (
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#00c896]/10 border border-[#00c896]/30 text-[#00c896]">
                            Disponible
                          </span>
                        )}
                      </div>
                      {c.headline && (
                        <p className="font-mono text-xs text-gray-400 mb-2">{c.headline}</p>
                      )}
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono text-xs text-gray-500">
                          📜 {c.certifications.length} certs
                        </span>
                        <span className="font-mono text-xs text-gray-500">
                          🧪 {c.labs.length} labs
                        </span>
                        <span className="font-mono text-xs text-gray-500">
                          ⚡ {c.skills.length} skills
                        </span>
                        <ApplicationStatusSelect
                          applicationId={app.id}
                          initialStatus={app.status}
                        />
                        <span className="font-mono text-xs text-gray-600">
                          {new Date(app.appliedAt).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
