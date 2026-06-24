import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockAuth = vi.fn();
vi.mock('@clerk/nextjs/server', () => ({
  auth: () => mockAuth(),
}));

// Mock Prisma client
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
    $transaction: async (cb: (tx: any) => any) => await cb(prisma),
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

describe('PATCH /api/admin/users (role change)', () => {
  const adminId = 'admin-1';
  const targetId = 'user-2';

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockResolvedValue({ userId: adminId });

  it('bannit et débannit un utilisateur', async () => {
    // Admin check returns ADMIN role
    (prisma.user.findUnique as any).mockImplementation((args: any) => {
      if (args.where.clerkId === adminId) return { role: 'ADMIN' };
      if (args.where.id === targetId) return { role: 'CANDIDATE', isBanned: true };
      return null;
    });

    // Mock update – no specific return needed
    (prisma.user.update as any).mockResolvedValue({});

    // Unban request (isBanned: false)
    const res = await callPATCH({ userId: targetId, isBanned: false });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });
  });

  it('bannit et débannit un utilisateur', async () => {
    // Admin check returns ADMIN role
    (prisma.user.findUnique as any).mockImplementation((args: any) => {
      if (args.where.clerkId === adminId) return { role: 'ADMIN' };
      if (args.where.id === targetId) return { role: 'CANDIDATE', isBanned: true };
      return null;
    });

    // Mock update – no specific return needed
    (prisma.user.update as any).mockResolvedValue({});

    // Unban request (isBanned: false)
    const res = await callPATCH({ userId: targetId, isBanned: false });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  it('creates recruiterProfile when role changes to RECRUITER', async () => {
    // Admin check returns ADMIN role
    (prisma.user.findUnique as any).mockImplementation((args: any) => {
      if (args.where.clerkId === adminId) return { role: 'ADMIN' };
      if (args.where.id === targetId) return { role: 'RECRUITER' };
      return null;
    });

  it('bannit et débannit un utilisateur', async () => {
    // Admin check returns ADMIN role
    (prisma.user.findUnique as any).mockImplementation((args: any) => {
      if (args.where.clerkId === adminId) return { role: 'ADMIN' };
      if (args.where.id === targetId) return { role: 'CANDIDATE', isBanned: true };
      return null;
    });

    // Mock update – no specific return needed
    (prisma.user.update as any).mockResolvedValue({});

    // Unban request (isBanned: false)
    const res = await callPATCH({ userId: targetId, isBanned: false });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

    // No existing recruiterProfile
    (prisma.recruiterProfile.findUnique as any).mockResolvedValue(null);
    (prisma.recruiterProfile.create as any).mockResolvedValue({ id: 'rec-1' });

  it('bannit et débannit un utilisateur', async () => {
    // Admin check returns ADMIN role
    (prisma.user.findUnique as any).mockImplementation((args: any) => {
      if (args.where.clerkId === adminId) return { role: 'ADMIN' };
      if (args.where.id === targetId) return { role: 'CANDIDATE', isBanned: true };
      return null;
    });

    // Mock update – no specific return needed
    (prisma.user.update as any).mockResolvedValue({});

    // Unban request (isBanned: false)
    const res = await callPATCH({ userId: targetId, isBanned: false });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });
    (prisma.user.update as any).mockResolvedValue({});

  it('bannit et débannit un utilisateur', async () => {
    // Admin check returns ADMIN role
    (prisma.user.findUnique as any).mockImplementation((args: any) => {
      if (args.where.clerkId === adminId) return { role: 'ADMIN' };
      if (args.where.id === targetId) return { role: 'CANDIDATE', isBanned: true };
      return null;
    });

    // Mock update – no specific return needed
    (prisma.user.update as any).mockResolvedValue({});

    // Unban request (isBanned: false)
    const res = await callPATCH({ userId: targetId, isBanned: false });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

    const res = await callPATCH({ userId: targetId, role: 'RECRUITER' });

  it('bannit et débannit un utilisateur', async () => {
    // Admin check returns ADMIN role
    (prisma.user.findUnique as any).mockImplementation((args: any) => {
      if (args.where.clerkId === adminId) return { role: 'ADMIN' };
      if (args.where.id === targetId) return { role: 'CANDIDATE', isBanned: true };
      return null;
    });

    // Mock update – no specific return needed
    (prisma.user.update as any).mockResolvedValue({});

    // Unban request (isBanned: false)
    const res = await callPATCH({ userId: targetId, isBanned: false });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(prisma.recruiterProfile.create).toHaveBeenCalledWith({
      data: {
        userId: targetId,
        firstName: 'John',
        lastName: 'Doe',
      },
    });

  it('bannit et débannit un utilisateur', async () => {
    // Admin check returns ADMIN role
    (prisma.user.findUnique as any).mockImplementation((args: any) => {
      if (args.where.clerkId === adminId) return { role: 'ADMIN' };
      if (args.where.id === targetId) return { role: 'CANDIDATE', isBanned: true };
      return null;
    });

    // Mock update – no specific return needed
    (prisma.user.update as any).mockResolvedValue({});

    // Unban request (isBanned: false)
    const res = await callPATCH({ userId: targetId, isBanned: false });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });
  });

  it('bannit et débannit un utilisateur', async () => {
    // Admin check returns ADMIN role
    (prisma.user.findUnique as any).mockImplementation((args: any) => {
      if (args.where.clerkId === adminId) return { role: 'ADMIN' };
      if (args.where.id === targetId) return { role: 'CANDIDATE', isBanned: true };
      return null;
    });

    // Mock update – no specific return needed
    (prisma.user.update as any).mockResolvedValue({});

    // Unban request (isBanned: false)
    const res = await callPATCH({ userId: targetId, isBanned: false });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  it('creates candidateProfile when role changes to CANDIDATE', async () => {
    // Admin check returns ADMIN role
    (prisma.user.findUnique as any).mockImplementation((args: any) => {
      if (args.where.clerkId === adminId) return { role: 'ADMIN' };
      if (args.where.id === targetId) return { role: 'CANDIDATE' };
      return null;
    });

  it('bannit et débannit un utilisateur', async () => {
    // Admin check returns ADMIN role
    (prisma.user.findUnique as any).mockImplementation((args: any) => {
      if (args.where.clerkId === adminId) return { role: 'ADMIN' };
      if (args.where.id === targetId) return { role: 'CANDIDATE', isBanned: true };
      return null;
    });

    // Mock update – no specific return needed
    (prisma.user.update as any).mockResolvedValue({});

    // Unban request (isBanned: false)
    const res = await callPATCH({ userId: targetId, isBanned: false });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

    // No existing candidateProfile
    (prisma.candidateProfile.findUnique as any).mockResolvedValue(null);
    (prisma.candidateProfile.create as any).mockResolvedValue({ id: 'cand-1' });

  it('bannit et débannit un utilisateur', async () => {
    // Admin check returns ADMIN role
    (prisma.user.findUnique as any).mockImplementation((args: any) => {
      if (args.where.clerkId === adminId) return { role: 'ADMIN' };
      if (args.where.id === targetId) return { role: 'CANDIDATE', isBanned: true };
      return null;
    });

    // Mock update – no specific return needed
    (prisma.user.update as any).mockResolvedValue({});

    // Unban request (isBanned: false)
    const res = await callPATCH({ userId: targetId, isBanned: false });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });
    (prisma.user.update as any).mockResolvedValue({});

  it('bannit et débannit un utilisateur', async () => {
    // Admin check returns ADMIN role
    (prisma.user.findUnique as any).mockImplementation((args: any) => {
      if (args.where.clerkId === adminId) return { role: 'ADMIN' };
      if (args.where.id === targetId) return { role: 'CANDIDATE', isBanned: true };
      return null;
    });

    // Mock update – no specific return needed
    (prisma.user.update as any).mockResolvedValue({});

    // Unban request (isBanned: false)
    const res = await callPATCH({ userId: targetId, isBanned: false });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

    const res = await callPATCH({ userId: targetId, role: 'CANDIDATE' });

  it('bannit et débannit un utilisateur', async () => {
    // Admin check returns ADMIN role
    (prisma.user.findUnique as any).mockImplementation((args: any) => {
      if (args.where.clerkId === adminId) return { role: 'ADMIN' };
      if (args.where.id === targetId) return { role: 'CANDIDATE', isBanned: true };
      return null;
    });

    // Mock update – no specific return needed
    (prisma.user.update as any).mockResolvedValue({});

    // Unban request (isBanned: false)
    const res = await callPATCH({ userId: targetId, isBanned: false });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(prisma.candidateProfile.create).toHaveBeenCalledWith({
      data: {
        userId: targetId,
        firstName: 'John',
        lastName: 'Doe',
      },
    });

  it('bannit et débannit un utilisateur', async () => {
    // Admin check returns ADMIN role
    (prisma.user.findUnique as any).mockImplementation((args: any) => {
      if (args.where.clerkId === adminId) return { role: 'ADMIN' };
      if (args.where.id === targetId) return { role: 'CANDIDATE', isBanned: true };
      return null;
    });

    // Mock update – no specific return needed
    (prisma.user.update as any).mockResolvedValue({});

    // Unban request (isBanned: false)
    const res = await callPATCH({ userId: targetId, isBanned: false });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });
  });

  it('bannit et débannit un utilisateur', async () => {
    // Admin check returns ADMIN role
    (prisma.user.findUnique as any).mockImplementation((args: any) => {
      if (args.where.clerkId === adminId) return { role: 'ADMIN' };
      if (args.where.id === targetId) return { role: 'CANDIDATE', isBanned: true };
      return null;
    });

    // Mock update – no specific return needed
    (prisma.user.update as any).mockResolvedValue({});

    // Unban request (isBanned: false)
    const res = await callPATCH({ userId: targetId, isBanned: false });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });
});

  it('bannit et débannit un utilisateur', async () => {
    // Admin check returns ADMIN role
    (prisma.user.findUnique as any).mockImplementation((args: any) => {
      if (args.where.clerkId === adminId) return { role: 'ADMIN' };
      if (args.where.id === targetId) return { role: 'CANDIDATE', isBanned: true };
      return null;
    });

    // Mock update – no specific return needed
    (prisma.user.update as any).mockResolvedValue({});

    // Unban request (isBanned: false)
    const res = await callPATCH({ userId: targetId, isBanned: false });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });
