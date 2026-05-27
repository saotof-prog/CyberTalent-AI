import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { calculateCyberScore, analyzeProfileWithAI } from "@/lib/score";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        candidateProfile: {
          include: {
            certifications: true,
            labs: true,
            skills: true,
          },
        },
      },
    });

    if (!user?.candidateProfile) {
      return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });
    }

    const profile = user.candidateProfile;

    // 1. Calcul du score
    const newScore = calculateCyberScore({
      certifications: profile.certifications,
      labs: profile.labs,
      skills: profile.skills,
      githubUsername: profile.githubUsername,
      githubStats: profile.githubStats,
    });

    // 2. Analyse IA avec Gemini
    const aiAnalysis = await analyzeProfileWithAI({
      firstName: profile.firstName,
      lastName: profile.lastName,
      headline: profile.headline,
      bio: profile.bio,
      githubUsername: profile.githubUsername,
      certifications: profile.certifications,
      labs: profile.labs,
      skills: profile.skills,
    });

    const oldScore = profile.cyberScore;

    // 3. Sauvegarder en base
    await prisma.candidateProfile.update({
      where: { id: profile.id },
      data: {
        cyberScore: newScore,
        aiSummary: aiAnalysis.summary,
        aiFlags: [
          ...(aiAnalysis.fakeSkillsDetected ? ["FAKE_SKILLS_DETECTED"] : []),
          ...(aiAnalysis.strengths ?? []).map((s: string) => `STRENGTH:${s}`),
          ...(aiAnalysis.improvements ?? []).map((i: string) => `IMPROVE:${i}`),
          ...(aiAnalysis.interviewQuestions ?? []).map((q: string) => `QUESTION:${q}`),
        ],
        scoreUpdatedAt: new Date(),
      },
    });

    // 4. Historique
    await prisma.scoreHistory.create({
      data: {
        candidateId: profile.id,
        scoreBefore: oldScore,
        scoreAfter: newScore,
        delta: newScore - oldScore,
        reason: "AI_RECALCULATION",
        breakdown: {
          certifications: Math.min(profile.certifications.filter(c => c.status === "VERIFIED").length * 10, 40),
          labs: Math.min(profile.labs.length * 3, 25),
          skills: Math.min(profile.skills.length * 2, 15),
          github: profile.githubUsername ? 5 : 0,
        },
      },
    });

    return NextResponse.json({
      success: true,
      score: newScore,
      summary: aiAnalysis.summary,
      strengths: aiAnalysis.strengths,
      improvements: aiAnalysis.improvements,
      interviewQuestions: aiAnalysis.interviewQuestions,
    });

  } catch (error) {
    console.error("ERREUR SCORING:", error);
    return NextResponse.json({ error: "Erreur scoring" }, { status: 500 });
  }
}