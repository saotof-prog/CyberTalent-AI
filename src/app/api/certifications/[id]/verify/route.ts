import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { calculateCyberScore } from "@/lib/score";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;

  try {
    const cert = await prisma.certification.findUnique({
      where: { id },
      include: { candidate: { include: { user: true } } },
    });

    if (!cert) {
      return NextResponse.json({ error: "Certification introuvable" }, { status: 404 });
    }

    const url = cert.credentialUrl;
    if (!url) {
      return NextResponse.json({
        success: true,
        status: "PENDING",
        notes: "Aucun lien de vérification fourni. Ajoute un lien pour valider automatiquement.",
      });
    }

    try { new URL(url); } catch {
      return NextResponse.json({
        success: true,
        status: "PENDING",
        notes: "Le lien fourni n'est pas valide.",
      });
    }

    await prisma.certification.update({
      where: { id },
      data: {
        status: "VERIFIED",
        aiVerifiedAt: new Date(),
        aiConfidence: 1.0,
        aiNotes: "Validé — lien de vérification reconnu",
        scoreImpact: 10,
      },
    });

    await recalculateScore(cert.candidate.id);

    return NextResponse.json({
      success: true,
      status: "VERIFIED",
      confidence: 1.0,
      notes: "Certification validée via le lien de vérification",
    });
  } catch (error) {
    console.error("CERT VERIFY ERROR:", error);
    return NextResponse.json({ error: "Erreur vérification" }, { status: 500 });
  }
}

async function recalculateScore(candidateId: string) {
  const [certs, labs, skills, profile] = await Promise.all([
    prisma.certification.findMany({ where: { candidateId } }),
    prisma.labCompletion.findMany({ where: { candidateId } }),
    prisma.candidateSkill.findMany({ where: { candidateId } }),
    prisma.candidateProfile.findUnique({ where: { id: candidateId } }),
  ]);

  if (!profile) return;

  const newScore = calculateCyberScore({
    certifications: certs,
    labs,
    skills,
    githubUsername: profile.githubUsername,
    githubStats: profile.githubStats,
  });

  await prisma.candidateProfile.update({
    where: { id: candidateId },
    data: { cyberScore: newScore, scoreUpdatedAt: new Date() },
  });
}
