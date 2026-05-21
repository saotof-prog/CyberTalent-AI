import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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