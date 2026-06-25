"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["PENDING", "VIEWED", "SHORTLISTED", "INTERVIEW", "OFFER", "REJECTED"] as const;

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-900/30 border-yellow-600 text-yellow-400",
  VIEWED: "bg-blue-900/30 border-blue-600 text-blue-400",
  SHORTLISTED: "bg-[#00FF41]/10 border-[#00FF41] text-[#00FF41]",
  INTERVIEW: "bg-[#0084ff]/10 border-[#0084ff] text-[#0084ff]",
  OFFER: "bg-purple-900/30 border-purple-400 text-purple-400",
  REJECTED: "bg-[#FF3333]/10 border-[#FF3333] text-[#FF3333]",
  WITHDRAWN: "bg-gray-800 border-gray-700 text-gray-500",
};

export default function ApplicationStatusSelect({
  applicationId,
  initialStatus,
}: {
  applicationId: string;
  initialStatus: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleChange(newStatus: string) {
    setLoading(true);
    setStatus(newStatus);
    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        setStatus(initialStatus);
      }
      router.refresh();
    } catch {
      setStatus(initialStatus);
    }
    setLoading(false);
  }

  return (
    <div className="relative">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={loading}
        onClick={(e) => e.stopPropagation()}
        className={`font-mono text-xs px-2 py-1 rounded border cursor-pointer appearance-none ${STATUS_STYLES[status] ?? "text-gray-500 border-gray-700"} disabled:opacity-50`}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s} className="bg-[#0d1520] text-white">
            {s}
          </option>
        ))}
      </select>
      {loading && (
        <span className="absolute -right-4 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-[#FF3333]/30 border-t-[#FF3333] rounded-full animate-spin" />
      )}
    </div>
  );
}
