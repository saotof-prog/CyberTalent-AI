import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminUserActions from "./user-actions";

export default async function AdminUsersPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      candidateProfile: { select: { cyberScore: true, firstName: true, lastName: true } },
      recruiterProfile: {
        select: { firstName: true, lastName: true, company: { select: { name: true } } },
      },
    },
  });

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-bold text-white mb-1">
          👥 Gestion des <span className="text-[#0084ff]">Utilisateurs</span>
        </h1>
        <p className="font-mono text-xs text-gray-400">{users.length} utilisateur(s)</p>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12 font-mono text-sm text-gray-500">Aucun utilisateur</div>
      ) : (
        <>
          {/* Mobile: card layout */}
          <div className="flex flex-col gap-3 lg:hidden">
            {users.map((u) => {
              const name = u.candidateProfile
                ? `${u.candidateProfile.firstName} ${u.candidateProfile.lastName}`
                : u.recruiterProfile
                  ? `${u.recruiterProfile.firstName} ${u.recruiterProfile.lastName}`
                  : "—";
              return (
                <div
                  key={u.id}
                  className="bg-[#0d1520] border border-[#0084ff]/20 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-sm text-white truncate">{u.email}</div>
                      <div className="font-mono text-xs text-gray-400 truncate">{name}</div>
                    </div>
                    <span
                      className={`shrink-0 font-mono text-[10px] px-2 py-0.5 rounded-full border ${
                        u.role === "CANDIDATE"
                          ? "border-[#00c896] text-[#00c896]"
                          : u.role === "RECRUITER"
                            ? "border-[#ff4060] text-[#ff4060]"
                            : "border-[#0084ff] text-[#0084ff]"
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-mono text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                    <span className="font-mono text-gray-500">
                      Score: {u.candidateProfile?.cyberScore ?? "—"}
                    </span>
                    <span
                      className={`font-mono px-2 py-0.5 rounded-full border ${
                        u.isBanned
                          ? "border-[#ff4060] text-[#ff4060]"
                          : u.isActive
                            ? "border-[#00c896] text-[#00c896]"
                            : "border-gray-500 text-gray-500"
                      }`}
                    >
                      {u.isBanned ? "Banni" : u.isActive ? "Actif" : "Inactif"}
                    </span>
                  </div>
                  <AdminUserActions userId={u.id} isBanned={u.isBanned} role={u.role} />
                </div>
              );
            })}
          </div>

          {/* Desktop: table layout */}
          <div className="hidden lg:block bg-[#0d1520] border border-[#0084ff]/20 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#0084ff]/10">
                    <th className="font-mono text-xs text-gray-400 text-left p-3">Date</th>
                    <th className="font-mono text-xs text-gray-400 text-left p-3">Email</th>
                    <th className="font-mono text-xs text-gray-400 text-left p-3">Nom</th>
                    <th className="font-mono text-xs text-gray-400 text-left p-3">Rôle</th>
                    <th className="font-mono text-xs text-gray-400 text-left p-3">Score</th>
                    <th className="font-mono text-xs text-gray-400 text-left p-3">Statut</th>
                    <th className="font-mono text-xs text-gray-400 text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const name = u.candidateProfile
                      ? `${u.candidateProfile.firstName} ${u.candidateProfile.lastName}`
                      : u.recruiterProfile
                        ? `${u.recruiterProfile.firstName} ${u.recruiterProfile.lastName}`
                        : "—";
                    return (
                      <tr
                        key={u.id}
                        className="border-b border-[#0084ff]/5 hover:bg-[#111d2e] transition"
                      >
                        <td className="p-3 font-mono text-xs text-gray-500">
                          {new Date(u.createdAt).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="p-3 font-mono text-sm text-white">{u.email}</td>
                        <td className="p-3 font-mono text-sm text-gray-300">{name}</td>
                        <td className="p-3">
                          <span
                            className={`font-mono text-xs px-2 py-0.5 rounded-full border ${
                              u.role === "CANDIDATE"
                                ? "border-[#00c896] text-[#00c896]"
                                : u.role === "RECRUITER"
                                  ? "border-[#ff4060] text-[#ff4060]"
                                  : "border-[#0084ff] text-[#0084ff]"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-sm text-white">
                          {u.candidateProfile?.cyberScore ?? "—"}
                        </td>
                        <td className="p-3">
                          <span
                            className={`font-mono text-xs px-2 py-0.5 rounded-full border ${
                              u.isBanned
                                ? "border-[#ff4060] text-[#ff4060]"
                                : u.isActive
                                  ? "border-[#00c896] text-[#00c896]"
                                  : "border-gray-500 text-gray-500"
                            }`}
                          >
                            {u.isBanned ? "Banni" : u.isActive ? "Actif" : "Inactif"}
                          </span>
                        </td>
                        <td className="p-3">
                          <AdminUserActions userId={u.id} isBanned={u.isBanned} role={u.role} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
