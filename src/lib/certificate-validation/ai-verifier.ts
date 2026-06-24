import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export type AiVerificationResult = {
  status: "VERIFIED" | "REJECTED" | "PENDING";
  confidence: number;
  notes: string;
};

function extractJson(text: string): Record<string, unknown> {
  const cleaned = text.replace(/```json|```/gi, "").trim();
  const braceStart = cleaned.indexOf("{");
  const braceEnd = cleaned.lastIndexOf("}");
  if (braceStart !== -1 && braceEnd !== -1) {
    return JSON.parse(cleaned.slice(braceStart, braceEnd + 1));
  }
  throw new Error("No JSON object found in response");
}

function buildPrompt(certName: string, issuer: string, url: string): string {
  return `Analyse cette certification cybersecurite.

CERTIFICATION: ${certName}
ORGANISME: ${issuer}
LIEN: ${url}

Le lien pointe-t-il vers une plateforme officielle de verification de certifications (Credly, Acclaim, Coursera, GitHub, etc.) ?
Le nom de la certification correspond-il a ce qui est declare ?
Y a-t-il des signes de fraude ?

Reponds UNIQUEMENT en JSON valide :
{"status": "VERIFIED"|"REJECTED"|"PENDING", "confidence": 0.0-1.0, "notes": "explication"}`
}

export async function verifyCertificationWithAI(
  certName: string,
  issuer: string,
  url: string
): Promise<AiVerificationResult> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        status: "PENDING",
        confidence: 0,
        notes: "Analyse AI non disponible",
      };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
    });

    const prompt = buildPrompt(certName, issuer, url);
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = extractJson(text);

    const validStatuses = ["VERIFIED", "REJECTED", "PENDING"] as const;
    return {
      status: validStatuses.includes(parsed.status as never)
        ? (parsed.status as "VERIFIED" | "REJECTED" | "PENDING")
        : "PENDING",
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.5,
      notes: typeof parsed.notes === "string" ? parsed.notes : "Analyse effectuée par Gemini AI",
    };
  } catch (error) {
    console.error("AI VERIFIER ERROR:", error instanceof Error ? error.message : String(error));
    return {
      status: "PENDING",
      confidence: 0,
      notes: "Erreur lors de l'analyse AI",
    };
  }
}
