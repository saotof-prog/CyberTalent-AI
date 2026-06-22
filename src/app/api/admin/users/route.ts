import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { rejectIfBanned } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const bannedResp = await rejectIfBanned(userId);
  if (bannedResp) return bannedResp;

  const user = await prisma.user.findUnique({ where: { clerkId: userId }, select: { role: true } });
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const { userId: targetId, isBanned, role } = await req.json();

  try {
    const data: Record<string, unknown> = {};
    if (isBanned !== undefined) data.isBanned = isBanned;
    if (role) data.role = role;

    await prisma.user.update({ where: { id: targetId }, data });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN USER UPDATE ERROR:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
