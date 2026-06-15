import { describe, it, expect } from "vitest";
import { generateLocalAnalysis } from "@/lib/score";

describe("generateLocalAnalysis", () => {
  it("returns strengths for verified certifications", () => {
    const result = generateLocalAnalysis({
      firstName: "Alice",
      lastName: "Cyber",
      certifications: [
        { name: "OSCP", status: "VERIFIED", issuer: "Offensive Security" },
      ],
      labs: [],
      skills: [],
    });

    expect(result.summary).toBeTruthy();
    expect(result.strengths.some((s: string) => s.includes("OSCP"))).toBe(true);
    expect(result.strengths.some((s: string) => s.includes("certification"))).toBe(true);
  });

  it("suggests improvements for empty profile", () => {
    const result = generateLocalAnalysis({
      firstName: "Bob",
      lastName: "Beginner",
      certifications: [],
      labs: [],
      skills: [],
    });

    expect(result.improvements.some((i: string) => i.toLowerCase().includes("certification"))).toBe(true);
    expect(result.improvements.some((i: string) => i.toLowerCase().includes("lab"))).toBe(true);
    expect(result.improvements.some((i: string) => i.toLowerCase().includes("github"))).toBe(true);
  });

  it("mentions lab platforms in strengths", () => {
    const result = generateLocalAnalysis({
      firstName: "Test",
      lastName: "User",
      certifications: [],
      labs: [
        { labName: "Forest", platform: "HACKTHEBOX", difficulty: "HARD" },
        { labName: "Jerry", platform: "HACKTHEBOX", difficulty: "MEDIUM" },
      ],
      skills: [],
    });

    expect(result.strengths.some((s: string) => s.includes("HackTheBox"))).toBe(true);
    expect(result.strengths.some((s: string) => s.includes("difficulté élevée"))).toBe(true);
  });

  it("generates interview questions for matching domains", () => {
    const result = generateLocalAnalysis({
      firstName: "Test",
      lastName: "User",
      certifications: [{ name: "CEH", status: "VERIFIED" }],
      labs: [{ labName: "Test", platform: "TRYHACKME", difficulty: "EASY" }],
      skills: [
        { level: "ADVANCED", name: "Web Security" },
        { level: "EXPERT", name: "Penetration Testing" },
      ],
    });

    expect(result.interviewQuestions.length).toBeGreaterThanOrEqual(3);
    expect(result.interviewQuestions[0]).toBeTruthy();
  });

  it("returns default questions when no domains detected", () => {
    const result = generateLocalAnalysis({
      firstName: "Test",
      lastName: "User",
      certifications: [],
      labs: [],
      skills: [{ level: "BEGINNER", name: "Cooking" }],
    });

    expect(result.interviewQuestions.length).toBeGreaterThanOrEqual(3);
  });

  it("always has at least one strength and one improvement", () => {
    const result = generateLocalAnalysis({
      firstName: "A",
      lastName: "B",
      certifications: [],
      labs: [],
      skills: [],
    });

    expect(result.strengths.length).toBeGreaterThan(0);
    expect(result.improvements.length).toBeGreaterThan(0);
  });

  it("suggests diversifying lab platforms", () => {
    const result = generateLocalAnalysis({
      firstName: "Test",
      lastName: "User",
      certifications: [],
      labs: [{ labName: "Test", platform: "HACKTHEBOX", difficulty: "EASY" }],
      skills: [],
    });

    expect(result.improvements.some((i: string) => i.toLowerCase().includes("diversifie"))).toBe(true);
  });

  it("praises hard labs", () => {
    const result = generateLocalAnalysis({
      firstName: "Test",
      lastName: "User",
      certifications: [],
      labs: [
        { labName: "HardLab", platform: "HACKTHEBOX", difficulty: "INSANE" },
        { labName: "EasyLab", platform: "TRYHACKME", difficulty: "EASY" },
      ],
      skills: [],
    });

    expect(result.strengths.some((s: string) => s.includes("excellent niveau"))).toBe(true);
  });
});
