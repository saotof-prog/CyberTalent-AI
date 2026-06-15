import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { recalculateAndTrack } from "@/lib/score-tracker";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { skillName, category, level, yearsExp } = await req.json();

  try {
    const candidate = await prisma.candidateProfile.findFirst({
      where: { user: { clerkId: userId } },
      include: {
        certifications: true,
        labs: true,
        skills: true,
      },
    });

    if (!candidate) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });

    // Créer le skill s'il n'existe pas
    const slug = skillName.toLowerCase().replace(/\s+/g, "-");
    const skill = await prisma.skill.upsert({
      where: { slug },
      update: {},
      create: {
        name: skillName,
        slug,
        category: category ?? "Autre",
      },
    });

    // Ajouter au candidat
    const candidateSkill = await prisma.candidateSkill.upsert({
      where: {
        candidateId_skillId: {
          candidateId: candidate.id,
          skillId: skill.id,
        },
      },
      update: { level, yearsExp },
      create: {
        candidateId: candidate.id,
        skillId: skill.id,
        level: level ?? "BEGINNER",
        yearsExp: yearsExp ?? null,
      },
    });

    const newScore = await recalculateAndTrack(
      candidate.id,
      `SKILL_ADDED: ${skillName}`,
      candidate.cyberScore
    );

    return NextResponse.json({ skill, candidateSkill, newScore });
  } catch (error) {
    console.error("ERREUR SKILL:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const candidate = await prisma.candidateProfile.findFirst({
      where: { user: { clerkId: userId } },
      include: {
        skills: { include: { skill: true } },
      },
    });

    return NextResponse.json(candidate?.skills ?? []);
  } catch (error) {
    console.error("ERREUR SKILLS GET:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
