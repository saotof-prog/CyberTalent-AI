import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();

  try {
    const recruiter = await prisma.recruiterProfile.findFirst({
      where: { user: { clerkId: userId } },
    });

    if (!recruiter) return NextResponse.json({ error: "Profil recruteur introuvable" }, { status: 404 });

    // Toggle save/unsave
    const existing = await prisma.savedCandidate.findUnique({
      where: {
        recruiterId_candidateId: {
          recruiterId: recruiter.id,
          candidateId: body.candidateId,
        },
      },
    });

    if (existing) {
      await prisma.savedCandidate.delete({ where: { id: existing.id } });
      return NextResponse.json({ saved: false });
    } else {
      await prisma.savedCandidate.create({
        data: {
          recruiterId: recruiter.id,
          candidateId: body.candidateId,
          note: body.note ?? null,
        },
      });
      return NextResponse.json({ saved: true });
    }
  } catch (error) {
    console.error("ERREUR SAVE:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}