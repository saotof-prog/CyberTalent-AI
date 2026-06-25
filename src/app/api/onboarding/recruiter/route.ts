import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { onboardingRecruiterSchema } from "@/lib/validation/onboardingRecruiter";
import { badRequest } from "@/lib/api-error";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const rl = await checkRateLimit(rateLimitKey(req, `:onboardingRecruiter:${userId}`), 10);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Trop de requêtes, réessayez dans une minute" }, { status: 429 });
  }

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";
  const body = await req.json();
  const parseResult = onboardingRecruiterSchema.safeParse(body);
  if (!parseResult.success) {
    return badRequest(parseResult.error.message);
  }
  const validBody = parseResult.data;

  try {
    // Créer ou mettre à jour le user
    let user = await prisma.user.findFirst({
      where: { OR: [{ clerkId: userId }, { email }] },
    });

    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { clerkId: userId, email, role: "RECRUITER" },
      });
    } else {
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email,
          username: (validBody.firstName + validBody.lastName).toLowerCase() + Date.now(),
          role: "RECRUITER",
        },
      });
    }

    const companySlug = validBody.companyName.toLowerCase().replace(/\s+/g, "-");
    const company = await prisma.company.upsert({
      where: { slug: companySlug },
      update: {
        size: validBody.companySize ?? null,
        industry: validBody.companyIndustry ?? null,
      },
      create: {
        name: validBody.companyName,
        slug: companySlug,
        size: validBody.companySize ?? null,
        industry: validBody.companyIndustry ?? null,
      },
    });

    await prisma.recruiterProfile.upsert({
      where: { userId: user.id },
      update: {
        firstName: validBody.firstName,
        lastName: validBody.lastName,
        jobTitle: validBody.jobTitle ?? null,
        phoneNumber: validBody.phoneNumber ?? null,
        linkedinUrl: validBody.linkedinUrl ?? null,
        companyId: company.id,
      },
      create: {
        userId: user.id,
        firstName: validBody.firstName,
        lastName: validBody.lastName,
        jobTitle: validBody.jobTitle ?? null,
        phoneNumber: validBody.phoneNumber ?? null,
        linkedinUrl: validBody.linkedinUrl ?? null,
        companyId: company.id,
      },
    });

    // Synchroniser le rôle dans Clerk
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { role: "RECRUITER" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ERREUR ONBOARDING RECRUTEUR:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
