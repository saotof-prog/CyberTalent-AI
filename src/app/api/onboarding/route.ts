import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";
  const body = await req.json();

  try {
    // Chercher si l'user existe déjà par clerkId OU par email
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { clerkId: userId },
          { email: email },
        ],
      },
    });

    if (user) {
      // Mettre à jour le clerkId si nécessaire
      user = await prisma.user.update({
        where: { id: user.id },
        data: { clerkId: userId, email: email },
      });
    } else {
      // Créer un nouvel utilisateur
      const username = (body.firstName + body.lastName)
        .toLowerCase()
        .replace(/\s/g, "") + Date.now();

      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: email,
          username: username,
          role: "CANDIDATE",
        },
      });
    }

    // Créer ou mettre à jour le profil candidat
    await prisma.candidateProfile.upsert({
      where: { userId: user.id },
      update: {
        firstName: body.firstName,
        lastName: body.lastName,
        headline: body.headline ?? "",
        location: body.location ?? "",
        country: body.country ?? "",
        githubUsername: body.githubUsername ?? "",
        bio: body.bio ?? "",
        profileComplete: 30,
      },
      create: {
        userId: user.id,
        firstName: body.firstName,
        lastName: body.lastName,
        headline: body.headline ?? "",
        location: body.location ?? "",
        country: body.country ?? "",
        githubUsername: body.githubUsername ?? "",
        bio: body.bio ?? "",
        profileComplete: 30,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ERREUR PRISMA:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}