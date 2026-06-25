import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { rejectIfBanned } from "@/lib/auth-utils";
import { jobSchema } from "@/lib/validation/job";
import { badRequest } from "@/lib/api-error";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const bannedResp = await rejectIfBanned(userId);
  if (bannedResp) return bannedResp;

  const rl = await checkRateLimit(rateLimitKey(req, `:jobs:${userId}`), 10);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Trop de requêtes, réessayez dans une minute" }, { status: 429 });
  }

  const recruiter = await prisma.recruiterProfile.findFirst({
    where: { user: { clerkId: userId } },
  });
  if (!recruiter)
    return NextResponse.json({ error: "Profil recruteur introuvable" }, { status: 404 });

  const body = await req.json();
  const parseResult = jobSchema.safeParse(body);
  if (!parseResult.success) {
    return badRequest(parseResult.error.message);
  }
  const validBody = parseResult.data;
  const slug = validBody.title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();

  const job = await prisma.job.create({
    data: {
      recruiterId: recruiter.id,
      title: validBody.title,
      slug,
      description: validBody.description,
      requirements: validBody.requirements ?? null,
      location: validBody.location ?? null,
      country: validBody.country ?? null,
      type: validBody.type,
      mode: validBody.mode,
      salaryMin: validBody.salaryMin ?? null,
      salaryMax: validBody.salaryMax ?? null,
      minScore: validBody.minScore ?? null,
      isUrgent: validBody.isUrgent ?? false,
      tags: validBody.tags ?? [],
    },
  });

  return NextResponse.json(job);
}
