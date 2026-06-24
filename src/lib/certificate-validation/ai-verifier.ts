import { GoogleGenerativeAI } from "@google/generative-ai";

export type AiVerificationResult = {
  status: "VERIFIED" | "REJECTED" | "PENDING";
  confidence: number;
  notes: string;
};

function stripHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 2500);
}

function extractJson(text: string): Record<string, unknown> {
  const cleaned = text.replace(/```json|```/gi, "").trim();
  const braceStart = cleaned.indexOf("{");
  const braceEnd = cleaned.lastIndexOf("}");
  if (braceStart !== -1 && braceEnd !== -1) {
    return JSON.parse(cleaned.slice(braceStart, braceEnd + 1));
  }
  throw new Error("No JSON object found in response");
}

function buildPrompt(certName: string, issuer: string, url: string, pageContent: string): string {
  return `Tu es un expert en verification de certifications cybersecurite. Analyse cette certification.

CERTIFICATION: ${certName}
ORGANISME: ${issuer}
LIEN: ${url}

CONTENU DE LA PAGE (texte uniquement):
${pageContent.slice(0, 2500)}

Verifie si cette certification est authentique.

Criteres :
- Le lien pointe-t-il vers une plateforme officielle (Credly, Acclaim, Coursera, GitHub, etc.) ?
- Le contenu de la page correspond-il a la certification declaree ?
- Y a-t-il des signes de fraude ou de page inexistante ?

Reponds UNIQUEMENT en JSON valide sans markdown ni backticks :
{
  "status": "VERIFIED" | "REJECTED" | "PENDING",
  "confidence": <nombre entre 0 et 1>,
  "notes": "<explication concise en francais>"
}`;
}

export async function verifyCertificationWithAI(
  certName: string,
  issuer: string,
  url: string
): Promise<AiVerificationResult> {
  try {
    let pageContent = "";
    let pageLoaded = false;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) {
        const raw = await res.text();
        pageContent = stripHtml(raw);
        pageLoaded = pageContent.length > 50;
      } else {
        pageContent = `HTTP ${res.status}`;
      }
    } catch {
      pageContent = "";
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        status: pageLoaded ? "VERIFIED" : "PENDING",
        confidence: pageLoaded ? 0.6 : 0.3,
        notes: pageLoaded
          ? "Analyse AI non disponible — vérification basée sur l'accessibilité du lien"
          : "Analyse AI non disponible — lien inaccessible",
      };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = buildPrompt(certName, issuer, url, pageContent);
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = extractJson(text);

    return {
      status: (["VERIFIED", "REJECTED", "PENDING"] as const).includes(parsed.status as never)
        ? (parsed.status as "VERIFIED" | "REJECTED" | "PENDING")
        : "PENDING",
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.5,
      notes: typeof parsed.notes === "string" ? parsed.notes : "Analyse effectuée par Gemini AI",
    };
  } catch (error) {
    console.error("AI VERIFIER ERROR:", error instanceof Error ? error.message : error);
    return {
      status: "PENDING",
      confidence: 0,
      notes: "Erreur lors de l'analyse AI",
    };
  }
}
