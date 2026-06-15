import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";
  const body = await req.json();

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
          username: (body.firstName + body.lastName).toLowerCase() + Date.now(),
          role: "RECRUITER",
        },
      });
    }

    // Créer ou trouver l'entreprise
    const companySlug = body.companyName.toLowerCase().replace(/\s+/g, "-");
    const company = await prisma.company.upsert({
      where: { slug: companySlug },
      update: {
        size: body.companySize ?? null,
        industry: body.companyIndustry ?? null,
      },
      create: {
        name: body.companyName,
        slug: companySlug,
        size: body.companySize ?? null,
        industry: body.companyIndustry ?? null,
      },
    });

    // Créer le profil recruteur
    await prisma.recruiterProfile.upsert({
      where: { userId: user.id },
      update: {
        firstName: body.firstName,
        lastName: body.lastName,
        jobTitle: body.jobTitle ?? null,
        phoneNumber: body.phoneNumber ?? null,
        linkedinUrl: body.linkedinUrl ?? null,
        companyId: company.id,
      },
      create: {
        userId: user.id,
        firstName: body.firstName,
        lastName: body.lastName,
        jobTitle: body.jobTitle ?? null,
        phoneNumber: body.phoneNumber ?? null,
        linkedinUrl: body.linkedinUrl ?? null,
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
