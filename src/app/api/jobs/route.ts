import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const recruiter = await prisma.recruiterProfile.findFirst({
    where: { user: { clerkId: userId } },
  });
  if (!recruiter) return NextResponse.json({ error: "Profil recruteur introuvable" }, { status: 404 });

  const body = await req.json();
  const slug = body.title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();

  const job = await prisma.job.create({
    data: {
      recruiterId: recruiter.id,
      title: body.title,
      slug,
      description: body.description,
      requirements: body.requirements ?? null,
      location: body.location ?? null,
      country: body.country ?? null,
      type: body.type,
      mode: body.mode,
      salaryMin: body.salaryMin ? parseInt(body.salaryMin) : null,
      salaryMax: body.salaryMax ? parseInt(body.salaryMax) : null,
      minScore: body.minScore ? parseInt(body.minScore) : null,
      isUrgent: body.isUrgent ?? false,
      tags: body.tags ?? [],
    },
  });

  return NextResponse.json(job);
}