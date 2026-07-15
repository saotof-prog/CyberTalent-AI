import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockAuth = vi.fn();
vi.mock('@clerk/nextjs/server', () => ({
  auth: () => mockAuth(),
}));

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ allowed: true, remaining: 30 }),
  rateLimitKey: vi.fn().mockReturnValue('test-key'),
}));

vi.mock('@/lib/security-log', () => ({
  logSecurityEvent: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    candidateProfile: {
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    recruiterProfile: {
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    rateLimit: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
      update: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}));

import { prisma } from '@/lib/prisma';

async function callPATCH(body: unknown) {
  const { PATCH } = await import('@/app/api/admin/users/route');
  return PATCH(new Request('http://localhost/api/admin/users', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }));
}

describe('PATCH /api/admin/users', () => {
  const adminId = 'admin-1';
  const targetId = 'user-2';

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockResolvedValue({ userId: adminId });
  });

  function setupAdminAndUser(role: string) {
    (prisma.user.findUnique as any).mockImplementation((args: any) => {
      if (args.where.clerkId === adminId) return { role: 'ADMIN' };
      if (args.where.id === targetId) return { role, isBanned: false };
      return null;
    });
  }

  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null });
    const res = await callPATCH({ userId: targetId, isBanned: false });
    expect(res.status).toBe(401);
  });

  it('returns 403 when user is not admin', async () => {
    (prisma.user.findUnique as any).mockImplementation((args: any) => {
      if (args.where.clerkId === adminId) return { role: 'CANDIDATE' };
      return null;
    });
    const res = await callPATCH({ userId: targetId, isBanned: false });
    expect(res.status).toBe(403);
  });

  it('bannit un utilisateur', async () => {
    setupAdminAndUser('CANDIDATE');
    (prisma.candidateProfile.findUnique as any).mockResolvedValue({ id: 'cand-1' });

    const res = await callPATCH({ userId: targetId, isBanned: true });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  it('crée un profil recruteur lors du changement de rôle', async () => {
    setupAdminAndUser('RECRUITER');
    (prisma.recruiterProfile.findUnique as any).mockResolvedValue(null);
    (prisma.candidateProfile.findUnique as any).mockResolvedValue({ id: 'cand-1' });

    const res = await callPATCH({ userId: targetId, role: 'RECRUITER' });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.createdProfile).toBe('recruiter');
  });

  it('crée un profil candidat lors du changement de rôle', async () => {
    setupAdminAndUser('CANDIDATE');
    (prisma.candidateProfile.findUnique as any).mockResolvedValue(null);
    (prisma.recruiterProfile.findUnique as any).mockResolvedValue({ id: 'rec-1' });

    const res = await callPATCH({ userId: targetId, role: 'CANDIDATE' });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.createdProfile).toBe('candidate');
  });
});
