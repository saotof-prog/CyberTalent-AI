import { PrismaClient } from "@prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { clerkClient } from "@clerk/nextjs/server";
import { config } from "dotenv";

config({ path: ".env.local" });

const prisma = new PrismaClient({
  adapter: new PrismaNeonHttp(process.env.DATABASE_URL!, {}),
});

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: npx tsx scripts/set-admin.ts <email>");
    process.exit(1);
  }

  const user = await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
  });

  // Sync role to Clerk public metadata
  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(user.clerkId, {
      publicMetadata: { role: "ADMIN" },
    });
    console.log(`✅ Metadata Clerk synchronisée`);
  } catch (e) {
    console.warn(`⚠️  Impossible de synchroniser Clerk:`, e);
  }

  console.log(`✅ ${user.email} est maintenant ADMIN`);
}


main().catch(console.error).finally(() => prisma.$disconnect());
