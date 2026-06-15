import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = [
  "PENDING",
  "VIEWED",
  "SHORTLISTED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
] as const;

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const { status } = await req.json();

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Status invalide" }, { status: 400 });
  }

  try {
    const app = await prisma.application.findUnique({
      where: { id },
      include: { job: { include: { recruiter: { include: { user: true } } } } },
    });

    if (!app) {
      return NextResponse.json({ error: "Candidature introuvable" }, { status: 404 });
    }

    if (app.job.recruiter.user.clerkId !== userId) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const updated = await prisma.application.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, status: updated.status });
  } catch (error) {
    console.error("PATCH APPLICATION ERROR:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
