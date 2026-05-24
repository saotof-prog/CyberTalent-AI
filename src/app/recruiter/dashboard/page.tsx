import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import RecalculateButton from "./recalculate-button";
import RecruiterDashboardClient from "./dashboard-client";

const prisma = new PrismaClient();

export default async function RecruiterDashboard({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    score?: string;
    cert?: string;
    country?: string;
  }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const filters = await searchParams;

  const candidates = await prisma.candidateProfile.findMany({
    where: {
      AND: [
        filters.search
          ? {
              OR: [
                { firstName: { contains: filters.search, mode: "insensitive" } },
                { lastName: { contains: filters.search, mode: "insensitive" } },
                { headline: { contains: filters.search, mode: "insensitive" } },
              ],
            }
          : {},
        filters.score
          ? { cyberScore: { gte: parseInt(filters.score) } }
          : {},
        filters.country
          ? { country: { equals: filters.country, mode: "insensitive" } }
          : {},
        filters.cert
          ? {
              certifications: {
                some: {
                  name: { contains: filters.cert, mode: "insensitive" },
                },
              },
            }
          : {},
      ],
    },
    include: {
      user: true,
      certifications: { where: { status: "VERIFIED" } },
      labs: true,
      skills: { include: { skill: true } },
    },
    orderBy: { cyberScore: "desc" },
    take: 50,
  });

  return (
    <div className="min-h-screen bg-[#080c14]">
      <div className="p-4 md:p-6 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-mono text-2xl md:text-3xl font-bold text-white mb-2">
              Recherche de{" "}
              <span className="text-[#ff4060]">Talents Cyber</span> 🎯
            </h1>
            <p className="text-gray-400 font-mono text-xs md:text-sm">
              {candidates.length} candidats disponibles · Classés par score
            </p>
          </div>
          <RecalculateButton />
        </div>

        <RecruiterDashboardClient initialCandidates={candidates} />

      </div>
    </div>
  );
}