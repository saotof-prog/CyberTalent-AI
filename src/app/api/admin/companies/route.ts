import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { rejectIfBanned } from "@/lib/auth-utils";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";
import { badRequest } from "@/lib/api-error";

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const bannedResp = await rejectIfBanned(userId);
  if (bannedResp) return bannedResp;

  const rl = await checkRateLimit(rateLimitKey(req, `:admin:companies`), 30);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Trop de requêtes" }, { status: 429 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId }, select: { role: true } });
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const { companyId, isVerified } = await req.json();
  if (!companyId || typeof companyId !== "string") {
    return badRequest("companyId valide manquant");
  }
  if (typeof isVerified !== "boolean") {
    return badRequest("isVerified doit être un booléen");
  }

  try {
    await prisma.company.update({ where: { id: companyId }, data: { isVerified } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN COMPANY UPDATE ERROR:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
