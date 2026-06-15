import { GoogleGenerativeAI } from "@google/generative-ai";

type ScoreInput = {
  certifications: { name: string; status: string; issuer?: string }[];
  labs: { id?: string; labName?: string; platform?: string; difficulty?: string }[];
  skills: { id?: string; level?: string }[];
  githubUsername: string | null;
  githubStats: unknown;
};

type AnalysisProfile = {
  firstName: string;
  lastName: string;
  headline?: string | null;
  bio?: string | null;
  githubUsername?: string | null;
  certifications: { name: string; status: string; issuer?: string }[];
  labs: { labName?: string; platform?: string; difficulty?: string }[];
  skills: { level?: string; name?: string }[];
};

const TOP_CERTS = ["OSCP", "CISSP", "CISM", "GREM", "GXPN", "GWAPT"];
const MID_CERTS = ["CEH", "SECURITY+", "CYSA+", "EJPT", "CCNA"];

const LAB_PLATFORMS: Record<string, string> = {
  HACKTHEBOX: "HackTheBox",
  TRYHACKME: "TryHackMe",
  VULNHUB: "VulnHub",
  PWNEDLABS: "PwnedLabs",
  OFFENSIVESECURITY: "Offensive Security",
  PORTSWIGGER: "PortSwigger",
  CUSTOM: "Autre",
};

const INTERVIEW_QUESTIONS_BY_DOMAIN: Record<string, string[]> = {
  "Network Security": [
    "Explique la différence entre un IDS et un IPS. Dans quel cas déploies-tu l'un plutôt que l'autre ?",
    "Comment sécuriser un réseau d'entreprise avec VLANs et ACLs ? Donne un exemple concret.",
    "Décris le déroulement d'une attaque Man-in-the-Middle sur un réseau local et comment la détecter.",
  ],
  "Web Security": [
    "Explique le principe d'une injection SQL aveugle et comment l'exploiter sans retour visible.",
    "Quelle est la différence entre XSS stocké et XSS réfléchi ? Comment les prévenir côté serveur ?",
    "Comment contourner un WAF (Web Application Firewall) lors d'un test d'intrusion ?",
  ],
  "Penetration Testing": [
    "Décris les étapes d'un pentest web de l'OSINT jusqu'au rapport final.",
    "Comment escalader les privilèges après avoir obtenu un accès initial sur un serveur Linux ?",
    "Quels outils utilises-tu pour du post-exploitation et pourquoi ?",
  ],
  "Cloud Security": [
    "Explique le principe de Shared Responsibility Model chez AWS et les erreurs courantes de configuration.",
    "Comment sécuriser un bucket S3 exposé par erreur ? Quelles sont les bonnes pratiques ?",
    "Décris une attaque de Cloud Credential Harvesting et comment la mitiger.",
  ],
  SOC: [
    "Comment trier un incident de sécurité de niveau critique en moins de 5 minutes ?",
    "Explique la différence entre un true positive, false positive et benign alert dans un SOC.",
    "Quels indicateurs (IOCs) recherches-tu en premier lors d'une investigation de compromission ?",
  ],
  "Reverse Engineering": [
    "Comment identifier une fonction de vérification de licence dans un binaire avec Ghidra ?",
    "Explique la différence entre l'analyse statique et dynamique en rétro-ingénierie.",
    "Comment détecter un packer ou un obfuscateur dans un échantillon malveillant ?",
  ],
  Cryptography: [
    "Explique la différence entre chiffrement symétrique et asymétrique. Quand utilises-tu chaque type ?",
    "Qu'est-ce qu'une attaque par canal auxiliaire et comment s'en protéger ?",
    "Comment fonctionne l'échange de clés Diffie-Hellman et pourquoi est-il vulnérable à une attaque MITM ?",
  ],
};

const DEFAULT_QUESTIONS = [
  "Quelle est la différence entre une vulnérabilité et une menace en cybersécurité ?",
  "Décris un incident de sécurité que tu as géré et comment tu l'as résolu.",
  "Comment restes-tu à jour sur les dernières vulnérabilités et techniques d'attaque ?",
];

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
      const stats = data.githubStats as Record<string, number>;
      if (stats.public_repos > 5) score += 5;
      if (stats.public_repos > 15) score += 5;
      if (stats.followers > 10) score += 5;
    }
  }

  return Math.min(score, 100);
}

