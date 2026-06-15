import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { calculateCyberScore } from "@/lib/score";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { candidateProfile: { select: { id: true } } },
    });

    if (!user?.candidateProfile) {
      return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });
    }

    const profileId = user.candidateProfile.id;

    const cert = await prisma.certification.findUnique({
      where: { id },
    });

    if (!cert) {
      return NextResponse.json({ error: "Certification introuvable" }, { status: 404 });
    }

    if (cert.candidateId !== profileId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    await prisma.certification.delete({ where: { id } });

    const [certs, labs, skills, candidate] = await Promise.all([
      prisma.certification.findMany({ where: { candidateId: profileId } }),
      prisma.labCompletion.findMany({ where: { candidateId: profileId } }),
      prisma.candidateSkill.findMany({ where: { candidateId: profileId } }),
      prisma.candidateProfile.findUnique({ where: { id: profileId } }),
    ]);

    if (candidate) {
      const newScore = calculateCyberScore({
        certifications: certs,
        labs,
        skills,
        githubUsername: candidate.githubUsername,
        githubStats: candidate.githubStats,
      });

      await prisma.candidateProfile.update({
        where: { id: profileId },
        data: { cyberScore: newScore, scoreUpdatedAt: new Date() },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ERREUR DELETE CERT:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
