import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { verifyCertificationWithAI } from "@/lib/certificate-validation/ai-verifier";
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

    const aiResult = await verifyCertificationWithAI(cert.name, cert.issuer, url);
    const newStatus = aiResult.status;

    await prisma.certification.update({
      where: { id },
      data: {
        status: newStatus,
        aiVerifiedAt: new Date(),
        aiConfidence: aiResult.confidence,
        aiNotes: aiResult.notes,
        scoreImpact: newStatus === "VERIFIED" ? 10 : 0,
      },
    });

    if (newStatus === "VERIFIED") {
      await recalculateAndTrack(cert.candidate.id, `CERT_VERIFIED: ${cert.name}`);
    }

    return NextResponse.json({
      success: true,
      status: newStatus,
      confidence: aiResult.confidence,
      notes: aiResult.notes,
    });
  } catch (error) {
    console.error("CERT VERIFY ERROR:", error);
    return NextResponse.json({ error: "Erreur vérification" }, { status: 500 });
  }
}
