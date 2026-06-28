import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockAuth = vi.fn();
vi.mock('@clerk/nextjs/server', () => ({
  auth: () => mockAuth(),
}));

const eps = vi.hoisted(() => ({
  mockTransaction: vi.fn(),
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
    },
    recruiterProfile: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    rateLimit: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
      update: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
    $transaction: eps.mockTransaction,
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

  function mockTxForRole(role: string) {
    const tx = {
      user: {
        findUnique: vi.fn().mockResolvedValue({ role }),
        update: vi.fn().mockResolvedValue({}),
      },
      candidateProfile: {
        findUnique: vi.fn().mockResolvedValue(role === 'CANDIDATE' ? null : { id: 'cand-1' }),
        create: vi.fn().mockResolvedValue({ id: 'cand-1' }),
        delete: vi.fn().mockResolvedValue({}),
      },
      recruiterProfile: {
        findUnique: vi.fn().mockResolvedValue(role === 'RECRUITER' ? null : { id: 'rec-1' }),
        create: vi.fn().mockResolvedValue({ id: 'rec-1' }),
        delete: vi.fn().mockResolvedValue({}),
      },
    };
    eps.mockTransaction.mockImplementation(async (cb: (tx: Record<string, unknown>) => any) => cb(tx));
    return tx;
  }

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockResolvedValue({ userId: adminId });
  });

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
    (prisma.user.findUnique as any).mockImplementation((args: any) => {
      if (args.where.clerkId === adminId) return { role: 'ADMIN' };
      return null;
    });
    const tx = mockTxForRole('CANDIDATE');
    tx.candidateProfile.findUnique.mockResolvedValue({ id: 'cand-1' });

    const res = await callPATCH({ userId: targetId, isBanned: true });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  it('crée un profil recruteur lors du changement de rôle', async () => {
    (prisma.user.findUnique as any).mockImplementation((args: any) => {
      if (args.where.clerkId === adminId) return { role: 'ADMIN' };
      return null;
    });
    mockTxForRole('RECRUITER');

    const res = await callPATCH({ userId: targetId, role: 'RECRUITER' });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.createdProfile).toBe('recruiter');
  });

  it('crée un profil candidat lors du changement de rôle', async () => {
    (prisma.user.findUnique as any).mockImplementation((args: any) => {
      if (args.where.clerkId === adminId) return { role: 'ADMIN' };
      return null;
    });
    mockTxForRole('CANDIDATE');

    const res = await callPATCH({ userId: targetId, role: 'CANDIDATE' });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.createdProfile).toBe('candidate');
  });
});
