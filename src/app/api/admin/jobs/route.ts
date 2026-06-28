import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { rejectIfBanned } from "@/lib/auth-utils";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";
import { badRequest } from "@/lib/api-error";
import { logSecurityEvent } from "@/lib/security-log";

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const bannedResp = await rejectIfBanned(userId, req);
  if (bannedResp) return bannedResp;

  const rl = await checkRateLimit(rateLimitKey(req, `:admin:jobs`), 30, 60000, 5);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Trop de requêtes" }, { status: 429 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId }, select: { role: true } });
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return badRequest("JSON invalide");
  }

  const { jobId, isActive } = body as { jobId?: string; isActive?: boolean };
  if (!jobId || typeof jobId !== "string") {
    return badRequest("jobId valide manquant");
  }
  if (typeof isActive !== "boolean") {
    return badRequest("isActive doit être un booléen");
  }

  try {
    const job = await prisma.job.findUnique({ where: { id: jobId }, select: { id: true, title: true } });
    if (!job) {
      return NextResponse.json({ error: "Offre introuvable" }, { status: 404 });
    }

    await prisma.job.update({ where: { id: jobId }, data: { isActive } });

    await logSecurityEvent({
      type: "ADMIN_ACTION",
      userId,
      path: "/api/admin/jobs",
      method: "PATCH",
      details: `${isActive ? "Activation" : "Désactivation"} de l'offre ${job.title} (${jobId})`,
      metadata: { jobId, jobTitle: job.title, isActive },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN JOB UPDATE ERROR:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
