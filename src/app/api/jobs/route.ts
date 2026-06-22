import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { rejectIfBanned } from "@/lib/auth-utils";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const bannedResp = await rejectIfBanned(userId);
  if (bannedResp) return bannedResp;

  const recruiter = await prisma.recruiterProfile.findFirst({
    where: { user: { clerkId: userId } },
  });
  if (!recruiter)
    return NextResponse.json({ error: "Profil recruteur introuvable" }, { status: 404 });

  const body = await req.json();
  if (!body.title || typeof body.title !== "string")
    return NextResponse.json({ error: "Le titre est requis" }, { status: 400 });
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
