import { prisma } from "@/lib/prisma";

const store = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 30;

type RateLimitResult = { allowed: boolean; remaining: number };

async function checkDbRateLimit(key: string, max: number, windowMs: number): Promise<RateLimitResult> {
  try {
    const now = new Date();
    const entry = await prisma.rateLimit.findUnique({ where: { key } });

    if (!entry || now > entry.resetAt) {
      await prisma.rateLimit.upsert({
        where: { key },
        update: { count: 1, resetAt: new Date(now.getTime() + windowMs) },
        create: { key, count: 1, resetAt: new Date(now.getTime() + windowMs) },
      });
      return { allowed: true, remaining: max - 1 };
    }

    if (entry.count >= max) {
      return { allowed: false, remaining: 0 };
    }

    await prisma.rateLimit.update({
      where: { key },
      data: { count: { increment: 1 } },
    });
    return { allowed: true, remaining: max - entry.count - 1 };
  } catch {
    return checkMemoryRateLimit(key, max, windowMs);
  }
}

function checkMemoryRateLimit(key: string, max: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1 };
  }

  if (entry.count >= max) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: max - entry.count };
}

export async function checkRateLimit(key: string, max = MAX_REQUESTS, windowMs = WINDOW_MS): Promise<RateLimitResult> {
  if (process.env.NODE_ENV === "production" && process.env.DATABASE_URL) {
    return checkDbRateLimit(key, max, windowMs);
  }
  return checkMemoryRateLimit(key, max, windowMs);
}

export function rateLimitKey(req: Request, suffix = "") {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
  return `${ip}${suffix}`;
}
