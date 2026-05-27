import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const ADMIN_ID = "user_3EAT5iB7v76L1L4QQ2uldeubkpW";

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId || userId !== ADMIN_ID) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { userId: targetId, isBanned, role } = await req.json();

  try {
    const data: Record<string, unknown> = {};
    if (isBanned !== undefined) data.isBanned = isBanned;
    if (role) data.role = role;

    await prisma.user.update({ where: { id: targetId }, data });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN USER UPDATE ERROR:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
