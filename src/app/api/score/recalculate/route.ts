import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { rejectIfBanned } from "@/lib/auth-utils";
import { calculateCyberScore, analyzeProfileWithAI } from "@/lib/score";
import { handleApiError, unauthorized, notFound, success } from "@/lib/api-error";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return unauthorized();
  const bannedResp = await rejectIfBanned(userId);
  if (bannedResp) return bannedResp;

  const rl = checkRateLimit(rateLimitKey(req, `:score:${userId}`), 5);
  if (!rl.allowed) {
    return Response.json({ error: "Trop de requêtes, réessaye dans une minute" }, { status: 429 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        candidateProfile: {
          include: {
            certifications: true,
            labs: true,
            skills: { include: { skill: true } },
          },
        },
      },
    });

    if (!user?.candidateProfile) return notFound("Profil introuvable");

    const profile = user.candidateProfile;

    const newScore = calculateCyberScore({
      certifications: profile.certifications,
      labs: profile.labs,
      skills: profile.skills,
      githubUsername: profile.githubUsername,
      githubStats: profile.githubStats,
    });

    const skillsWithName = profile.skills.map((s) => ({
      level: s.level,
      name: (s as { skill?: { name: string } }).skill?.name ?? "",
    }));

    const aiAnalysis = await analyzeProfileWithAI({
      firstName: profile.firstName,
      lastName: profile.lastName,
      headline: profile.headline,
      bio: profile.bio,
      githubUsername: profile.githubUsername,
      certifications: profile.certifications,
      labs: profile.labs,
      skills: skillsWithName,
    });

    const oldScore = profile.cyberScore;

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

    await prisma.scoreHistory.create({
      data: {
        candidateId: profile.id,
        scoreBefore: oldScore,
        scoreAfter: newScore,
        delta: newScore - oldScore,
        reason: "AI_RECALCULATION",
        breakdown: {
          certifications: Math.min(
            profile.certifications.filter((c) => c.status === "VERIFIED").length * 10,
            40
          ),
          labs: Math.min(profile.labs.length * 3, 25),
          skills: Math.min(profile.skills.length * 2, 15),
          github: profile.githubUsername ? 5 : 0,
        },
      },
    });

    return success({
      success: true,
      score: newScore,
      summary: aiAnalysis.summary,
      strengths: aiAnalysis.strengths,
      improvements: aiAnalysis.improvements,
      interviewQuestions: aiAnalysis.interviewQuestions,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
