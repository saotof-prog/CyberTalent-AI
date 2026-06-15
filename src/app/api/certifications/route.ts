import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { calculateCyberScore } from "@/lib/score";
import { detectCertificatePlatform } from "@/lib/certificate-validation/platform-detector";
import { handleApiError, unauthorized, notFound, success } from "@/lib/api-error";

function isShortener(url: string | null): boolean {
  if (!url) return false;
  const shorteners = [/bit\.ly/i, /tinyurl\.com/i, /short\.link/i, /cutt\.ly/i, /rb\.gy/i];
  return shorteners.some(p => p.test(url));
}

function isValidUrl(url: string | null): boolean {
  if (!url) return false;
  try { new URL(url); return true; } catch { return false; }
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return unauthorized();

  const body = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        candidateProfile: {
          include: { certifications: true, labs: true, skills: true },
        },
      },
    });

    if (!user?.candidateProfile) return notFound("Profil introuvable");

    const url = body.credentialUrl ?? null;
    const hasValidUrl = url && isValidUrl(url) && !isShortener(url);

    let platform: string | null = null;
    let platformData: Record<string, unknown> | null = null;
    if (hasValidUrl) {
      const detection = detectCertificatePlatform(url);
      platform = detection.platform;
      platformData = detection.platformSpecificData as Record<string, unknown> | null;
    }

    // Créer la certification — auto-VERIFIED si URL valide
    const cert = await prisma.certification.create({
      data: {
        candidateId: user.candidateProfile.id,
        name: body.name,
        fullName: body.fullName ?? "",
        issuer: body.issuer,
        issuedAt: new Date(body.issuedAt),
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        hasExpiry: !!body.expiresAt,
        credentialUrl: url,
        fileUrl: body.fileUrl ?? null,
        status: hasValidUrl ? "VERIFIED" : "PENDING",
        platform,
        platformSpecificData: platformData as any,
        aiVerifiedAt: hasValidUrl ? new Date() : null,
        aiConfidence: hasValidUrl ? 1.0 : null,
        aiNotes: hasValidUrl ? `Auto-validé — lien ${platform || "direct"} détecté` : null,
        scoreImpact: hasValidUrl ? 10 : 0,
      },
    });

    // Recalculer le score
    const allCerts = [...user.candidateProfile.certifications, cert];
    const newScore = calculateCyberScore({
      certifications: allCerts,
      labs: user.candidateProfile.labs,
      skills: user.candidateProfile.skills,
      githubUsername: user.candidateProfile.githubUsername,
      githubStats: user.candidateProfile.githubStats,
    });

    await prisma.candidateProfile.update({
      where: { id: user.candidateProfile.id },
      data: { cyberScore: newScore, scoreUpdatedAt: new Date() },
    });

    return success({ success: true, cert, newScore, autoVerified: hasValidUrl });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return unauthorized();

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        candidateProfile: {
          include: { certifications: true },
        },
      },
    });

    return success(user?.candidateProfile?.certifications ?? []);
  } catch (error) {
    return handleApiError(error);
  }
}