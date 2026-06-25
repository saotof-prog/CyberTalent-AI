import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const q = (req.nextUrl.searchParams.get("q") ?? "").replace(/[<>]/g, "").slice(0, 100);

  const skills = await prisma.skill.findMany({
    where: {
      name: { contains: q, mode: "insensitive" },
    },
    take: 10,
  });

  return NextResponse.json(skills);
}
