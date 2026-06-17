import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import RecruiterNavbar from "@/components/RecruiterNavbar";

export default async function RecruiterLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      recruiterProfile: {
        select: {
          firstName: true,
          lastName: true,
          totalSearches: true,
          _count: { select: { jobs: true } },
        },
      },
    },
  });

  if (dbUser?.role === "CANDIDATE") redirect("/dashboard");
  if (!dbUser?.role) redirect("/choose-role");

  const profile = dbUser?.recruiterProfile;

  return (
    <div className="min-h-screen bg-[#080c14]">
      <RecruiterNavbar
        email={email}
        firstName={profile?.firstName ?? user?.firstName}
        lastName={profile?.lastName ?? user?.lastName}
        imageUrl={user?.imageUrl}
        role={dbUser?.role === "ADMIN" ? "admin" : "recruiter"}
        jobsCount={profile?._count.jobs ?? 0}
        searchesCount={profile?.totalSearches ?? 0}
      />
      <main>{children}</main>
    </div>
  );
}
