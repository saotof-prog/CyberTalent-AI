import { GoogleGenerativeAI } from "@google/generative-ai";

type ScoreInput = {
  certifications: { name: string; status: string; issuer?: string }[];
  labs: { id: string; labName?: string; platform?: string; difficulty?: string }[];
  skills: { id: string; level?: string }[];
  githubUsername: string | null;
  githubStats: any;
};

const TOP_CERTS = ["OSCP", "CISSP", "CISM", "GREM", "GXPN", "GWAPT"];
const MID_CERTS = ["CEH", "SECURITY+", "CYSA+", "EJPT", "CCNA"];

export function calculateCyberScore(data: ScoreInput): number {
  let score = 0;

  let certScore = 0;
  for (const cert of data.certifications) {
    if (cert.status !== "VERIFIED") continue;
    const name = cert.name.toUpperCase();
    if (TOP_CERTS.some((c) => name.includes(c))) certScore += 15;
    else if (MID_CERTS.some((c) => name.includes(c))) certScore += 10;
    else certScore += 5;
  }
  score += Math.min(certScore, 40);

  score += Math.min(data.labs.length * 3, 25);
  score += Math.min(data.skills.length * 2, 15);

  if (data.githubUsername) {
    score += 5;
    if (data.githubStats) {
      const stats = data.githubStats as any;
      if (stats.public_repos > 5) score += 5;
      if (stats.public_repos > 15) score += 5;
      if (stats.followers > 10) score += 5;
    }
  }

  return Math.min(score, 100);
}

export async function analyzeProfileWithAI(profile: {
  firstName: string;
  lastName: string;
  headline?: string | null;
  bio?: string | null;
  githubUsername?: string | null;
  certifications: { name: string; status: string; issuer?: string }[];
  labs: { labName?: string; platform?: string; difficulty?: string }[];
  skills: { level?: string }[];
}) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Tu es un expert en cybersécurité. Analyse ce profil.

PROFIL:
- Nom: ${profile.firstName} ${profile.lastName}
- Titre: ${profile.headline ?? "Non renseigné"}
- Bio: ${profile.bio ?? "Non renseignée"}
- GitHub: ${profile.githubUsername ?? "Non renseigné"}

CERTIFICATIONS (${profile.certifications.length}):
${profile.certifications.map(c => `- ${c.name} (${c.issuer ?? "?"}) — ${c.status}`).join("\n") || "Aucune"}

LABS (${profile.labs.length}):
${profile.labs.map(l => `- ${l.labName ?? "?"} sur ${l.platform ?? "?"} — ${l.difficulty ?? "?"}`).join("\n") || "Aucun"}

SKILLS (${profile.skills.length}):
${profile.skills.map(s => `- Niveau: ${s.level ?? "?"}`).join("\n") || "Aucun"}

Réponds UNIQUEMENT en JSON valide sans markdown ni backticks:
{
  "summary": "<résumé en 2-3 phrases>",
  "strengths": ["<point fort 1>", "<point fort 2>", "<point fort 3>"],
  "improvements": ["<amélioration 1>", "<amélioration 2>"],
  "fakeSkillsDetected": false,
  "interviewQuestions": ["<question 1>", "<question 2>", "<question 3>"]
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}