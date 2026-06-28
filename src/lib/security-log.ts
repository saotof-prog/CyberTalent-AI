import { prisma } from "@/lib/prisma";
import type { AuditAction } from "@prisma/client";

export type SecurityEventType =
  | "RATE_LIMIT_EXCEEDED"
  | "UNAUTHORIZED_ACCESS"
  | "BANNED_USER_ACCESS"
  | "SUSPICIOUS_INPUT"
  | "ADMIN_ACTION"
  | "FAILED_AUTH"
  | "CSRF_VIOLATION"
  | "SUSPICIOUS_UPLOAD"
  | "ACCOUNT_TAKEOVER_ATTEMPT"
  | "MASS_ASSIGNMENT_ATTEMPT";

interface SecurityEvent {
  type: SecurityEventType;
  userId?: string;
  ip?: string;
  path?: string;
  method?: string;
  details?: string;
  metadata?: Record<string, unknown>;
}

function sanitizeForLog(value: string): string {
  return value.replace(/[\n\r\t]/g, " ").slice(0, 500);
}

export async function logSecurityEvent(event: SecurityEvent): Promise<void> {
  const details = sanitizeForLog(event.details ?? "");

  if (event.type.startsWith("RATE_LIMIT")) {
    console.warn(`[SECURITY] ${event.type} | IP: ${event.ip ?? "?"} | User: ${event.userId ?? "?"} | Path: ${event.path ?? "?"}`);
  } else if (event.type === "ADMIN_ACTION") {
    console.info(`[ADMIN] ${details} | User: ${event.userId ?? "?"}`);
  } else {
    console.error(`[SECURITY] ${event.type} | ${details} | User: ${event.userId ?? "?"} | IP: ${event.ip ?? "?"}`);
  }

  try {
    if (event.userId) {
      const user = await prisma.user.findUnique({
        where: { clerkId: event.userId },
        select: { id: true },
      });

      if (user) {
        const metadata = event.metadata ? JSON.parse(JSON.stringify(event.metadata)) : undefined;

        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: mapEventToAuditAction(event.type) as AuditAction,
            entity: event.path ?? null,
            entityId: null,
            metadata: metadata as never,
            ip: event.ip ?? null,
            userAgent: null,
          },
        });
      }
    }
  } catch {
    // silence — logging should never break the main flow
  }
}

function mapEventToAuditAction(type: SecurityEventType): AuditAction {
  const map: Record<string, string> = {
    RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
    UNAUTHORIZED_ACCESS: "SECURITY_EVENT",
    BANNED_USER_ACCESS: "SUSPICIOUS_ACCESS_DETECTED",
    SUSPICIOUS_INPUT: "SUSPICIOUS_ACCESS_DETECTED",
    ADMIN_ACTION: "ADMIN_CHANGED_ROLE",
    FAILED_AUTH: "SUSPICIOUS_ACCESS_DETECTED",
    CSRF_VIOLATION: "SECURITY_EVENT",
    SUSPICIOUS_UPLOAD: "SUSPICIOUS_ACCESS_DETECTED",
    ACCOUNT_TAKEOVER_ATTEMPT: "SUSPICIOUS_ACCESS_DETECTED",
    MASS_ASSIGNMENT_ATTEMPT: "SECURITY_EVENT",
  };
  return (map[type] ?? "SECURITY_EVENT") as AuditAction;
}
