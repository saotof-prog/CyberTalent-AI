export interface PlatformDetectionResult {
  platform: string;
  confidence: number;
  platformSpecificData: Record<string, unknown>;
}

export function detectCertificatePlatform(url: string): PlatformDetectionResult {
  if (!url || typeof url !== "string") {
    return { platform: "unknown", confidence: 0, platformSpecificData: {} };
  }

  try {
    const obj = new URL(url);
    const hostname = obj.hostname.toLowerCase();
    const pathname = obj.pathname.toLowerCase();

    if (hostname.includes("credly.com")) {
      return { platform: "credly", confidence: 0.9, platformSpecificData: { platform: "credly" } };
    }
    if (hostname.includes("coursera.org")) {
      return {
        platform: "coursera",
        confidence: 0.9,
        platformSpecificData: { platform: "coursera" },
      };
    }
    if (hostname.includes("github.com")) {
      return { platform: "github", confidence: 0.9, platformSpecificData: { platform: "github" } };
    }
    if (hostname.endsWith(".edu")) {
      return { platform: "edu", confidence: 0.85, platformSpecificData: { platform: "edu" } };
    }

    const certPatterns = [
      /certificate/i,
      /badge/i,
      /verify/i,
      /credential/i,
      /accomplishment/i,
      /diploma/i,
    ];
    const hasCertPath = certPatterns.some((p) => p.test(pathname));

    return {
      platform: "corporate",
      confidence: hasCertPath ? 0.8 : 0.6,
      platformSpecificData: { domain: hostname, hasCertPath },
    };
  } catch {
    return { platform: "invalid", confidence: 0, platformSpecificData: {} };
  }
}

export function isLikelyCertificateUrl(url: string): {
  isLikely: boolean;
  confidence: number;
  reasons: string[];
} {
  const detection = detectCertificatePlatform(url);
  if (detection.platform === "invalid") {
    return { isLikely: false, confidence: 0, reasons: ["URL invalide"] };
  }
  if (detection.platform !== "unknown" && detection.confidence >= 0.6) {
    return {
      isLikely: true,
      confidence: detection.confidence,
      reasons: [`Plateforme détectée : ${detection.platform}`],
    };
  }
  return { isLikely: true, confidence: 0.5, reasons: ["URL non reconnue mais valide"] };
}
