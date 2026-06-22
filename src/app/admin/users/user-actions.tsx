"use client";
import { useState } from "react";
import { useToast } from "@/components/toast";
import { useRouter } from "next/navigation";

export default function AdminUserActions({
  userId,
  isBanned,
  role,
}: {
  userId: string;
  isBanned: boolean;
  role: string;
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  async function toggleBan() {
    setLoading("ban");
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isBanned: !isBanned }),
      });
      const data = await res.json();
      if (res.ok) {
        toast(isBanned ? "Compte débanni" : "Compte banni", "success");
        router.refresh();
      } else {
        toast(data.error || "Erreur lors du bannissement", "error");
      }
    } catch (e) {
      toast("Erreur réseau", "error");
    }
    setLoading(null);
  }

  async function changeRole(newRole: string) {
    setLoading("role");
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.createdProfile) {
          toast(`${data.createdProfile} profile créé`, "success");
        }
        if (data.deletedProfile) {
          toast(`${data.deletedProfile} profile supprimé`, "info");
        }
        if (!data.createdProfile && !data.deletedProfile) {
          toast(`Rôle changé vers ${newRole}`, "success");
        }
        router.refresh();
      } else {
        toast(data.error || "Erreur lors du changement de rôle", "error");
      }
    } catch (e) {
      toast("Erreur réseau", "error");
    }
    setLoading(null);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleBan}
        disabled={loading !== null}
        className={`font-mono text-xs px-2 py-1 rounded border transition ${
          isBanned
            ? "border-[#00c896]/30 text-[#00c896] hover:bg-[#00c896]/10"
            : "border-[#ff4060]/30 text-[#ff4060] hover:bg-[#ff4060]/10"
        } disabled:opacity-50`}
      >
        {loading === "ban" ? "..." : isBanned ? "Dé-bannir" : "Bannir"}
      </button>
      {role !== "ADMIN" && (
        <select
          value={role}
          onChange={(e) => changeRole(e.target.value)}
          disabled={loading !== null}
          className="bg-[#111d2e] border border-[#0084ff]/30 rounded px-2 py-1 font-mono text-xs text-white disabled:opacity-50"
        >
          <option value="CANDIDATE">Candidat</option>
          <option value="RECRUITER">Recruteur</option>
        </select>
      )}
    </div>
  );
}
