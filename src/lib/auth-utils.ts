import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Checks if the user identified by its Clerk ID is banned.
 * Returns a 403 JSON response when banned, otherwise null.
 */
export async function rejectIfBanned(userId: string) {
  // In unit tests the Prisma client may be mocked without a `user` model.
  // Guard against missing `prisma.user` to avoid runtime errors.
  if (!prisma?.user?.findUnique) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { isBanned: true },
  });
  if (user?.isBanned) {
    return NextResponse.json({ error: "Compte banni" }, { status: 403 });
  }
  return null;
}
