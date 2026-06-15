import { describe, it, expect } from "vitest";
import { computeMatchScore } from "@/lib/matching";

const baseCandidate = {
  cyberScore: 75,
  country: "FR",
  jobTypes: ["FULL_TIME"],
  jobModes: ["REMOTE"],
  skills: [
    { skill: { name: "Python" } },
    { skill: { name: "Network Security" } },
    { skill: { name: "Kubernetes" } },
  ],
};

const baseJob = {
  id: "job-1",
  title: "Pentester",
  description: "Looking for a pentester",
  type: "FULL_TIME",
  mode: "REMOTE",
  country: "FR",
  minScore: 50,
  salaryMin: 50000,
  salaryMax: 80000,
  isUrgent: false,
  tags: ["security", "pentest"],
  requiredSkills: [{ skill: { name: "Python" } }, { skill: { name: "Network Security" } }],
};

describe("computeMatchScore", () => {
  it("returns 100 for a perfect match", () => {
    const score = computeMatchScore(baseCandidate, baseJob);
    expect(score).toBe(100);
  });

  it("returns full 30 for score requirement when candidate exceeds minScore", () => {
    const score = computeMatchScore(
      { ...baseCandidate, cyberScore: 100 },
      { ...baseJob, minScore: 50 }
    );
    expect(score).toBe(100);
  });

  it("reduces score when candidate is below minScore", () => {
    const score = computeMatchScore(
      { ...baseCandidate, cyberScore: 25 },
      { ...baseJob, minScore: 50 }
    );
    // ratio=25/50=0.5 -> 15pts + skills(40) + mode(15) + contract(10) + country(5)
    expect(score).toBe(85);
  });

  it("gives full 30 when no minScore is set", () => {
    const score = computeMatchScore(baseCandidate, { ...baseJob, minScore: null });
    expect(score).toBe(100);
  });

  it("gives full 40 for skills when all required skills match", () => {
    const score = computeMatchScore(baseCandidate, baseJob);
    expect(score).toBe(100);
  });

  it("gives partial skill score for partial matches", () => {
    const score = computeMatchScore(
      { ...baseCandidate, skills: [{ skill: { name: "Python" } }] },
      baseJob
    );
    // 1/2 skill match = 20pts + score(30) + mode(15) + contract(10) + country(5)
    expect(score).toBe(80);
  });

  it("gives zero skill score for no matches", () => {
    const score = computeMatchScore(
      { ...baseCandidate, skills: [{ skill: { name: "Cooking" } }] },
      baseJob
    );
    // 0/2 skill match = 0pts + score(30) + mode(15) + contract(10) + country(5)
    expect(score).toBe(60);
  });

  it("uses tag matching when no required skills are defined", () => {
    const score = computeMatchScore(baseCandidate, {
      ...baseJob,
      requiredSkills: [],
      tags: ["Python", "security"],
    });
    // 2 tag matches * 8 = 16pts + score(30) + mode(15) + contract(10) + country(5)
    expect(score).toBe(76);
  });

  it("awards 15 for mode match", () => {
    const score = computeMatchScore(baseCandidate, { ...baseJob, mode: "REMOTE" });
    expect(score).toBe(100);
  });

  it("gives 10 for REMOTE mode even if candidate has no modes", () => {
    const score = computeMatchScore(
      { ...baseCandidate, jobModes: [] },
      { ...baseJob, mode: "REMOTE" }
    );
    expect(score).toBe(95);
  });

  it("gives 0 for non-matching mode when not REMOTE", () => {
    const score = computeMatchScore(
      { ...baseCandidate, jobModes: ["ONSITE"] },
      { ...baseJob, mode: "HYBRID" }
    );
    expect(score).toBe(85);
  });

  it("awards 10 for contract type match", () => {
    const score = computeMatchScore(baseCandidate, baseJob);
    expect(score).toBe(100);
  });

  it("gives 0 for contract type mismatch", () => {
    const score = computeMatchScore({ ...baseCandidate, jobTypes: ["CONTRACT"] }, baseJob);
    expect(score).toBe(90);
  });

  it("awards 5 for country match", () => {
    const score = computeMatchScore(baseCandidate, baseJob);
    expect(score).toBe(100);
  });

  it("gives 0 for country mismatch", () => {
    const score = computeMatchScore({ ...baseCandidate, country: "SN" }, baseJob);
    expect(score).toBe(95);
  });

  it("never exceeds 100 even with edge cases", () => {
    const score = computeMatchScore(
      {
        ...baseCandidate,
        cyberScore: 200,
        jobTypes: ["FULL_TIME"],
        jobModes: ["REMOTE"],
        country: "FR",
        skills: [
          { skill: { name: "Python" } },
          { skill: { name: "Network Security" } },
          { skill: { name: "Kubernetes" } },
        ],
      },
      baseJob
    );
    expect(score).toBeLessThanOrEqual(100);
  });
});
