import { describe, it, expect, vi, beforeEach } from "vitest";
import { recalculateAndTrack } from "@/lib/score-tracker";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    certification: { findMany: vi.fn() },
    labCompletion: { findMany: vi.fn() },
    candidateSkill: { findMany: vi.fn() },
    candidateProfile: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    scoreHistory: { create: vi.fn() },
  },
}));

import { prisma } from "@/lib/prisma";

describe("recalculateAndTrack", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns undefined if candidate not found", async () => {
    (prisma.candidateProfile.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const result = await recalculateAndTrack("cand-1", "TEST");
    expect(result).toBeUndefined();
  });

  it("recalculates score and creates history entry", async () => {
    (prisma.certification.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (prisma.labCompletion.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (prisma.candidateSkill.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (prisma.candidateProfile.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "cand-1",
      cyberScore: 50,
      githubUsername: null,
      githubStats: null,
    });
    (prisma.candidateProfile.update as ReturnType<typeof vi.fn>).mockResolvedValue({});
    (prisma.scoreHistory.create as ReturnType<typeof vi.fn>).mockResolvedValue({});

    const result = await recalculateAndTrack("cand-1", "TEST");

    expect(result).toBe(0);
    expect(prisma.scoreHistory.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        candidateId: "cand-1",
        scoreBefore: 50,
        scoreAfter: 0,
        delta: -50,
        reason: "TEST",
      }),
    });
  });
});
