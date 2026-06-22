import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";
import { onboardingSchema } from "@/lib/validation/onboarding";
import { badRequest } from "@/lib/api-error";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  // Rate limiting (10 req/min per user)
  const rl = checkRateLimit(rateLimitKey(req, `:onboarding:${userId}`), 10);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Trop de requêtes, réessayez dans une minute" }, { status: 429 });
  }

  const body = await req.json();
  const parseResult = onboardingSchema.safeParse(body);
  if (!parseResult.success) {
    return badRequest(parseResult.error.errors.map(e => e.message).join(", "));
  }
  const validBody = parseResult.data;

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";

  try {
    await prisma.$transaction(async (tx) => {
      // Find existing user or create new one
      let user = await tx.user.findFirst({
        where: {
          OR: [{ clerkId: userId }, { email }],
        },
      });

      if (user) {
        user = await tx.user.update({
          where: { id: user.id },
          data: { clerkId: userId, email },
        });
      } else {
        const username = (validBody.firstName + validBody.lastName).toLowerCase().replace(/\s/g, "") + Date.now();
        user = await tx.user.create({
          data: {
            clerkId: userId,
            email,
            username,
            role: "CANDIDATE",
          },
        });
      }

      // Upsert candidate profile
      await tx.candidateProfile.upsert({
        where: { userId: user.id },
        update: {
          firstName: validBody.firstName,
          lastName: validBody.lastName,
          headline: validBody.headline ?? "",
          location: validBody.location ?? "",
          country: validBody.country ?? "",
          githubUsername: validBody.githubUsername ?? "",
          bio: validBody.bio ?? "",
          profileComplete: 30,
        },
        create: {
          userId: user.id,
          firstName: validBody.firstName,
          lastName: validBody.lastName,
          headline: validBody.headline ?? "",
          location: validBody.location ?? "",
          country: validBody.country ?? "",
          githubUsername: validBody.githubUsername ?? "",
          bio: validBody.bio ?? "",
          profileComplete: 30,
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ERREUR PRISMA:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
