type Job = {
  id: string;
  title: string;
  description: string;
  type: string;
  mode: string;
  country: string | null;
  minScore: number | null;
  salaryMin: number | null;
  salaryMax: number | null;
  isUrgent: boolean;
  tags: string[];
  requiredSkills: { skill: { name: string } }[];
};

type Candidate = {
  cyberScore: number;
  country: string | null;
  jobTypes: string[];
  jobModes: string[];
  skills: { skill: { name: string } }[];
};

export function computeMatchScore(candidate: Candidate, job: Job): number {
  let score = 0;

  // 1. CyberScore vs minScore requis — 30 pts
  if (job.minScore) {
    const ratio = Math.min(candidate.cyberScore / job.minScore, 1);
    score += ratio * 30;
  } else {
    score += 30; // pas de score requis = tout le monde passe
  }

  // 2. Skills matchés — 40 pts
  if (job.requiredSkills.length > 0) {
    const candidateSkillNames = candidate.skills.map((s) =>
      s.skill.name.toLowerCase()
    );
    const matched = job.requiredSkills.filter((js) =>
      candidateSkillNames.includes(js.skill.name.toLowerCase())
    ).length;
    score += (matched / job.requiredSkills.length) * 40;
  } else {
    // Matching par tags si pas de skills définis
    const candidateSkillNames = candidate.skills.map((s) =>
      s.skill.name.toLowerCase()
    );
    const tagMatches = job.tags.filter((tag) =>
      candidateSkillNames.some((s) => s.includes(tag.toLowerCase()))
    ).length;
    score += Math.min(tagMatches * 8, 40);
  }

  // 3. Mode de travail — 15 pts
  if (candidate.jobModes.includes(job.mode)) score += 15;
  else if (job.mode === "REMOTE") score += 10; // remote = accessible à tous

  // 4. Type de contrat — 10 pts
  if (candidate.jobTypes.includes(job.type)) score += 10;

  // 5. Pays — 5 pts
  if (job.country && candidate.country === job.country) score += 5;

  return Math.round(Math.min(score, 100));
}