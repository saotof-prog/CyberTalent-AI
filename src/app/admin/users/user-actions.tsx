"use client";
import { useState } from "react";
import ConfirmModal from "@/components/ConfirmModal";
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
  const [showBanModal, setShowBanModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [pendingRole, setPendingRole] = useState<string>("");
  const router = useRouter();

  async function banUser() {
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
  }

  async function toggleBan() {
    setLoading("ban");
    setShowBanModal(true);
    setLoading(null);
  }

  async function applyRoleChange() {
    setLoading("role");
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: pendingRole }),
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
          toast(`Rôle changé vers ${pendingRole}`, "success");
        }
        router.refresh();
      } else {
        toast(data.error || "Erreur lors du changement de rôle", "error");
      }
    } catch (e) {
      toast("Erreur réseau", "error");
    }
    setLoading(null);
    setShowRoleModal(false);
    setPendingRole("");
  }

  function openRoleModal(newRole: string) {
    setPendingRole(newRole);
    setShowRoleModal(true);
  }

  return (<>)
    <div className="flex items-center gap-2">
      <button
        onClick={toggleBan}
        disabled={loading !== null}
        className={`font-mono text-xs px-2 py-1 rounded border transition ${
          isBanned
            ? "border-[#00FF41]/30 text-[#00FF41] hover:bg-[#00FF41]/10"
            : "border-[#FF3333]/30 text-[#FF3333] hover:bg-[#FF3333]/10"
        } disabled:opacity-50`}
      >
        {loading === "ban" ? "..." : isBanned ? "Dé-bannir" : "Bannir"}
      </button>
      {role !== "ADMIN" && (
        <select
          value={role}
          onChange={(e) => openRoleModal(e.target.value)}
          disabled={loading !== null}
          className="bg-[#0A0A0A] border border-[#0084ff]/30 rounded px-2 py-1 font-mono text-xs text-white disabled:opacity-50"
        >
          <option value="CANDIDATE">Candidat</option>
          <option value="RECRUITER">Recruteur</option>
        </select>
      )}
    </div>
      <ConfirmModal
        open={showBanModal}
        title={isBanned ? "Débannir le compte ?" : "Bannir le compte ?"}
        message={isBanned ? "Confirmer le débannissement." : "Confirmer le bannissement."}
        onConfirm={banUser}
        onCancel={() => setShowBanModal(false)}
      />
      <ConfirmModal
        open={showRoleModal}
        title="Confirmer le changement de rôle"
        message={`Êtes‑vous sûr de changer le rôle vers ${pendingRole} ?`}
        onConfirm={applyRoleChange}
        onCancel={() => setShowRoleModal(false)}
      />
  </>);
}
