import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { logSecurityEvent } from "@/lib/security-log";

export async function rejectIfBanned(userId: string, req?: Request) {
  if (!prisma?.user?.findUnique) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { isBanned: true, banExpiresAt: true },
  });

  if (!user?.isBanned) return null;

  if (user.banExpiresAt && user.banExpiresAt < new Date()) {
    await prisma.user.update({
      where: { clerkId: userId },
      data: { isBanned: false, banExpiresAt: null, banReason: null },
    });
    return null;
  }

  await logSecurityEvent({
    type: "BANNED_USER_ACCESS",
    userId,
    ip: req?.headers?.get("x-forwarded-for") ?? undefined,
    path: req?.url ?? undefined,
    method: req?.method ?? undefined,
    details: "Utilisateur banni a tenté d'accéder à une ressource",
  });

  return NextResponse.json({ error: "Compte banni", code: "BANNED" }, { status: 403 });
}
