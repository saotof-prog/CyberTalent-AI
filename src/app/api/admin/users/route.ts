import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { rejectIfBanned } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";
import { badRequest } from "@/lib/api-error";
import { logSecurityEvent } from "@/lib/security-log";
import { sanitizeText } from "@/lib/sanitize";

const ALLOWED_ADMIN_ROLES = ["CANDIDATE", "RECRUITER", "ADMIN"] as const;
const ADMINS_CANNOT_BAN = new Set<string>();

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const rl = await checkRateLimit(rateLimitKey(req, `:admin:users`), 30, 60000, 5);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Trop de requêtes" }, { status: 429 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId }, select: { role: true } });
  if (!user || user.role !== "ADMIN") {
    await logSecurityEvent({
      type: "UNAUTHORIZED_ACCESS",
      userId,
      ip: req.headers.get("x-forwarded-for") ?? undefined,
      path: "/api/admin/users",
      method: "PATCH",
      details: "Tentative d'accès admin non autorisé",
    });
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return badRequest("JSON invalide");
  }

  const { userId: targetId, isBanned, banReason, role } = body as {
    userId?: string;
    isBanned?: boolean;
    banReason?: string;
    role?: string;
  };

  if (!targetId || typeof targetId !== "string") {
    return badRequest("userId valide manquant");
  }

  if (ADMINS_CANNOT_BAN.has(targetId)) {
    return badRequest("Impossible de bannir cet utilisateur");
  }

  if (role !== undefined && !ALLOWED_ADMIN_ROLES.includes(role as typeof ALLOWED_ADMIN_ROLES[number])) {
    return badRequest("Rôle invalide. Rôles autorisés: CANDIDATE, RECRUITER, ADMIN");
  }
  if (isBanned !== undefined && typeof isBanned !== "boolean") {
    return badRequest("isBanned doit être un booléen");
  }
  if (banReason !== undefined && (typeof banReason !== "string" || banReason.length > 500)) {
    return badRequest("banReason doit être une chaîne de 500 caractères maximum");
  }

  try {
    const data: Record<string, unknown> = {};
    if (isBanned !== undefined) {
      data.isBanned = isBanned;
      data.bannedAt = isBanned ? new Date() : null;
      data.banReason = isBanned ? (banReason ? sanitizeText(banReason) : "Banni par un administrateur") : null;
      data.banExpiresAt = null;
    }
    if (role) data.role = role;

    let createdProfile: string | null = null;
    let deletedProfile: string | null = null;

    await prisma.user.update({ where: { id: targetId }, data });

    const updatedUser = await prisma.user.findUnique({ where: { id: targetId }, select: { role: true, isBanned: true } });

    if (updatedUser) {
      if (updatedUser.role === "CANDIDATE") {
        const cand = await prisma.candidateProfile.findUnique({ where: { userId: targetId } });
        if (!cand) {
          await prisma.candidateProfile.create({
            data: { userId: targetId, firstName: "John", lastName: "Doe" },
          });
          createdProfile = "candidate";
        }
        const rec = await prisma.recruiterProfile.findUnique({ where: { userId: targetId } });
        if (rec) {
          await prisma.recruiterProfile.delete({ where: { userId: targetId } });
          deletedProfile = "recruiter";
        }
      } else if (updatedUser.role === "RECRUITER") {
        const rec = await prisma.recruiterProfile.findUnique({ where: { userId: targetId } });
        if (!rec) {
          await prisma.recruiterProfile.create({
            data: { userId: targetId, firstName: "John", lastName: "Doe" },
          });
          createdProfile = "recruiter";
        }
        const cand = await prisma.candidateProfile.findUnique({ where: { userId: targetId } });
        if (cand) {
          await prisma.candidateProfile.delete({ where: { userId: targetId } });
          deletedProfile = "candidate";
        }
      }
    }

    const action = isBanned !== undefined ? (isBanned ? "BAN" : "UNBAN") : "ROLE_CHANGE";
    await logSecurityEvent({
      type: "ADMIN_ACTION",
      userId,
      path: "/api/admin/users",
      method: "PATCH",
      details: `${action} sur l'utilisateur ${targetId}`,
      metadata: { targetId, action, newRole: role, isBanned },
    });

    return NextResponse.json({ success: true, createdProfile, deletedProfile });
  } catch (error) {
    console.error("ADMIN USER UPDATE ERROR:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
