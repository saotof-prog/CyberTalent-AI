import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const candidate = await prisma.candidateProfile.findFirst({
      where: { user: { clerkId: userId } },
      include: { githubRepos: true },
    });

    if (!candidate || !candidate.githubUsername) {
      return NextResponse.json({ error: "Aucun username GitHub configuré" }, { status: 400 });
    }

    const username = candidate.githubUsername;
    const token = process.env.GITHUB_TOKEN;

    const headers: HeadersInit = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=50&sort=updated`, { headers }),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      return NextResponse.json({ error: "GitHub user introuvable" }, { status: 404 });
    }

    const userData: any = await userRes.json();
    const reposData: any[] = await reposRes.json();

    const languages: string[] = [...new Set(
      reposData.map((r: any) => r.language).filter((l: string | null) => l != null)
    )];

    const stats = {
      public_repos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      total_stars: reposData.reduce((acc: number, r: any) => acc + r.stargazers_count, 0),
      total_forks: reposData.reduce((acc: number, r: any) => acc + r.forks_count, 0),
      languages,
    };

    await prisma.$transaction([
      prisma.githubRepo.deleteMany({ where: { candidateId: candidate.id } }),
      ...reposData.map((repo: any) =>
        prisma.githubRepo.create({
          data: {
            candidateId: candidate.id,
            repoId: repo.id,
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description,
            url: repo.html_url,
            isPrivate: repo.private,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language,
            topics: repo.topics ?? [],
            pushedAt: repo.pushed_at ? new Date(repo.pushed_at) : null,
          },
        })
      ),
    ]);

    await prisma.candidateProfile.update({
      where: { id: candidate.id },
      data: {
        githubStats: stats,
        githubSyncedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, stats, reposCount: reposData.length });
  } catch (error) {
    console.error("GITHUB SYNC ERROR:", error);
    return NextResponse.json({ error: "Erreur sync GitHub" }, { status: 500 });
  }
}
