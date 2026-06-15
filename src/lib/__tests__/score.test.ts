import { describe, it, expect } from "vitest";
import { calculateCyberScore } from "@/lib/score";

describe("calculateCyberScore", () => {
  const baseInput = {
    certifications: [],
    labs: [],
    skills: [],
    githubUsername: null,
    githubStats: null,
  };

  it("returns 0 for empty profile", () => {
    expect(calculateCyberScore(baseInput)).toBe(0);
  });

  it("awards points for verified TOP certifications (OSCP, CISSP, etc.)", () => {
    const result = calculateCyberScore({
      ...baseInput,
      certifications: [
        { name: "OSCP", status: "VERIFIED", issuer: "Offensive Security" },
        { name: "CISSP", status: "VERIFIED", issuer: "ISC2" },
      ],
    });
    expect(result).toBe(30);
  });

  it("awards points for verified MID certifications (CEH, SECURITY+, etc.)", () => {
    const result = calculateCyberScore({
      ...baseInput,
      certifications: [{ name: "CEH", status: "VERIFIED", issuer: "EC-Council" }],
    });
    expect(result).toBe(10);
  });

  it("awards points for other verified certifications", () => {
    const result = calculateCyberScore({
      ...baseInput,
      certifications: [{ name: "Some Other Cert", status: "VERIFIED", issuer: "Unknown" }],
    });
    expect(result).toBe(5);
  });

  it("ignores unverified certifications", () => {
    const result = calculateCyberScore({
      ...baseInput,
      certifications: [
        { name: "OSCP", status: "PENDING", issuer: "Offensive Security" },
        { name: "CISSP", status: "VERIFIED", issuer: "ISC2" },
      ],
    });
    expect(result).toBe(15);
  });

  it("caps certification score at 40", () => {
    const certs = Array.from({ length: 10 }, (_, i) => ({
      name: `CERT-${i}`,
      status: "VERIFIED" as const,
      issuer: "Test",
    }));
    const result = calculateCyberScore({ ...baseInput, certifications: certs });
    expect(result).toBe(40);
  });

  it("awards 3 points per lab, capped at 25", () => {
    const result = calculateCyberScore({
      ...baseInput,
      labs: Array.from({ length: 10 }, (_, i) => ({
        id: `lab-${i}`,
        labName: `Lab ${i}`,
        platform: "HTB",
        difficulty: "EASY",
      })),
    });
    expect(result).toBe(25);
  });

  it("awards 2 points per skill, capped at 15", () => {
    const result = calculateCyberScore({
      ...baseInput,
      skills: Array.from({ length: 10 }, (_, i) => ({
        id: `skill-${i}`,
        level: "EXPERT",
      })),
    });
    expect(result).toBe(15);
  });

  it("awards basic GitHub points for having a username", () => {
    const result = calculateCyberScore({
      ...baseInput,
      githubUsername: "testuser",
    });
    expect(result).toBe(5);
  });

  it("awards extra GitHub points for repos > 5", () => {
    const result = calculateCyberScore({
      ...baseInput,
      githubUsername: "testuser",
      githubStats: { public_repos: 10, followers: 0 },
    });
    expect(result).toBe(10);
  });

  it("awards extra GitHub points for repos > 15", () => {
    const result = calculateCyberScore({
      ...baseInput,
      githubUsername: "testuser",
      githubStats: { public_repos: 20, followers: 0 },
    });
    expect(result).toBe(15);
  });

  it("awards extra GitHub points for followers > 10", () => {
    const result = calculateCyberScore({
      ...baseInput,
      githubUsername: "testuser",
      githubStats: { public_repos: 3, followers: 15 },
    });
    expect(result).toBe(10);
  });

  it("combines all categories correctly", () => {
    const result = calculateCyberScore({
      certifications: [
        { name: "OSCP", status: "VERIFIED", issuer: "OS" },
        { name: "CEH", status: "VERIFIED", issuer: "EC" },
      ],
      labs: Array.from({ length: 5 }, (_, i) => ({
        id: `lab-${i}`,
        labName: `Lab ${i}`,
      })),
      skills: Array.from({ length: 3 }, (_, i) => ({
        id: `skill-${i}`,
        level: "EXPERT",
      })),
      githubUsername: "testuser",
      githubStats: { public_repos: 20, followers: 15 },
    });
    expect(result).toBe(66);
  });

  it("never exceeds 100", () => {
    const result = calculateCyberScore({
      certifications: Array.from({ length: 20 }, (_, i) => ({
        name: i < 5 ? "OSCP" : `CERT-${i}`,
        status: "VERIFIED" as const,
        issuer: "Test",
      })),
      labs: Array.from({ length: 50 }, (_, i) => ({
        id: `lab-${i}`,
      })),
      skills: Array.from({ length: 50 }, (_, i) => ({
        id: `skill-${i}`,
        level: "EXPERT",
      })),
      githubUsername: "testuser",
      githubStats: { public_repos: 100, followers: 100 },
    });
    expect(result).toBe(100);
  });
});
