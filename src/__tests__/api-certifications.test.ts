import { describe, it, expect, vi, beforeEach } from "vitest";

const mockAuth = vi.fn();
vi.mock("@clerk/nextjs/server", () => ({
  auth: () => mockAuth(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: vi.fn() },
    certification: { create: vi.fn(), findMany: vi.fn() },
    labCompletion: { findMany: vi.fn() },
    candidateSkill: { findMany: vi.fn() },
    candidateProfile: { findUnique: vi.fn(), update: vi.fn() },
    scoreHistory: { create: vi.fn() },
  },
}));

import { prisma } from "@/lib/prisma";

async function callPOST(body: unknown) {
  const { POST } = await import("@/app/api/certifications/route");
  return POST(new Request("http://localhost/api/certifications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }));
}

describe("POST /api/certifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockResolvedValue({ userId: "user-test-1" });
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue({ userId: null });
    const res = await callPOST({ name: "OSCP", issuer: "Offensive Security", issuedAt: "2024-01-01" });
    expect(res.status).toBe(401);
  });

  it("returns 404 when candidate profile not found", async () => {
    (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const res = await callPOST({ name: "OSCP", issuer: "Offensive Security", issuedAt: "2024-01-01" });
    expect(res.status).toBe(404);
  });

  it("creates certification and recalculates score", async () => {
    (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      clerkId: "user-test-1",
      candidateProfile: {
        id: "cand-1",
        cyberScore: 0,
        githubUsername: null,
        githubStats: null,
        certifications: [],
        labs: [],
        skills: [],
      },
    });
    (prisma.certification.create as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "cert-1",
      name: "OSCP",
      status: "PENDING",
    });
    (prisma.certification.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (prisma.labCompletion.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (prisma.candidateSkill.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (prisma.candidateProfile.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "cand-1",
      cyberScore: 0,
      githubUsername: null,
      githubStats: null,
    });
    (prisma.candidateProfile.update as ReturnType<typeof vi.fn>).mockResolvedValue({});
    (prisma.scoreHistory.create as ReturnType<typeof vi.fn>).mockResolvedValue({});

    const res = await callPOST({ name: "OSCP", issuer: "Offensive Security", issuedAt: "2024-01-01" });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.cert.name).toBe("OSCP");
  });
});
