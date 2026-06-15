import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const recruiter = await prisma.recruiterProfile.findFirst({
    where: { user: { clerkId: userId } },
  });
  if (!recruiter) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    jobs,
    activeJobs,
    applications,
    applicationsLast30d,
    savedCount,
    recentSearches,
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
    pending: applications.filter((a) => a.status === "PENDING").length,
    viewed: applications.filter((a) => a.status === "VIEWED").length,
    shortlisted: applications.filter((a) => a.status === "SHORTLISTED").length,
    interview: applications.filter((a) => a.status === "INTERVIEW").length,
    offer: applications.filter((a) => a.status === "OFFER").length,
    rejected: applications.filter((a) => a.status === "REJECTED").length,
  };

  const appsByDay: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    appsByDay[key] = 0;
  }
  applications.forEach((a) => {
    const key = a.appliedAt.toISOString().slice(0, 10);
    if (appsByDay[key] !== undefined) appsByDay[key]++;
  });

  return NextResponse.json({
    jobs: { total: jobs, active: activeJobs },
    applications: {
      total: applications.length,
      last30d: applicationsLast30d,
      funnel: appFunnel,
      byDay: Object.entries(appsByDay)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({ date, count })),
    },
    savedCandidates: savedCount,
    searchesPerformed: recentSearches,
    candidatePool: {
      averageScore: Math.round(candidateStats._avg.cyberScore ?? 0),
      total: candidateStats._count,
    },
    topSkills: topSkillNames.map((s, i) => ({
      name: s.name,
      count: topSkills[i]._count,
    })),
    recentApplications: applications.slice(0, 5).map((a) => ({
      id: a.id,
      jobTitle: a.job.title,
      status: a.status,
      appliedAt: a.appliedAt,
    })),
  });
}
