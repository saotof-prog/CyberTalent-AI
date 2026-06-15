import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import RecalculateButton from "./recalculate-button";
import RecruiterDashboardClient from "./dashboard-client";

export default async function RecruiterDashboard({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    score?: string;
    cert?: string;
    country?: string;
    page?: string;
  }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Check if the user is actually a recruiter
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  if (user?.role !== "RECRUITER") {
    if (user?.role === "CANDIDATE") {
      redirect("/dashboard");
    } else {
      const candidateProfile = await prisma.candidateProfile.findFirst({
        where: { user: { clerkId: userId } },
        select: { id: true },
      });
      if (candidateProfile) {
        redirect("/dashboard");
      } else {
        redirect("/onboarding/recruiter");
      }
    }
  }

  const filters = await searchParams;

  const page = Math.max(1, parseInt(filters.page ?? "1"));
  const limit = 20;
  const skip = (page - 1) * limit;

  const and: Record<string, unknown>[] = [];
  if (filters.search) {
    and.push({
      OR: [
        { firstName: { contains: filters.search, mode: "insensitive" } },
        { lastName: { contains: filters.search, mode: "insensitive" } },
        { headline: { contains: filters.search, mode: "insensitive" } },
        { bio: { contains: filters.search, mode: "insensitive" } },
        { location: { contains: filters.search, mode: "insensitive" } },
        {
          skills: {
            some: { skill: { name: { contains: filters.search, mode: "insensitive" } } },
          },
        },
        {
          certifications: {
            some: { name: { contains: filters.search, mode: "insensitive" } },
          },
        },
      ],
    });
  }
  if (filters.score) and.push({ cyberScore: { gte: parseInt(filters.score) } });
  if (filters.country) and.push({ country: { equals: filters.country, mode: "insensitive" } });
  if (filters.cert) {
    and.push({
      certifications: {
        some: { name: { contains: filters.cert, mode: "insensitive" } },
      },
    });
  }
  const where = { AND: and.length > 0 ? and : undefined };

  const [candidates, totalCount] = await Promise.all([
    prisma.candidateProfile.findMany({
      where,
      include: {
        user: true,
        certifications: { where: { status: "VERIFIED" } },
        labs: true,
        skills: { include: { skill: true } },
      },
      orderBy: { cyberScore: "desc" },
      skip,
      take: limit,
    }),
    prisma.candidateProfile.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="min-h-screen bg-[#080c14]">
      <div className="p-4 md:p-6 md:max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-mono text-2xl md:text-3xl font-bold text-white mb-2">
              Recherche de <span className="text-[#ff4060]">Talents Cyber</span> 🎯
            </h1>
            <p className="text-gray-400 font-mono text-xs md:text-sm">
              {totalCount} candidat{totalCount > 1 ? "s" : ""} · Page {page}/{totalPages}
            </p>
          </div>
          <RecalculateButton />
        </div>

        <Suspense
          fallback={
            <div className="text-gray-500 font-mono text-sm text-center py-8">Chargement...</div>
          }
        >
          <RecruiterDashboardClient
            initialCandidates={candidates}
            currentPage={page}
            totalPages={totalPages}
          />
        </Suspense>
      </div>
    </div>
  );
}
