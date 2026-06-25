import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const rl = await checkRateLimit(rateLimitKey(req, `:github:${userId}`), 5);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Trop de requêtes, réessaye dans une minute" }, { status: 429 });
  }

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
      const status = !userRes.ok ? userRes.status : reposRes.status;
      const errBody = await (!userRes.ok ? userRes : reposRes).text().catch(() => "unknown");
      return NextResponse.json({
        error: `GitHub API error (${status})`,
        detail: errBody.includes("rate") ? "Rate limit atteint — attends ou configure un token" : errBody,
      }, { status: 404 });
    }

    const userData: { public_repos: number; followers: number; following: number } =
      await userRes.json();
    const reposData: {
      id: number;
      name: string;
      full_name: string;
      description: string | null;
      html_url: string;
      private: boolean;
      stargazers_count: number;
      forks_count: number;
      language: string | null;
      topics: string[];
      pushed_at: string | null;
    }[] = await reposRes.json();

    const languages: string[] = [
      ...new Set(reposData.map((r) => r.language).filter((l: string | null) => l != null)),
    ];

    const stats = {
      public_repos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      total_stars: reposData.reduce((acc: number, r) => acc + r.stargazers_count, 0),
      total_forks: reposData.reduce((acc: number, r) => acc + r.forks_count, 0),
      languages,
    };

await prisma.$transaction(async (tx) => {
    // Supprimer les anciens repos
    await tx.githubRepo.deleteMany({ where: { candidateId: candidate.id } });

    // Insérer les nouveaux repos
    await tx.githubRepo.createMany({
      data: reposData.map((repo) => ({
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
      })),
    });

    // Mettre à jour les stats du profil
    await tx.candidateProfile.update({
      where: { id: candidate.id },
      data: {
        githubStats: stats,
        githubSyncedAt: new Date(),
      },
    });
  });

    return NextResponse.json({ success: true, stats, reposCount: reposData.length });
  } catch (error) {
    console.error("GITHUB SYNC ERROR:", error);
    return NextResponse.json({ error: "Erreur sync GitHub" }, { status: 500 });
  }
}
