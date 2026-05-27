import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { computeMatchScore } from "@/lib/matching";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const candidate = await prisma.candidateProfile.findFirst({
    where: { user: { clerkId: userId } },
    include: { skills: { include: { skill: true } } },
  });
  if (!candidate) return NextResponse.json([]);

  const jobs = await prisma.job.findMany({
    where: { isActive: true },
    include: { requiredSkills: { include: { skill: true } } },
    take: 50,
  });

  const ranked = jobs
    .map((job) => ({
      ...job,
      matchScore: computeMatchScore(candidate, job),
    }))
    .filter((j) => j.matchScore >= 20)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 10);

  return NextResponse.json(ranked);
}