import { config } from "dotenv";
config({ path: ".env.local" });

async function main() {
  const email = process.argv[2] || "saotof@gmail.com";

  const res = await fetch(
    `https://api.clerk.com/v1/users?email_address=${encodeURIComponent(email)}`,
    {
      headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` },
    }
  );
  const users = await res.json();
  if (!Array.isArray(users) || users.length === 0) {
    console.error("Utilisateur non trouvé dans Clerk");
    process.exit(1);
  }
  const clerkId = users[0].id;
  console.log("Clerk ID:", clerkId);

  const upd = await fetch(
    `https://api.clerk.com/v1/users/${clerkId}/metadata`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ public_metadata: { role: "ADMIN" } }),
    }
  );
  const result = await upd.json();
  console.log("Metadata Clerk mises à jour:", JSON.stringify(result.public_metadata));
}

main().catch(console.error);
