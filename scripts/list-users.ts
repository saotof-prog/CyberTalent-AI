import { PrismaClient } from "@prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { config } from "dotenv";

config({ path: ".env.local" });

const prisma = new PrismaClient({
  adapter: new PrismaNeonHttp(process.env.DATABASE_URL!, {}),
});

async function main() {
  const users = await prisma.user.findMany({ select: { email: true, role: true } });
  if (users.length === 0) {
    console.log("Aucun utilisateur en base.");
  } else {
    console.log("Utilisateurs en base :");
    for (const u of users) {
      console.log(`  - ${u.email} (${u.role})`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
