import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { calculateCyberScore } from "@/lib/score";

const prisma = new PrismaClient();

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const candidates = await prisma.candidateProfile.findMany({
    include: {
      certifications: true,
      labs: true,
      skills: true,
    },
  });

  const updates = candidates.map((candidate) => {
    const newScore = calculateCyberScore({
      certifications: candidate.certifications,
      labs: candidate.labs,
      skills: candidate.skills,
      githubUsername: candidate.githubUsername,
      githubStats: candidate.githubStats,
    });

    return prisma.candidateProfile.update({
      where: { id: candidate.id },
      data: {
        cyberScore: newScore,
        scoreUpdatedAt: new Date(),
      },
    });
  });

  await Promise.all(updates);

  return NextResponse.json({ updated: candidates.length });
}