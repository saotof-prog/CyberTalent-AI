import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import RecruiterNavbar from "@/components/RecruiterNavbar";

export default async function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;

  return (
    <div className="min-h-screen bg-[#080c14]">
      <RecruiterNavbar email={email} />
      <main>{children}</main>
    </div>
  );
}