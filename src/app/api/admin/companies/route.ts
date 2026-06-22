import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { rejectIfBanned } from "@/lib/auth-utils";

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const bannedResp = await rejectIfBanned(userId);
  if (bannedResp) return bannedResp;

  const user = await prisma.user.findUnique({ where: { clerkId: userId }, select: { role: true } });
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const { companyId, isVerified } = await req.json();

  try {
    await prisma.company.update({ where: { id: companyId }, data: { isVerified } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN COMPANY UPDATE ERROR:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
