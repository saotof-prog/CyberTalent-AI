import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { rejectIfBanned } from "@/lib/auth-utils";
import { recalculateAndTrack } from "@/lib/score-tracker";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";
import { badRequest } from "@/lib/api-error";
import { logSecurityEvent } from "@/lib/security-log";
import { sanitizeText } from "@/lib/sanitize";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const bannedResp = await rejectIfBanned(userId, req);
  if (bannedResp) return bannedResp;

  const rl = await checkRateLimit(rateLimitKey(req, `:admin:certVerify`), 30, 60000, 5);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Trop de requêtes" }, { status: 429 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId }, select: { role: true } });
  if (!user || user.role !== "ADMIN") {
    await logSecurityEvent({
      type: "UNAUTHORIZED_ACCESS",
      userId,
      path: "/api/admin/certifications/[id]/verify",
      method: "POST",
      details: "Tentative de vérification de certification sans droits admin",
    });
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const action = body.action as string;
  const reason = body.reason as string | undefined;

  if (!action || !["APPROVE", "REJECT"].includes(action)) {
    return badRequest("Action invalide. Utilisez APPROVE ou REJECT");
  }

  if (reason && typeof reason === "string" && reason.length > 1000) {
    return badRequest("Raison trop longue (1000 caractères max)");
  }

  try {
    const cert = await prisma.certification.findUnique({
      where: { id },
      include: { candidate: { include: { user: true } } },
    });

    if (!cert) {
      return NextResponse.json({ error: "Certification introuvable" }, { status: 404 });
    }

    const sanitizedCertName = sanitizeText(cert.name);
    const safeReason = reason ? sanitizeText(reason) : undefined;

    if (action === "APPROVE") {
      await prisma.certification.update({
        where: { id },
        data: {
          status: "VERIFIED",
          scoreImpact: 10,
          aiVerifiedAt: new Date(),
          aiNotes: safeReason ? `Approuvé par admin : ${safeReason}` : "Approuvé par l'administrateur",
        },
      });

      await recalculateAndTrack(cert.candidate.id, `CERT_ADMIN_APPROVED: ${cert.name}`);

      await prisma.notification.create({
        data: {
          userId: cert.candidate.user.id,
          title: "Certification approuvée",
          body: `Votre certification « ${sanitizedCertName} » a été approuvée par l'administrateur.`,
          type: "CERT_VERIFIED",
          link: "/dashboard/certifications",
        },
      });

      await logSecurityEvent({
        type: "ADMIN_ACTION",
        userId,
        path: "/api/admin/certifications/[id]/verify",
        method: "POST",
        details: `Approbation de la certification ${cert.name} (${id})`,
        metadata: { certificationId: id, action: "APPROVE", candidateId: cert.candidate.user.id },
      });

      return NextResponse.json({ success: true, status: "VERIFIED" });
    } else {
      await prisma.certification.update({
        where: { id },
        data: {
          status: "REJECTED",
          aiNotes: safeReason || "Rejeté par l'administrateur",
          scoreImpact: 0,
        },
      });

      await recalculateAndTrack(cert.candidate.id, `CERT_ADMIN_REJECTED: ${cert.name}`);

      await prisma.notification.create({
        data: {
          userId: cert.candidate.user.id,
          title: "Certification rejetée",
          body: `Votre certification « ${sanitizedCertName} » a été rejetée.${safeReason ? ` Raison : ${safeReason}` : ""}`,
          type: "CERT_REJECTED",
          link: "/dashboard/certifications",
        },
      });

      await logSecurityEvent({
        type: "ADMIN_ACTION",
        userId,
        path: "/api/admin/certifications/[id]/verify",
        method: "POST",
        details: `Rejet de la certification ${cert.name} (${id})`,
        metadata: { certificationId: id, action: "REJECT", candidateId: cert.candidate.user.id, reason: safeReason },
      });

      return NextResponse.json({ success: true, status: "REJECTED" });
    }
  } catch (error) {
    console.error("ADMIN CERT VERIFY ERROR:", error);
    return NextResponse.json({ error: "Erreur lors de la vérification" }, { status: 500 });
  }
}
