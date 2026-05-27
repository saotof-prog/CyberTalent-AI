import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";

  const skills = await prisma.skill.findMany({
    where: {
      name: { contains: q, mode: "insensitive" },
    },
    take: 10,
  });

  return NextResponse.json(skills);
}