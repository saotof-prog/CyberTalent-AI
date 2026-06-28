import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rejectIfBanned } from "@/lib/auth-utils";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";
import { badRequest } from "@/lib/api-error";

const ALLOWED_ROLES = ["CANDIDATE", "RECRUITER"] as const;

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const bannedResp = await rejectIfBanned(userId);
  if (bannedResp) return bannedResp;

  const rl = await checkRateLimit(rateLimitKey(req, `:chooseRole:${userId}`), 5);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Trop de requêtes, réessayez dans une minute" }, { status: 429 });
  }

  const { role } = await req.json();
  if (!role || !ALLOWED_ROLES.includes(role)) {
    return badRequest("Rôle invalide. Choisissez CANDIDATE ou RECRUITER");
  }

  try {
    // 1. Récupérer l'email depuis Clerk
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const email = clerkUser.emailAddresses?.[0]?.emailAddress ?? userId + "@placeholder.com";
    const username = clerkUser.username ?? userId;

    // 2. Sauvegarder en base
    await prisma.user.upsert({
      where: { clerkId: userId },
      update: { role, email, username },
      create: {
        clerkId: userId,
        email,
        username,
        role,
      },
    });

    // 3. Sauvegarder le rôle dans les metadata Clerk
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { role },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
