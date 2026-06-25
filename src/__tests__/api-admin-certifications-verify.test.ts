import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockAuth = vi.fn();
vi.mock('@clerk/nextjs/server', () => ({
  auth: () => mockAuth(),
}));

const eps = vi.hoisted(() => ({
  recalculateAndTrack: vi.fn(),
}));

vi.mock('@/lib/score-tracker', () => ({
  recalculateAndTrack: eps.recalculateAndTrack,
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    certification: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    notification: {
      create: vi.fn(),
    },
    rateLimit: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

import { prisma } from '@/lib/prisma';

async function callPOST(id: string, body: unknown) {
  const { POST } = await import('@/app/api/admin/certifications/[id]/verify/route');
  return POST(
    new Request(`http://localhost/api/admin/certifications/${id}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
    { params: Promise.resolve({ id }) },
  );
}

describe('POST /api/admin/certifications/[id]/verify', () => {
  const adminId = 'admin-1';
  const certId = 'cert-1';

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockResolvedValue({ userId: adminId });
    (prisma.rateLimit.findUnique as any).mockResolvedValue(null);
    (prisma.rateLimit.upsert as any).mockResolvedValue({ count: 1 });
  });

  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null });
    const res = await callPOST(certId, { action: 'APPROVE' });
    expect(res.status).toBe(401);
  });

  it('returns 403 when user is not admin', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ role: 'CANDIDATE' });
    const res = await callPOST(certId, { action: 'APPROVE' });
    expect(res.status).toBe(403);
  });

  it('returns 400 when action is invalid', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ role: 'ADMIN' });
    const res = await callPOST(certId, { action: 'INVALID' });
    expect(res.status).toBe(400);
  });

  it('returns 400 when action is missing', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ role: 'ADMIN' });
    const res = await callPOST(certId, {});
    expect(res.status).toBe(400);
  });

  it('returns 404 when certification not found', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ role: 'ADMIN' });
    (prisma.certification.findUnique as any).mockResolvedValue(null);
    const res = await callPOST(certId, { action: 'APPROVE' });
    expect(res.status).toBe(404);
  });

  it('approves a certification successfully', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ role: 'ADMIN' });
    (prisma.certification.findUnique as any).mockResolvedValue({
      id: certId,
      name: 'Test Cert',
      candidate: { id: 'cand-1', user: { id: 'user-1' } },
    });
    (prisma.certification.update as any).mockResolvedValue({});
    (prisma.notification.create as any).mockResolvedValue({});

    const res = await callPOST(certId, { action: 'APPROVE' });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe('VERIFIED');
    expect(eps.recalculateAndTrack).toHaveBeenCalledWith('cand-1', expect.stringContaining('CERT_ADMIN_APPROVED'));
  });

  it('rejects a certification successfully', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ role: 'ADMIN' });
    (prisma.certification.findUnique as any).mockResolvedValue({
      id: certId,
      name: 'Test Cert',
      candidate: { id: 'cand-1', user: { id: 'user-1' } },
    });
    (prisma.certification.update as any).mockResolvedValue({});
    (prisma.notification.create as any).mockResolvedValue({});

    const res = await callPOST(certId, { action: 'REJECT', reason: 'Document invalide' });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe('REJECTED');
    expect(eps.recalculateAndTrack).toHaveBeenCalledWith('cand-1', expect.stringContaining('CERT_ADMIN_REJECTED'));
  });

  it('sanitizes XSS in certification name', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ role: 'ADMIN' });
    (prisma.certification.findUnique as any).mockResolvedValue({
      id: certId,
      name: '<script>alert("xss")</script>',
      candidate: { id: 'cand-1', user: { id: 'user-1' } },
    });
    (prisma.certification.update as any).mockResolvedValue({});
    (prisma.notification.create as any).mockResolvedValue({});

    const res = await callPOST(certId, { action: 'APPROVE' });
    expect(res.status).toBe(200);

    const notifCall = (prisma.notification.create as any).mock.calls[0][0];
    expect(notifCall.data.body).not.toContain('<script>');
  });

  it('returns 500 on database error', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ role: 'ADMIN' });
    (prisma.certification.findUnique as any).mockRejectedValue(new Error('DB error'));
    const res = await callPOST(certId, { action: 'APPROVE' });
    expect(res.status).toBe(500);
  });
});
