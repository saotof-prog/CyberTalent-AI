import { prisma } from "@/lib/prisma";
import { calculateCyberScore } from "@/lib/score";

export async function recalculateAndTrack(candidateId: string, reason: string, oldScore?: number) {
  const [certs, labs, skills, candidate] = await Promise.all([
    prisma.certification.findMany({ where: { candidateId } }),
    prisma.labCompletion.findMany({ where: { candidateId } }),
    prisma.candidateSkill.findMany({ where: { candidateId } }),
    prisma.candidateProfile.findUnique({ where: { id: candidateId } }),
  ]);

  if (!candidate) return;

  const scoreBefore = oldScore ?? candidate.cyberScore;
  const scoreAfter = calculateCyberScore({
    certifications: certs,
    labs,
    skills,
    githubUsername: candidate.githubUsername,
    githubStats: candidate.githubStats,
  });

  await prisma.candidateProfile.update({
    where: { id: candidateId },
    data: { cyberScore: scoreAfter, scoreUpdatedAt: new Date() },
  });

  await prisma.scoreHistory.create({
    data: {
      candidateId,
      scoreBefore,
      scoreAfter,
      delta: scoreAfter - scoreBefore,
      reason,
      breakdown: {
        certifications: Math.min(certs.filter((c) => c.status === "VERIFIED").length * 10, 40),
        labs: Math.min(labs.length * 3, 25),
        skills: Math.min(skills.length * 2, 15),
        github: candidate.githubUsername ? 5 : 0,
      },
    },
  });

  return scoreAfter;
}
