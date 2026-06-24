import { GoogleGenerativeAI } from "@google/generative-ai";

export type AiVerificationResult = {
  status: "VERIFIED" | "REJECTED" | "PENDING";
  confidence: number;
  notes: string;
};

function buildPrompt(certName: string, issuer: string, url: string, pageContent: string): string {
  return `
Tu es un expert en verification de certifications cybersecurite. Analyse cette certification.

CERTIFICATION: ${certName}
ORGANISME: ${issuer}
LIEN: ${url}

CONTENU DE LA PAGE:
${pageContent.slice(0, 3000)}

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
}
`;
}

export async function verifyCertificationWithAI(
  certName: string,
  issuer: string,
  url: string
): Promise<AiVerificationResult> {
  try {
    let pageContent = "";

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) {
        pageContent = await res.text();
      } else {
        pageContent = `HTTP ${res.status} — page inaccessible`;
      }
    } catch {
      pageContent = "Impossible de charger la page (timeout ou erreur réseau)";
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        status: pageContent.includes("HTTP 200") ? "VERIFIED" : "PENDING",
        confidence: pageContent.includes("HTTP 200") ? 0.6 : 0.3,
        notes: "Analyse AI non disponible — vérification basée sur l'accessibilité du lien",
      };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = buildPrompt(certName, issuer, url, pageContent);
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const clean = text.replace(/```json|```|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return {
      status: parsed.status ?? "PENDING",
      confidence: parsed.confidence ?? 0.5,
      notes: parsed.notes ?? "Analyse effectuée par Gemini AI",
    };
  } catch (error) {
    console.error("AI VERIFIER ERROR:", error);
    return {
      status: "PENDING",
      confidence: 0,
      notes: "Erreur lors de l'analyse AI",
    };
  }
}
