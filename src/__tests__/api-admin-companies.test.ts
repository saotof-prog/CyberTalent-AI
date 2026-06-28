import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockAuth = vi.fn();
vi.mock('@clerk/nextjs/server', () => ({
  auth: () => mockAuth(),
}));

vi.mock('@/lib/auth-utils', () => ({
  rejectIfBanned: vi.fn().mockResolvedValue(null),
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
    },
    company: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    rateLimit: {
      findUnique: vi.fn().mockResolvedValue(null),
      upsert: vi.fn().mockResolvedValue({ count: 1 }),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}));

import { prisma } from '@/lib/prisma';

async function callPATCH(body: unknown) {
  const { PATCH } = await import('@/app/api/admin/companies/route');
  return PATCH(new Request('http://localhost/api/admin/companies', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }));
}

describe('PATCH /api/admin/companies', () => {
  const adminId = 'admin-1';

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockResolvedValue({ userId: adminId });
  });

  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null });
    const res = await callPATCH({ companyId: 'c1', isVerified: true });
    expect(res.status).toBe(401);
  });

  it('returns 403 when user is not admin', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ role: 'CANDIDATE' });
    const res = await callPATCH({ companyId: 'c1', isVerified: true });
    expect(res.status).toBe(403);
  });

  it('returns 400 when companyId is missing', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ role: 'ADMIN' });
    const res = await callPATCH({ isVerified: true });
    expect(res.status).toBe(400);
  });

  it('returns 400 when isVerified is not boolean', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ role: 'ADMIN' });
    const res = await callPATCH({ companyId: 'c1', isVerified: 'yes' });
    expect(res.status).toBe(400);
  });

  it('verifies a company successfully', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ role: 'ADMIN' });
    (prisma.company.findUnique as any).mockResolvedValue({ id: 'c1', name: 'Test Corp' });
    (prisma.company.update as any).mockResolvedValue({ id: 'c1', isVerified: true });

    const res = await callPATCH({ companyId: 'c1', isVerified: true });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  it('unverifies a company successfully', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ role: 'ADMIN' });
    (prisma.company.findUnique as any).mockResolvedValue({ id: 'c1', name: 'Test Corp' });
    (prisma.company.update as any).mockResolvedValue({ id: 'c1', isVerified: false });

    const res = await callPATCH({ companyId: 'c1', isVerified: false });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  it('returns 404 when company not found', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ role: 'ADMIN' });
    (prisma.company.findUnique as any).mockResolvedValue(null);

    const res = await callPATCH({ companyId: 'c1', isVerified: true });
    expect(res.status).toBe(404);
  });

  it('returns 500 on database error', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ role: 'ADMIN' });
    (prisma.company.findUnique as any).mockRejectedValue(new Error('DB error'));

    const res = await callPATCH({ companyId: 'c1', isVerified: true });
    expect(res.status).toBe(500);
  });
});
