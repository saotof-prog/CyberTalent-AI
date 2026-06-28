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
    job: {
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
  const { PATCH } = await import('@/app/api/admin/jobs/route');
  return PATCH(new Request('http://localhost/api/admin/jobs', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }));
}

describe('PATCH /api/admin/jobs', () => {
  const adminId = 'admin-1';

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockResolvedValue({ userId: adminId });
  });

  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null });
    const res = await callPATCH({ jobId: 'j1', isActive: true });
    expect(res.status).toBe(401);
  });

  it('returns 403 when user is not admin', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ role: 'CANDIDATE' });
    const res = await callPATCH({ jobId: 'j1', isActive: true });
    expect(res.status).toBe(403);
  });

  it('returns 400 when jobId is missing', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ role: 'ADMIN' });
    const res = await callPATCH({ isActive: true });
    expect(res.status).toBe(400);
  });

  it('returns 400 when isActive is not boolean', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ role: 'ADMIN' });
    const res = await callPATCH({ jobId: 'j1', isActive: 'yes' });
    expect(res.status).toBe(400);
  });

  it('activates a job successfully', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ role: 'ADMIN' });
    (prisma.job.findUnique as any).mockResolvedValue({ id: 'j1', title: 'Pentester' });
    (prisma.job.update as any).mockResolvedValue({ id: 'j1', isActive: true });

    const res = await callPATCH({ jobId: 'j1', isActive: true });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  it('deactivates a job successfully', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ role: 'ADMIN' });
    (prisma.job.findUnique as any).mockResolvedValue({ id: 'j1', title: 'Pentester' });
    (prisma.job.update as any).mockResolvedValue({ id: 'j1', isActive: false });

    const res = await callPATCH({ jobId: 'j1', isActive: false });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  it('returns 404 when job not found', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ role: 'ADMIN' });
    (prisma.job.findUnique as any).mockResolvedValue(null);

    const res = await callPATCH({ jobId: 'j1', isActive: true });
    expect(res.status).toBe(404);
  });

  it('returns 500 on database error', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ role: 'ADMIN' });
    (prisma.job.findUnique as any).mockRejectedValue(new Error('DB error'));

    const res = await callPATCH({ jobId: 'j1', isActive: true });
    expect(res.status).toBe(500);
  });
});
