import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { detectCertificatePlatform } from "@/lib/certificate-validation/platform-detector";
import { verifyCertificationWithAI } from "@/lib/certificate-validation/ai-verifier";
import { handleApiError, unauthorized, notFound, success, badRequest } from "@/lib/api-error";
import { certificationSchema } from "@/lib/validation/certification";
import { sanitizeUrl } from "@/lib/url";
import { sanitizeText } from "@/lib/sanitize";
import { recalculateAndTrack } from "@/lib/score-tracker";
import { NextResponse } from "next/server";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return unauthorized();

  const rl = await checkRateLimit(rateLimitKey(req, `:certs:${userId}`), 10);
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

    let aiResult = null;
    if (hasValidUrl && url) {
      aiResult = await verifyCertificationWithAI(validBody.name, validBody.issuer, url);
    }

    const sanitizedName = sanitizeText(validBody.name);
    const sanitizedFullName = sanitizeText(validBody.fullName ?? "");
    const sanitizedIssuer = sanitizeText(validBody.issuer);

    const cert = await prisma.certification.create({
      data: {
        candidateId: user.candidateProfile.id,
        name: sanitizedName,
        fullName: sanitizedFullName,
        issuer: sanitizedIssuer,
        issuedAt: new Date(validBody.issuedAt),
        expiresAt: validBody.expiresAt ? new Date(validBody.expiresAt) : null,
        hasExpiry: !!validBody.expiresAt,
        credentialUrl: url,
        status: aiResult?.status ?? (hasValidUrl ? "VERIFIED" : "PENDING"),
        platform,
        platformSpecificData: (platformData as unknown as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        aiVerifiedAt: aiResult !== null || hasValidUrl ? new Date() : null,
        aiConfidence: aiResult?.confidence ?? (hasValidUrl ? 1.0 : null),
        aiNotes: aiResult?.notes ?? (hasValidUrl ? `Auto-validé — lien ${platform || "direct"} détecté` : null),
        scoreImpact: aiResult?.status === "VERIFIED" ? 10 : 0,
      },
    });

    const newScore = await recalculateAndTrack(
      user.candidateProfile.id,
      `CERT_ADDED: ${cert.name}`,
      user.candidateProfile.cyberScore
    );

    return success({ success: true, cert, newScore, autoVerified: hasValidUrl, aiResult });
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
