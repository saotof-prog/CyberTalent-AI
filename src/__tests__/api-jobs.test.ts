import { describe, it, expect, vi, beforeEach } from "vitest";

const mockAuth = vi.fn();
vi.mock("@clerk/nextjs/server", () => ({
  auth: () => mockAuth(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    recruiterProfile: { findFirst: vi.fn() },
    job: { create: vi.fn() },
    rateLimit: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";

import { NextRequest } from "next/server";

async function callPOST(body: unknown) {
  const { POST } = await import("@/app/api/jobs/route");
  return POST(new NextRequest("http://localhost/api/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }));
}

describe("POST /api/jobs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockResolvedValue({ userId: "user-recruiter-1" });
    (prisma.rateLimit.findUnique as any).mockResolvedValue(null);
    (prisma.rateLimit.upsert as any).mockResolvedValue({ count: 1 });
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue({ userId: null });
    const res = await callPOST({ title: "Pentester" });
    expect(res.status).toBe(401);
  });

  it("returns 400 when title is missing", async () => {
    (prisma.recruiterProfile.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({ id: "rec-1" });
    const res = await callPOST({ description: "Some description" });
    expect(res.status).toBe(400);
  });

  it("returns 404 when recruiter profile not found", async () => {
    (prisma.recruiterProfile.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const res = await callPOST({ title: "Pentester" });
    expect(res.status).toBe(404);
  });

  it("creates job successfully", async () => {
    (prisma.recruiterProfile.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({ id: "rec-1" });
    (prisma.job.create as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "job-1",
      title: "Pentester",
      slug: "pentester-12345",
    });

    const res = await callPOST({
      title: "Pentester",
      description: "We need a pentester",
      type: "FULL_TIME",
      mode: "REMOTE",
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.title).toBe("Pentester");
    expect(body.slug).toContain("pentester");
  });
});
