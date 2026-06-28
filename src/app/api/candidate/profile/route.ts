import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { rejectIfBanned } from "@/lib/auth-utils";
import { sanitizeText } from "@/lib/sanitize";

const ALLOWED_FIELDS = [
  "firstName",
  "lastName",
  "headline",
  "bio",
  "location",
  "country",
  "timezone",
  "phoneNumber",
  "website",
  "linkedinUrl",
  "twitterUrl",
  "githubUsername",
  "isAvailable",
  "availableFrom",
  "salaryMin",
  "salaryMax",
] as const;

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const bannedResp = await rejectIfBanned(userId);
  if (bannedResp) return bannedResp;

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        candidateProfile: {
          select: ALLOWED_FIELDS.reduce(
            (acc, f) => ({ ...acc, [f]: true }),
            {} as Record<string, boolean>
          ),
        },
      },
    });

    if (!user?.candidateProfile) {
      return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });
    }

    return NextResponse.json({ profile: user.candidateProfile });
  } catch (error) {
    console.error("PROFILE GET ERROR:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const bannedResp = await rejectIfBanned(userId);
  if (bannedResp) return bannedResp;

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { candidateProfile: true },
    });

    if (!user?.candidateProfile) {
      return NextResponse.json({ error: "Profil candidat introuvable" }, { status: 404 });
    }

    const body = await req.json();

    const data: Record<string, unknown> = {};
    for (const key of ALLOWED_FIELDS) {
      if (body[key] !== undefined) {
        if (typeof body[key] === "string") {
          data[key] = sanitizeText(body[key]);
        } else {
          data[key] = body[key];
        }
      }
    }

    await prisma.candidateProfile.update({
      where: { id: user.candidateProfile.id },
      data,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