function getDomainForSkill(skillName: string): string | null {
  const mapping: Record<string, string[]> = {
    "Network Security": ["network", "cisco", "routing", "firewall", "vpn", "tcp/ip"],
    "Web Security": ["web", "http", "javascript", "xss", "sql", "api", "owasp"],
    "Penetration Testing": ["pentest", "exploit", "metasploit", "burp", "nmap", "osint"],
    "Cloud Security": ["cloud", "aws", "azure", "gcp", "kubernetes", "docker", "k8s"],
    SOC: ["soc", "siem", "splunk", "elk", "kb", "incident", "blue team"],
    "Reverse Engineering": ["reverse", "ghidra", "ida", "malware", "binary", "assembly"],
    Cryptography: ["crypto", "encrypt", "tls", "ssl", "pk", "certificate"],
  };
  const lower = skillName.toLowerCase();
  for (const [domain, keywords] of Object.entries(mapping)) {
    if (keywords.some((k) => lower.includes(k))) return domain;
  }
  return null;
}

export function generateLocalAnalysis(profile: AnalysisProfile) {
  const strengths: string[] = [];
  const improvements: string[] = [];
  const summaryParts: string[] = [];

  const verifiedCerts = profile.certifications.filter((c) => c.status === "VERIFIED");
  const pendingCerts = profile.certifications.filter((c) => c.status === "PENDING");

  const hardLabs = profile.labs.filter((l) => l.difficulty === "HARD" || l.difficulty === "INSANE");
  const labPlatforms = [
    ...new Set(profile.labs.map((l) => l.platform).filter((p): p is string => !!p)),
  ];

  const highLevel = profile.skills.filter((s) => s.level === "EXPERT" || s.level === "ADVANCED");

  if (verifiedCerts.length > 0) {
    const topCerts = verifiedCerts.filter((c) =>
      TOP_CERTS.some((t) => c.name.toUpperCase().includes(t))
    );
    if (topCerts.length > 0) {
      strengths.push(
        `${topCerts.length} certification(s) de haut niveau (${topCerts.map((c) => c.name).join(", ")})`
      );
    }
    strengths.push(
      `${verifiedCerts.length} certification(s) vérifiée(s) — preuve de compétence validée`
    );
  } else {
    improvements.push(
      "Ajoute des certifications reconnues (OSCP, CEH, CISSP) pour crédibiliser ton profil"
    );
  }

  if (pendingCerts.length > 0) {
    improvements.push(
      `${pendingCerts.length} certification(s) en attente de vérification — assure-toi de fournir des liens valides`
    );
  }

  if (profile.labs.length > 0) {
    const plat = labPlatforms.map((p) => LAB_PLATFORMS[p] ?? p).join(", ");
    strengths.push(`${profile.labs.length} lab(s) complété(s) sur ${plat}`);
    if (hardLabs.length > 0) {
      strengths.push(
        `${hardLabs.length} lab(s) de difficulté élevée (Hard/Insane) — excellent niveau pratique`
      );
    }
    if (labPlatforms.length < 2) {
      improvements.push(
        "Diversifie tes plateformes de labs (HackTheBox, TryHackMe, VulnHub, PortSwigger)"
      );
    }
  } else {
    improvements.push("Ajoute des labs et CTF pour démontrer ton niveau pratique");
  }

  if (profile.skills.length > 0) {
    strengths.push(`${profile.skills.length} compétence(s) technique(s) listée(s)`);
    if (highLevel.length > 0) {
      strengths.push(
        `${highLevel.length} compétence(s) de niveau avancé — spécialisation technique solide`
      );
    }
    const skillNames = profile.skills.map((s) => s.name).filter(Boolean) as string[];
    const domains = [
      ...new Set(skillNames.map((n) => getDomainForSkill(n)).filter(Boolean)),
    ] as string[];
    if (domains.length < 2) {
      improvements.push(
        "Élargis tes compétences à d'autres domaines de la cybersécurité (réseau, cloud, web, SOC)"
      );
    }
    if (!profile.skills.some((s) => s.level === "EXPERT")) {
      const hasCore = profile.certifications.length > 0 || profile.labs.length > 0;
      if (hasCore) {
        improvements.push("Monte certaines compétences au niveau EXPERT pour augmenter ton score");
      }
    }
  } else {
    improvements.push(
      "Ajoute des compétences techniques à ton profil pour être visible par les recruteurs"
    );
  }

  if (profile.githubUsername) {
    strengths.push("Profil GitHub connecté — transparence et code réel visible");
  } else {
    improvements.push(
      "Connecte ton GitHub pour mettre en avant tes projets et contributions open-source"
    );
  }

  const totalScore = calculateCyberScore({
    certifications: profile.certifications,
    labs: profile.labs,
    skills: profile.skills,
    githubUsername: profile.githubUsername ?? null,
    githubStats: null,
  });

  if (totalScore >= 70) {
    summaryParts.push(
      "Profil solide avec un bon équilibre entre certifications, pratique et compétences techniques."
    );
  } else if (totalScore >= 40) {
    summaryParts.push(
      "Bon début ! Quelques axes d'amélioration peuvent significativement augmenter ton score."
    );
  } else {
    summaryParts.push(
      "Profil en construction. Ajoute des certifications, labs et compétences pour améliorer ta visibilité."
    );
  }
  if (verifiedCerts.length === 0 && profile.labs.length === 0) {
    summaryParts.push(
      "Les recruteurs cherchent des preuves concrètes — concentre-toi sur l'obtention de certifications et la pratique sur des plateformes reconnues."
    );
  } else if (totalScore < 70) {
    summaryParts.push(
      "Continue à développer tes compétences et à ajouter des preuves vérifiables pour atteindre le niveau Expert."
    );
  }

  if (strengths.length === 0)
    strengths.push(
      "Profil en cours de création — ajoute des éléments pour générer des points forts"
    );
  if (improvements.length === 0)
    improvements.push("Continuer à maintenir et enrichir ton profil régulièrement");

  const skillNames = profile.skills.map((s) => s.name).filter(Boolean) as string[];
  const domains = [
    ...new Set(skillNames.map((n) => getDomainForSkill(n)).filter(Boolean)),
  ] as string[];
  let interviewQuestions: string[] = [];
  for (const domain of domains) {
    const qs = INTERVIEW_QUESTIONS_BY_DOMAIN[domain];
    if (qs) interviewQuestions.push(...qs);
  }
  if (interviewQuestions.length < 3) {
    interviewQuestions.push(...DEFAULT_QUESTIONS);
  }
  if (interviewQuestions.length > 6) interviewQuestions = interviewQuestions.slice(0, 6);

  return {
    summary: summaryParts.join(" "),
    strengths,
    improvements,
    fakeSkillsDetected: false,
    interviewQuestions,
  };
}

export async function analyzeProfileWithAI(profile: AnalysisProfile) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return generateLocalAnalysis(profile);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
Tu es un expert en cybersécurité. Analyse ce profil.

PROFIL:
- Nom: ${profile.firstName} ${profile.lastName}
- Titre: ${profile.headline ?? "Non renseigné"}
- Bio: ${profile.bio ?? "Non renseignée"}
- GitHub: ${profile.githubUsername ?? "Non renseigné"}

CERTIFICATIONS (${profile.certifications.length}):
${profile.certifications.map((c) => `- ${c.name} (${c.issuer ?? "?"}) — ${c.status}`).join("\n") || "Aucune"}

LABS (${profile.labs.length}):
${profile.labs.map((l) => `- ${l.labName ?? "?"} sur ${l.platform ?? "?"} — ${l.difficulty ?? "?"}`).join("\n") || "Aucun"}

SKILLS (${profile.skills.length}):
${profile.skills.map((s) => `- Niveau: ${s.level ?? "?"}`).join("\n") || "Aucun"}

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
  } catch {
    console.warn("Gemini API unavailable, using local analysis fallback");
    return generateLocalAnalysis(profile);
  }
}
