import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { role } = await req.json();

  try {
    // 1. Sauvegarder en base
    await prisma.user.upsert({
      where: { clerkId: userId },
      update: { role },
      create: {
        clerkId: userId,
        email: "",
        username: userId + Date.now(),
        role,
      },
    });

    // 2. Sauvegarder le rôle dans les metadata Clerk
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { role },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}