import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { calculateCyberScore } from "@/lib/score";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        candidateProfile: {
          include: { certifications: true, labs: true, skills: true },
        },
      },
    });

    if (!user?.candidateProfile) {
      return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });
    }

    // Créer la certification
    const cert = await prisma.certification.create({
      data: {
        candidateId: user.candidateProfile.id,
        name: body.name,
        fullName: body.fullName ?? "",
        issuer: body.issuer,
        issuedAt: new Date(body.issuedAt),
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        hasExpiry: !!body.expiresAt,
        credentialUrl: body.credentialUrl ?? null,
        fileUrl: body.fileUrl ?? null,
        status: "PENDING",
      },
    });

    // Recalculer le score
    const allCerts = [...user.candidateProfile.certifications, cert];
    const newScore = calculateCyberScore({
      certifications: allCerts,
      labs: user.candidateProfile.labs,
      skills: user.candidateProfile.skills,
      githubUsername: user.candidateProfile.githubUsername,
      githubStats: user.candidateProfile.githubStats,
    });

    await prisma.candidateProfile.update({
      where: { id: user.candidateProfile.id },
      data: { cyberScore: newScore, scoreUpdatedAt: new Date() },
    });

    return NextResponse.json({ success: true, cert, newScore });
  } catch (error) {
    console.error("ERREUR CERT:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        candidateProfile: {
          include: { certifications: true },
        },
      },
    });

    return NextResponse.json(user?.candidateProfile?.certifications ?? []);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}