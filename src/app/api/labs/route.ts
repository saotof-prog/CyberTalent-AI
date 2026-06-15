import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recalculateAndTrack } from "@/lib/score-tracker";

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

    // Créer le lab
    const lab = await prisma.labCompletion.create({
      data: {
        candidateId: user.candidateProfile.id,
        platform: body.platform,
        labName: body.labName,
        difficulty: body.difficulty,
        category: body.category ?? null,
        completedAt: new Date(body.completedAt),
        proofUrl: body.proofUrl ?? null,
        isVerified: false,
        scoreImpact: 0,
      },
    });

    const newScore = await recalculateAndTrack(
      user.candidateProfile.id,
      `LAB_ADDED: ${lab.labName}`,
      user.candidateProfile.cyberScore
    );

    return NextResponse.json({ success: true, lab, newScore });
  } catch (error) {
    console.error("ERREUR LAB:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
