import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { candidateProfile: true },
    });

    if (!user?.candidateProfile) {
      return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });
    }

    const cert = await prisma.certification.create({
      data: {
        candidateId: user.candidateProfile.id,
        name: body.name,
        fullName: body.fullName ?? "",
        issuer: body.issuer,
        issuedAt: new Date(body.issuedAt),
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        hasExpiry: !!body.expiresAt,
        fileUrl: body.fileUrl,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, cert });
  } catch (error) {
    console.error("ERREUR CERT:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        candidateProfile: {
          include: { certifications: true },
        },
      },
    });

    return NextResponse.json(user?.candidateProfile?.certifications ?? []);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}