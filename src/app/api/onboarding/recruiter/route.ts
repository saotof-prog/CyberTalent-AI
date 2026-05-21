import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();

  // Mettre à jour le rôle user en RECRUITER
  const user = await prisma.user.update({
    where: { clerkId: userId },
    data: { role: "RECRUITER" },
  });

  // Créer le profil recruteur
  await prisma.recruiterProfile.create({
    data: {
      userId: user.id,
      firstName: body.firstName,
      lastName: body.lastName,
      jobTitle: body.jobTitle || null,
      bio: body.bio || null,
      phoneNumber: body.phoneNumber || null,
      linkedinUrl: body.linkedinUrl || null,
    },
  });

  return NextResponse.json({ ok: true });
}