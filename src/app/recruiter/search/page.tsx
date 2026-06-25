import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function RecruiterSearchPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="min-h-screen bg-[#080c14] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="font-mono text-2xl font-bold text-white mb-1">
            Recherche <span className="text-[#FF3333]">IA</span> ⚡
          </h1>
          <p className="font-mono text-xs text-gray-400">
            Décris le profil que tu cherches en langage naturel
          </p>
        </div>

        <div className="bg-[#0d1520] border border-[#FF3333]/20 rounded-xl p-8 text-center">
          <div className="text-4xl mb-4">⚡</div>
          <p className="font-mono text-sm text-gray-400 mb-6">
            La recherche IA est disponible directement dans le dashboard candidats
          </p>
          <Link
            href="/recruiter/dashboard"
            className="font-mono text-sm px-6 py-3 bg-[#FF3333] text-white rounded-lg hover:bg-[#ff2040] transition inline-block"
          >
            Aller au dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
