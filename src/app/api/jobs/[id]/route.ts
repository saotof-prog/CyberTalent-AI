import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { rejectIfBanned } from "@/lib/auth-utils";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const bannedResp = await rejectIfBanned(userId);
  if (bannedResp) return bannedResp;

  const { id } = await params;
  const body = await req.json();

  const existing = await prisma.job.findUnique({
    where: { id },
    include: { recruiter: { include: { user: true } } },
  });
  if (!existing) return NextResponse.json({ error: "Offre introuvable" }, { status: 404 });
  if (existing.recruiter.user.clerkId !== userId)
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const job = await prisma.job.update({
    where: { id },
    data: { isActive: body.isActive },
  });

  return NextResponse.json(job);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const bannedResp = await rejectIfBanned(userId);
  if (bannedResp) return bannedResp;

  const { id } = await params;

  const existing = await prisma.job.findUnique({
    where: { id },
    include: { recruiter: { include: { user: true } } },
  });
  if (!existing) return NextResponse.json({ error: "Offre introuvable" }, { status: 404 });
  if (existing.recruiter.user.clerkId !== userId)
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  await prisma.job.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
