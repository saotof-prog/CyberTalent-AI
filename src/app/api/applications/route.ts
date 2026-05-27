import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { jobId } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { candidateProfile: true },
    });

    if (!user?.candidateProfile) {
      return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });
    }

    // Vérifier si déjà postulé
    const existing = await prisma.application.findUnique({
      where: {
        candidateId_jobId: {
          candidateId: user.candidateProfile.id,
          jobId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: "Déjà postulé" }, { status: 400 });
    }

    const application = await prisma.application.create({
      data: {
        candidateId: user.candidateProfile.id,
        jobId,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error("ERREUR APPLICATION:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        candidateProfile: {
          include: {
            applications: {
              include: { job: true },
              orderBy: { appliedAt: "desc" },
            },
          },
        },
      },
    });

    return NextResponse.json(user?.candidateProfile?.applications ?? []);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}