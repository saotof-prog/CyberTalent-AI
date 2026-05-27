import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";

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

    await prisma.certification.update({
      where: { id },
      data: { status: "VERIFYING" },
    });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Tu es un expert en certification cybersécurité. Vérifie l'authenticité de cette certification.

Nom: ${cert.name}
Nom complet: ${cert.fullName ?? "Non spécifié"}
Organisme: ${cert.issuer}
ID: ${cert.credentialId ?? "Non spécifié"}
Lien: ${cert.credentialUrl ?? "Non spécifié"}
Date d'obtention: ${cert.issuedAt.toISOString().split("T")[0]}
Expire le: ${cert.expiresAt ? cert.expiresAt.toISOString().split("T")[0] : "N/A"}

Réponds UNIQUEMENT en JSON valide sans markdown ni backticks:
{
  "isValid": true/false,
  "confidence": 0.0-1.0,
  "notes": "explication concise",
  "suggestedScoreImpact": 0-20
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const clean = text.replace(/```json|```/g, "").trim();
    const ai = JSON.parse(clean);

    const newStatus = ai.isValid ? "VERIFIED" : "REJECTED";

    await prisma.certification.update({
      where: { id },
      data: {
        status: newStatus,
        aiVerifiedAt: new Date(),
        aiConfidence: ai.confidence,
        aiNotes: ai.notes,
        scoreImpact: ai.suggestedScoreImpact,
      },
    });

    if (newStatus === "VERIFIED") {
      const profile = cert.candidate;
      const allCerts = await prisma.certification.findMany({
        where: { candidateId: profile.id },
      });
      const allLabs = await prisma.labCompletion.findMany({
        where: { candidateId: profile.id },
      });
      const allSkills = await prisma.candidateSkill.findMany({
        where: { candidateId: profile.id },
      });

      const { calculateCyberScore } = await import("@/lib/score");
      const newScore = calculateCyberScore({
        certifications: allCerts as any,
        labs: allLabs as any,
        skills: allSkills as any,
        githubUsername: profile.githubUsername,
        githubStats: profile.githubStats,
      });

      await prisma.candidateProfile.update({
        where: { id: profile.id },
        data: { cyberScore: newScore, scoreUpdatedAt: new Date() },
      });
    }

    return NextResponse.json({
      success: true,
      status: newStatus,
      confidence: ai.confidence,
      notes: ai.notes,
    });
  } catch (error) {
    console.error("CERT VERIFY ERROR:", error);
    return NextResponse.json({ error: "Erreur vérification" }, { status: 500 });
  }
}
