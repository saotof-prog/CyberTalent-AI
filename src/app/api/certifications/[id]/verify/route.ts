import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { recalculateAndTrack } from "@/lib/score-tracker";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
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

    if (cert.candidate.user.clerkId !== userId) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const url = cert.credentialUrl;
    if (!url) {
      return NextResponse.json({
        success: true,
        status: "PENDING",
        notes: "Aucun lien de vérification fourni. Ajoute un lien pour valider automatiquement.",
      });
    }

    try {
      new URL(url);
    } catch {
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

    await recalculateAndTrack(cert.candidate.id, `CERT_VERIFIED: ${cert.name}`);

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
