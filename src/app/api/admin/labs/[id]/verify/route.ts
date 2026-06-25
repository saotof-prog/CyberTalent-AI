import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { recalculateAndTrack } from "@/lib/score-tracker";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const rl = await checkRateLimit(rateLimitKey(req, `:admin:labVerify`), 30);
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
    const lab = await prisma.labCompletion.findUnique({
      where: { id },
      include: { candidate: { include: { user: true } } },
    });

    if (!lab) {
      return NextResponse.json({ error: "Lab introuvable" }, { status: 404 });
    }

    const sanitizedLabName = lab.labName.replace(/[<>]/g, "");
    const safeReason = reason ? reason.replace(/[<>]/g, "") : "";
    if (action === "APPROVE") {
      await prisma.labCompletion.update({
        where: { id },
        data: {
          isVerified: true,
          scoreImpact: 3,
        },
      });

      await recalculateAndTrack(lab.candidate.id, `LAB_ADMIN_APPROVED: ${lab.labName}`);

      await prisma.notification.create({
        data: {
          userId: lab.candidate.user.id,
          title: "Lab approuvé",
          body: `Votre lab « ${sanitizedLabName} » (${lab.platform}) a été approuvé par l'administrateur.`,
          type: "LAB_VERIFIED",
          link: "/dashboard/labs",
        },
      });

      return NextResponse.json({ success: true, isVerified: true });
    } else {
      await prisma.labCompletion.update({
        where: { id },
        data: {
          isVerified: false,
          scoreImpact: 0,
        },
      });

      await recalculateAndTrack(lab.candidate.id, `LAB_ADMIN_REJECTED: ${lab.labName}`);

      await prisma.notification.create({
        data: {
          userId: lab.candidate.user.id,
          title: "Lab rejeté",
          body: `Votre lab « ${sanitizedLabName} » a été rejeté.${safeReason ? ` Raison : ${safeReason}` : ""}`,
          type: "LAB_REJECTED",
          link: "/dashboard/labs",
        },
      });

      return NextResponse.json({ success: true, isVerified: false });
    }
  } catch (error) {
    console.error("ADMIN LAB VERIFY ERROR:", error);
    return NextResponse.json({ error: "Erreur lors de la vérification" }, { status: 500 });
  }
}
