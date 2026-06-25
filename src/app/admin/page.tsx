import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [
    totalUsers,
    totalCandidates,
    totalRecruiters,
    totalCompanies,
    totalJobs,
    totalApplications,
    totalCerts,
    totalLabs,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "CANDIDATE" } }),
    prisma.user.count({ where: { role: "RECRUITER" } }),
    prisma.company.count(),
    prisma.job.count(),
    prisma.application.count(),
    prisma.certification.count(),
    prisma.labCompletion.count(),
  ]);

  const avgScore = await prisma.candidateProfile.aggregate({ _avg: { cyberScore: true } });
  const pendingCerts = await prisma.certification.count({ where: { status: "PENDING" } });

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { candidateProfile: { select: { cyberScore: true } } },
  });

  const stats = [
    { label: "Utilisateurs", value: totalUsers, color: "text-[#0084ff]" },
    { label: "Candidats", value: totalCandidates, color: "text-[#00FF41]" },
    { label: "Recruteurs", value: totalRecruiters, color: "text-[#FF3333]" },
    { label: "Entreprises", value: totalCompanies, color: "text-purple-400" },
    { label: "Offres", value: totalJobs, color: "text-yellow-400" },
    { label: "Candidatures", value: totalApplications, color: "text-pink-400" },
    { label: "Certifications", value: totalCerts, color: "text-orange-400" },
    { label: "Labs complétés", value: totalLabs, color: "text-cyan-400" },
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-bold text-white mb-1">
          🛡️ Panneau d&apos;<span className="text-[#0084ff]">Administration</span>
        </h1>
        <p className="font-mono text-xs text-gray-400">
          Gérez l&apos;ensemble de la plateforme CyberTalent AI
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#0d1520] border border-[#0084ff]/20 rounded-xl p-4">
            <div className="font-mono text-xs text-gray-400 mb-1">{s.label}</div>
            <div className={`font-mono text-3xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-[#0d1520] border border-[#0084ff]/20 rounded-xl p-4">
          <div className="font-mono text-xs text-gray-400 mb-1">Score moyen</div>
          <div className="font-mono text-3xl font-bold text-[#0084ff]">
            {Math.round(avgScore._avg.cyberScore ?? 0)}
          </div>
        </div>
        <div className="bg-[#0d1520] border border-[#0084ff]/20 rounded-xl p-4">
          <div className="font-mono text-xs text-gray-400 mb-1">Certifications en attente</div>
          <div
            className={`font-mono text-3xl font-bold ${pendingCerts > 0 ? "text-[#ffaa00]" : "text-[#00FF41]"}`}
          >
            {pendingCerts}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Link
          href="/admin/users"
          className="bg-[#0d1520] border border-[#0084ff]/20 rounded-xl p-4 hover:border-[#0084ff] transition text-center"
        >
          <div className="font-mono text-2xl mb-1">👥</div>
          <div className="font-mono text-xs text-gray-400">Gérer les utilisateurs</div>
        </Link>
        <Link
          href="/admin/companies"
          className="bg-[#0d1520] border border-[#0084ff]/20 rounded-xl p-4 hover:border-[#0084ff] transition text-center"
        >
          <div className="font-mono text-2xl mb-1">🏢</div>
          <div className="font-mono text-xs text-gray-400">Gérer les entreprises</div>
        </Link>
        <Link
          href="/admin/jobs"
          className="bg-[#0d1520] border border-[#0084ff]/20 rounded-xl p-4 hover:border-[#0084ff] transition text-center"
        >
          <div className="font-mono text-2xl mb-1">💼</div>
          <div className="font-mono text-xs text-gray-400">Gérer les offres</div>
        </Link>
        <Link
          href="/admin/certifications"
          className="bg-[#0d1520] border border-[#0084ff]/20 rounded-xl p-4 hover:border-[#0084ff] transition text-center"
        >
          <div className="font-mono text-2xl mb-1">🏆</div>
          <div className="font-mono text-xs text-gray-400">Gérer les certifications</div>
        </Link>
        <Link
          href="/admin/labs"
          className="bg-[#0d1520] border border-[#0084ff]/20 rounded-xl p-4 hover:border-[#0084ff] transition text-center"
        >
          <div className="font-mono text-2xl mb-1">🧪</div>
          <div className="font-mono text-xs text-gray-400">Gérer les labs</div>
        </Link>
      </div>

      {/* Recent users */}
      <div className="bg-[#0d1520] border border-[#0084ff]/20 rounded-xl p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 bg-[#0084ff] rounded" />
          <span className="font-mono text-sm text-[#0084ff]">DERNIERS INSCRITS</span>
        </div>
        <div className="flex flex-col gap-2">
          {recentUsers.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between py-2 border-b border-[#0084ff]/5 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="font-mono text-xs text-gray-400">
                  {new Date(u.createdAt).toLocaleDateString("fr-FR")}
                </div>
                <div className="font-mono text-sm text-white">{u.email}</div>
                <span
                  className={`font-mono text-[10px] px-2 py-0.5 rounded-full border ${
                    u.role === "CANDIDATE"
                      ? "border-[#00FF41] text-[#00FF41]"
                      : u.role === "RECRUITER"
                        ? "border-[#FF3333] text-[#FF3333]"
                        : "border-[#0084ff] text-[#0084ff]"
                  }`}
                >
                  {u.role}
                </span>
              </div>
              <div className="font-mono text-xs text-gray-500">
                {u.candidateProfile?.cyberScore != null &&
                  `Score: ${u.candidateProfile.cyberScore}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
