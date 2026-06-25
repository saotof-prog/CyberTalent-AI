import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { recalculateAndTrack } from "@/lib/score-tracker";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const rl = await checkRateLimit(rateLimitKey(req, `:admin:certVerify`), 30);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Trop de requêtes" }, { status: 429 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId }, select: { role: true } });
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const action = body.action as string;
  const reason = body.reason as string | undefined;

  if (!action || !["APPROVE", "REJECT"].includes(action)) {
    return NextResponse.json({ error: "Action invalide. Utilisez APPROVE ou REJECT" }, { status: 400 });
  }

  try {
    const cert = await prisma.certification.findUnique({
      where: { id },
      include: { candidate: { include: { user: true } } },
    });

    if (!cert) {
      return NextResponse.json({ error: "Certification introuvable" }, { status: 404 });
    }

    const sanitizedCertName = cert.name.replace(/[<>]/g, "");
    if (action === "APPROVE") {
      await prisma.certification.update({
        where: { id },
        data: {
          status: "VERIFIED",
          scoreImpact: 10,
          aiVerifiedAt: new Date(),
          aiNotes: reason ? `Approuvé par admin : ${reason}` : "Approuvé par l'administrateur",
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

      return NextResponse.json({ success: true, status: "VERIFIED" });
    } else {
      await prisma.certification.update({
        where: { id },
        data: {
          status: "REJECTED",
          aiNotes: reason || "Rejeté par l'administrateur",
          scoreImpact: 0,
        },
      });

      await recalculateAndTrack(cert.candidate.id, `CERT_ADMIN_REJECTED: ${cert.name}`);

      const safeReason = reason ? reason.replace(/[<>]/g, "") : "";
      await prisma.notification.create({
        data: {
          userId: cert.candidate.user.id,
          title: "Certification rejetée",
          body: `Votre certification « ${sanitizedCertName} » a été rejetée.${safeReason ? ` Raison : ${safeReason}` : ""}`,
          type: "CERT_REJECTED",
          link: "/dashboard/certifications",
        },
      });

      return NextResponse.json({ success: true, status: "REJECTED" });
    }
  } catch (error) {
    console.error("ADMIN CERT VERIFY ERROR:", error);
    return NextResponse.json({ error: "Erreur lors de la vérification" }, { status: 500 });
  }
}
