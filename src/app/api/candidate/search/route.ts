import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { rejectIfBanned } from "@/lib/auth-utils";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";

// ── Algorithme de matching maison ──────────────────────────

function computeMatchScore(
  candidate: {
    cyberScore: number;
    isAvailable: boolean;
    headline?: string | null;
    bio?: string | null;
    skills: { skill: { name: string }; level: string }[];
    certifications: { name: string; status: string }[];
  },
  keywords: string[]
): { score: number; reason: string } {
  if (keywords.length === 0) {
    return { score: candidate.cyberScore, reason: "Classé par cyberScore" };
  }

  const kw = keywords.map((k) => k.toLowerCase());

  // 1. Skills match (40%)
  const candidateSkills = candidate.skills.map((s) => s.skill.name.toLowerCase());
  const skillMatches = kw.filter((k) =>
    candidateSkills.some((s) => s.includes(k) || k.includes(s))
  );
  const skillScore = Math.min((skillMatches.length / Math.max(kw.length, 1)) * 100, 100);

  // 2. CyberScore (25%)
  const cyberScore = candidate.cyberScore;

  // 3. Certifications vérifiées (20%)
  const verifiedCerts = candidate.certifications
    .filter((c) => c.status === "VERIFIED")
    .map((c) => c.name.toLowerCase());
  const certMatches = kw.filter((k) => verifiedCerts.some((c) => c.includes(k) || k.includes(c)));
  const certScore = Math.min((certMatches.length / Math.max(kw.length, 1)) * 100, 100);

  // 4. Mots-clés headline/bio (10%)
  const text = `${candidate.headline ?? ""} ${candidate.bio ?? ""}`.toLowerCase();
  const textMatches = kw.filter((k) => text.includes(k));
  const textScore = Math.min((textMatches.length / Math.max(kw.length, 1)) * 100, 100);

  // 5. Disponibilité (5%)
  const availScore = candidate.isAvailable ? 100 : 0;

  // Score final pondéré
  const final = Math.round(
    skillScore * 0.4 + cyberScore * 0.25 + certScore * 0.2 + textScore * 0.1 + availScore * 0.05
  );

  // Reason lisible
  const parts: string[] = [];
  if (skillMatches.length > 0) parts.push(`skills: ${skillMatches.join(", ")}`);
  if (certMatches.length > 0) parts.push(`certs: ${certMatches.join(", ")}`);
  if (textMatches.length > 0) parts.push(`profil: ${textMatches.join(", ")}`);
  if (candidate.isAvailable) parts.push("disponible");

  const reason =
    parts.length > 0 ? `Correspond à — ${parts.join(" · ")}` : "Aucune correspondance directe";

  return { score: final, reason };
}

function extractKeywords(query: string): string[] {
  // Mots à ignorer
  const stopWords = new Set([
    "un",
    "une",
    "des",
    "le",
    "la",
    "les",
    "de",
    "du",
    "avec",
    "pour",
    "qui",
    "que",
    "en",
    "et",
    "ou",
    "sur",
    "dans",
    "par",
    "a",
    "an",
    "the",
    "with",
    "for",
    "and",
    "or",
    "in",
    "on",
  ]);
  return query
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z0-9+#]/g, ""))
    .filter((w) => w.length > 2 && !stopWords.has(w));
}

// ── Route POST ─────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const bannedResp = await rejectIfBanned(userId);
  if (bannedResp) return bannedResp;

  const rl = await checkRateLimit(rateLimitKey(req, `:search:${userId}`), 20);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Trop de requêtes, réessaye dans une minute" }, { status: 429 });
  }

  try {
    const recruiter = await prisma.recruiterProfile.findFirst({
      where: { user: { clerkId: userId } },
    });
    if (!recruiter)
      return NextResponse.json({ error: "Profil recruteur introuvable" }, { status: 404 });

    const body = await req.json();
    const { query, minScore, maxScore, country, skills, certifications, mode, jobType } = body;

    const keywords = query ? extractKeywords(query) : [];

    const candidates = await prisma.candidateProfile.findMany({
      where: {
        isAvailable: true,
        ...(minScore && { cyberScore: { gte: minScore } }),
        ...(maxScore && { cyberScore: { lte: maxScore } }),
        ...(country && { country: { equals: country, mode: "insensitive" } }),
        ...(mode && { jobModes: { has: mode } }),
        ...(jobType && { jobTypes: { has: jobType } }),
        ...(skills?.length > 0 && {
          skills: { some: { skill: { name: { in: skills } } } },
        }),
        ...(certifications?.length > 0 && {
          certifications: {
            some: { name: { in: certifications }, status: "VERIFIED" },
          },
        }),
      },
      include: {
        skills: { include: { skill: true } },
        certifications: { select: { name: true, status: true } },
      },
      take: 100,
      orderBy: { cyberScore: "desc" },
    });

    const ranked = candidates
      .map((c) => {
        const { score, reason } = computeMatchScore(c, keywords);
        return { ...c, aiRelevance: score, aiReason: reason };
      })
      .sort((a, b) => b.aiRelevance - a.aiRelevance);

    await prisma.recruiterSearch.create({
      data: {
        recruiterId: recruiter.id,
        query: query ?? null,
        filters: body,
        resultCount: ranked.length,
      },
    });

    return NextResponse.json({
      candidates: ranked,
      aiRanked: keywords.length > 0,
    });
  } catch (error) {
    console.error("ERREUR RECHERCHE:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
