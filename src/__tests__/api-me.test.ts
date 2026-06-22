import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockAuth = vi.fn();
vi.mock('@clerk/nextjs/server', () => ({
  auth: () => mockAuth(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from '@/lib/prisma';

async function callGET() {
  const { GET } = await import('@/app/api/me/route');
  return GET(new Request('http://localhost/api/me'));
}

describe('GET /api/me', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockResolvedValue({ userId: 'user-1' });
  });

  it('returns false when not banned', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ isBanned: false });
    const res = await callGET();
    const data = await res.json();
    expect(data.isBanned).toBe(false);
  });

  it('returns true when banned', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ isBanned: true });
    const res = await callGET();
    const data = await res.json();
    expect(data.isBanned).toBe(true);
  });
});
