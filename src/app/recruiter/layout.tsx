import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import RecruiterNavbar from "@/components/RecruiterNavbar";

const prisma = new PrismaClient();

export default async function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;

  // Vérifier le rôle
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  if (dbUser?.role === "CANDIDATE") redirect("/dashboard");
  if (!dbUser?.role) redirect("/choose-role");

  return (
    <div className="min-h-screen bg-[#080c14]">
      <RecruiterNavbar email={email} />
      <main>{children}</main>
    </div>
  );
}