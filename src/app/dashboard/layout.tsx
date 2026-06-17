import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      candidateProfile: {
        select: {
          firstName: true,
          lastName: true,
          cyberScore: true,
          scoreLevel: true,
          profileComplete: true,
          githubSyncedAt: true,
          githubUsername: true,
          _count: { select: { certifications: true, labs: true, githubRepos: true } },
        },
      },
    },
  });

  if (dbUser?.role === "RECRUITER") redirect("/recruiter/dashboard");
  if (dbUser?.role === "ADMIN") {
    return (
      <div className="min-h-screen bg-[#080c14]">
        <Navbar email={email} firstName={user?.firstName} lastName={user?.lastName} imageUrl={user?.imageUrl} role="admin" />
        <main>{children}</main>
      </div>
    );
  }
  if (!dbUser?.role) redirect("/choose-role");

  const profile = dbUser?.candidateProfile;

  return (
    <div className="min-h-screen bg-[#080c14]">
      <Navbar
        email={email}
        firstName={profile?.firstName ?? user?.firstName}
        lastName={profile?.lastName ?? user?.lastName}
        imageUrl={user?.imageUrl}
        role="candidate"
        score={profile?.cyberScore}
        scoreLevel={profile?.scoreLevel}
        profileComplete={profile?.profileComplete}
        certsCount={profile?._count.certifications}
        labsCount={profile?._count.labs}
        reposCount={profile?._count.githubRepos}
        githubSynced={!!profile?.githubSyncedAt}
      />
      <main>{children}</main>
    </div>
  );
}
