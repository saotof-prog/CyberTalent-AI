import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";
import { badRequest } from "@/lib/api-error";

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const rl = await checkRateLimit(rateLimitKey(req, `:admin:jobs`), 30);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Trop de requêtes" }, { status: 429 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId }, select: { role: true } });
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const { jobId, isActive } = await req.json();
  if (!jobId || typeof jobId !== "string") {
    return badRequest("jobId valide manquant");
  }
  if (typeof isActive !== "boolean") {
    return badRequest("isActive doit être un booléen");
  }

  try {
    await prisma.job.update({ where: { id: jobId }, data: { isActive } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN JOB UPDATE ERROR:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
