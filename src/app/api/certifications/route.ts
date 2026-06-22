import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { detectCertificatePlatform } from "@/lib/certificate-validation/platform-detector";
import { handleApiError, unauthorized, notFound, success, badRequest } from "@/lib/api-error";
import { certificationSchema } from "@/lib/validation/certification";
import { sanitizeUrl } from "@/lib/url";
import { recalculateAndTrack } from "@/lib/score-tracker";
import { NextResponse } from "next/server";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return unauthorized();

  const rl = checkRateLimit(rateLimitKey(req, `:certs:${userId}`), 10);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Trop de requêtes, réessayez dans une minute" }, { status: 429 });
  }

  const rawBody = await req.json();
  const parseResult = certificationSchema.safeParse(rawBody);
  if (!parseResult.success) {
    return badRequest(parseResult.error.message);
  }
  const validBody = parseResult.data;

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

    const url = validBody.credentialUrl ?? null;
    const hasValidUrl = sanitizeUrl(url);

    let platform: string | null = null;
    let platformData: Record<string, unknown> | null = null;
    if (hasValidUrl && url) {
      const detection = detectCertificatePlatform(url);
      platform = detection.platform;
      platformData = detection.platformSpecificData as Record<string, unknown> | null;
    }

    const cert = await prisma.certification.create({
      data: {
        candidateId: user.candidateProfile.id,
        name: validBody.name,
        fullName: validBody.fullName ?? "",
        issuer: validBody.issuer,
        issuedAt: new Date(validBody.issuedAt),
        expiresAt: validBody.expiresAt ? new Date(validBody.expiresAt) : null,
        hasExpiry: !!validBody.expiresAt,
        credentialUrl: url,
        fileUrl: validBody.fileUrl ?? null,
        status: hasValidUrl ? "VERIFIED" : "PENDING",
        platform,
        platformSpecificData: (platformData as unknown as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        aiVerifiedAt: hasValidUrl ? new Date() : null,
        aiConfidence: hasValidUrl ? 1.0 : null,
        aiNotes: hasValidUrl ? `Auto-validé — lien ${platform || "direct"} détecté` : null,
        scoreImpact: hasValidUrl ? 10 : 0,
      },
    });

    const newScore = await recalculateAndTrack(
      user.candidateProfile.id,
      `CERT_ADDED: ${cert.name}`,
      user.candidateProfile.cyberScore
    );

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
