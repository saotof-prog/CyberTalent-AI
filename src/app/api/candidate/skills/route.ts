import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";
import { candidateSkillSchema } from "@/lib/validation/candidateSkill";
import { rejectIfBanned } from "@/lib/auth-utils";
import { badRequest } from "@/lib/api-error";
import { recalculateAndTrack } from "@/lib/score-tracker";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const bannedResp = await rejectIfBanned(userId);
  if (bannedResp) return bannedResp;

  const rl = await checkRateLimit(rateLimitKey(req, `:skill:${userId}`), 10);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Trop de requêtes, réessayez dans une minute" }, { status: 429 });
  }

  const rawBody = await req.json();
  const parseResult = candidateSkillSchema.safeParse(rawBody);
  if (!parseResult.success) {
    return badRequest(parseResult.error.message);
  }
  const { skillName, category, level, yearsExp } = parseResult.data;

  try {
    const candidate = await prisma.candidateProfile.findFirst({
      where: { user: { clerkId: userId } },
      include: { certifications: true, labs: true, skills: true },
    });

    if (!candidate) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });

    const sanitizedSkillName = skillName.replace(/[<>]/g, "");
    const slug = sanitizedSkillName.toLowerCase().replace(/\s+/g, "-");
    let skill = await prisma.skill.findUnique({ where: { slug } });
    if (!skill) {
      skill = await prisma.skill.create({ data: { name: sanitizedSkillName, slug, category: category ?? "Autre" } });
    }

    // Add or update candidate skill
    const existing = await prisma.candidateSkill.findUnique({
      where: { candidateId_skillId: { candidateId: candidate.id, skillId: skill.id } },
    });

    const candidateSkill = existing
      ? await prisma.candidateSkill.update({
          where: { id: existing.id },
          data: { level, yearsExp },
        })
      : await prisma.candidateSkill.create({
          data: {
            candidateId: candidate.id,
            skillId: skill.id,
            level: level ?? "BEGINNER",
            yearsExp: yearsExp ?? null,
          },
        });

    const newScore = await recalculateAndTrack(candidate.id, `SKILL_ADDED: ${skillName}`, candidate.cyberScore);

    return NextResponse.json({ skill, candidateSkill, newScore });
  } catch (error) {
    console.error("ERREUR SKILL:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const bannedResp = await rejectIfBanned(userId);
  if (bannedResp) return bannedResp;

  const rl = await checkRateLimit(rateLimitKey(req, `:skill:${userId}`), 10);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Trop de requêtes, réessayez dans une minute" }, { status: 429 });
  }

  try {
    const candidate = await prisma.candidateProfile.findFirst({
      where: { user: { clerkId: userId } },
      include: { skills: { include: { skill: true } } },
    });

    return NextResponse.json(candidate?.skills ?? []);
  } catch (error) {
    console.error("ERREUR SKILLS GET:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
