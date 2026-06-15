import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AnalyticsDashboard from "./analytics-client";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });
  if (dbUser?.role === "CANDIDATE") redirect("/dashboard");

  const recruiter = await prisma.recruiterProfile.findFirst({
    where: { user: { clerkId: userId } },
  });
  if (!recruiter) redirect("/recruiter/dashboard");

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalJobs,
    activeJobs,
    allApplications,
    appsLast30d,
    savedCount,
    searchCount,
    candidateStats,
    topSkills,
  ] = await Promise.all([
    prisma.job.count({ where: { recruiterId: recruiter.id } }),
    prisma.job.count({ where: { recruiterId: recruiter.id, isActive: true } }),
    prisma.application.findMany({
      where: { job: { recruiterId: recruiter.id } },
      include: { job: { select: { title: true } } },
      orderBy: { appliedAt: "desc" },
    }),
    prisma.application.count({
      where: {
        job: { recruiterId: recruiter.id },
        appliedAt: { gte: thirtyDaysAgo },
      },
    }),
    prisma.savedCandidate.count({ where: { recruiterId: recruiter.id } }),
    prisma.recruiterSearch.count({ where: { recruiterId: recruiter.id } }),
    prisma.candidateProfile.aggregate({
      _avg: { cyberScore: true },
      _count: true,
    }),
    prisma.candidateSkill.groupBy({
      by: ["skillId"],
      _count: true,
      orderBy: { _count: { skillId: "desc" } },
      take: 10,
    }),
  ]);

  const topSkillNames = topSkills.length > 0
    ? await prisma.skill.findMany({
        where: { id: { in: topSkills.map((s) => s.skillId) } },
        select: { name: true },
      })
    : [];

  const appFunnel = {
    pending: allApplications.filter((a) => a.status === "PENDING").length,
    viewed: allApplications.filter((a) => a.status === "VIEWED").length,
    shortlisted: allApplications.filter((a) => a.status === "SHORTLISTED").length,
    interview: allApplications.filter((a) => a.status === "INTERVIEW").length,
    offer: allApplications.filter((a) => a.status === "OFFER").length,
    rejected: allApplications.filter((a) => a.status === "REJECTED").length,
  };

  const appsByDay: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    appsByDay[d.toISOString().slice(0, 10)] = 0;
  }
  allApplications.forEach((a) => {
    const key = a.appliedAt.toISOString().slice(0, 10);
    if (appsByDay[key] !== undefined) appsByDay[key]++;
  });

  const data = {
    jobs: { total: totalJobs, active: activeJobs },
    applications: {
      total: allApplications.length,
      last30d: appsLast30d,
      funnel: appFunnel,
      byDay: Object.entries(appsByDay)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({ date, count })),
    },
    savedCandidates: savedCount,
    searchesPerformed: searchCount,
    candidatePool: {
      averageScore: Math.round(candidateStats._avg.cyberScore ?? 0),
      total: candidateStats._count,
    },
    topSkills: topSkillNames.map((s, i) => ({
      name: s.name,
      count: topSkills[i]._count,
    })),
    recentApplications: allApplications.slice(0, 5).map((a) => ({
      id: a.id,
      jobTitle: a.job.title,
      status: a.status,
      appliedAt: a.appliedAt.toISOString(),
    })),
  };

  return <AnalyticsDashboard data={data} />;
}
