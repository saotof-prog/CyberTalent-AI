import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { recalculateAndTrack } from "@/lib/score-tracker";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ skillId: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { skillId } = await params;

    const candidate = await prisma.candidateProfile.findFirst({
      where: { user: { clerkId: userId } },
    });
    if (!candidate) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });

    await prisma.candidateSkill.delete({
      where: {
        candidateId_skillId: {
          candidateId: candidate.id,
          skillId,
        },
      },
    });

    await recalculateAndTrack(candidate.id, `SKILL_DELETED: ${skillId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ERREUR SKILL DELETE:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
