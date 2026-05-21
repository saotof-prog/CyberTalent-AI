import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Ajouter un skill
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { skillName, category, level, yearsExp } = await req.json();

  const candidate = await prisma.candidateProfile.findFirst({
    where: { user: { clerkId: userId } },
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

  // Ajouter au candidat (ignore si déjà présent)
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

  return NextResponse.json({ skill, candidateSkill });
}

// Lister les skills du candidat
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const candidate = await prisma.candidateProfile.findFirst({
    where: { user: { clerkId: userId } },
    include: {
      skills: { include: { skill: true } },
    },
  });

  return NextResponse.json(candidate?.skills ?? []);
}