import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const ADMIN_ID = "user_3DzGZHTqCcaF4yvqP27rrB2RWBj";

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId || userId !== ADMIN_ID) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { jobId, isActive } = await req.json();

  try {
    await prisma.job.update({ where: { id: jobId }, data: { isActive } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN JOB UPDATE ERROR:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
