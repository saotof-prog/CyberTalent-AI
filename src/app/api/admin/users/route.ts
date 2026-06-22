import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { rejectIfBanned } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const bannedResp = await rejectIfBanned(userId);
  if (bannedResp) return bannedResp;

  const user = await prisma.user.findUnique({ where: { clerkId: userId }, select: { role: true } });
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const { userId: targetId, isBanned, role } = await req.json();

  try {
    // Update role / ban flag
    const data: Record<string, unknown> = {};
    if (isBanned !== undefined) data.isBanned = isBanned;
    if (role) data.role = role;

    let createdProfile: string | null = null;
    let deletedProfile: string | null = null;

    await prisma.$transaction(async (tx) => {
      // 1️⃣ Update the user record
      await tx.user.update({ where: { id: targetId }, data });

      // 2️⃣ After role change, ensure the proper profile exists and clean the opposite one
      const updatedUser = await tx.user.findUnique({ where: { id: targetId }, select: { role: true } });
      if (!updatedUser) return;

      if (updatedUser.role === "CANDIDATE") {
        const cand = await tx.candidateProfile.findUnique({ where: { userId: targetId } });
        if (!cand) {
          await tx.candidateProfile.create({
            data: {
              userId: targetId,
              firstName: "John",
              lastName: "Doe",
            },
          });
          createdProfile = "candidate";
        }
        const rec = await tx.recruiterProfile.findUnique({ where: { userId: targetId } });
        if (rec) {
          await tx.recruiterProfile.delete({ where: { userId: targetId } });
          deletedProfile = "recruiter";
        }
      } else if (updatedUser.role === "RECRUITER") {
        const rec = await tx.recruiterProfile.findUnique({ where: { userId: targetId } });
        if (!rec) {
          await tx.recruiterProfile.create({
            data: {
              userId: targetId,
              firstName: "John",
              lastName: "Doe",
            },
          });
          createdProfile = "recruiter";
        }
        const cand = await tx.candidateProfile.findUnique({ where: { userId: targetId } });
        if (cand) {
          await tx.candidateProfile.delete({ where: { userId: targetId } });
          deletedProfile = "candidate";
        }
      }
    });

    return NextResponse.json({ success: true, createdProfile, deletedProfile });
  } catch (error) {
    console.error("ADMIN USER UPDATE ERROR:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
