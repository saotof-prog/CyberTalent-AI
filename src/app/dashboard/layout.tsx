import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";

const ADMIN_ID = "user_3EAT5iB7v76L1L4QQ2uldeubkpW";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;

  // Admin — accès total
  if (userId === ADMIN_ID) {
    return (
      <div className="min-h-screen bg-[#080c14]">
        <Navbar email={email} />
        <main>{children}</main>
      </div>
    );
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  if (dbUser?.role === "RECRUITER") redirect("/recruiter/dashboard");
  if (!dbUser?.role) redirect("/choose-role");

  return (
    <div className="min-h-screen bg-[#080c14]">
      <Navbar email={email} />
      <main>{children}</main>
    </div>
  );
}