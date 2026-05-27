"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Notification = {
  id: string;
  title: string;
  body: string;
  type: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
};

export default function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const router = useRouter();

  const fetchNotifs = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (res.ok) setNotifs(data.notifications ?? []);
    } catch {}
  }, []);

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifs]);

  const unread = notifs.filter((n) => !n.isRead).length;

  async function markRead(id: string) {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen(!open); if (!open) fetchNotifs(); }}
        className="relative font-mono text-sm text-gray-400 hover:text-white transition"
      >
        🔔
        {unread > 0 && (
          <span className="absolute -top-1 -right-2 w-4 h-4 bg-[#ff4060] rounded-full text-[10px] flex items-center justify-center text-white font-bold">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 bg-[#0d1520] border border-[#ff4060]/20 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
            <div className="p-3 border-b border-[#ff4060]/10">
              <span className="font-mono text-xs text-[#ff4060]">NOTIFICATIONS</span>
            </div>
            {notifs.length === 0 ? (
              <div className="p-6 text-center font-mono text-xs text-gray-500">
                Aucune notification
              </div>
            ) : (
              notifs.slice(0, 20).map((n) => (
                <div
                  key={n.id}
                  className={`p-3 border-b border-[#ff4060]/5 hover:bg-[#111d2e] transition ${n.isRead ? "" : "bg-[#ff4060]/5"}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      {n.link ? (
                        <Link href={n.link} onClick={() => { setOpen(false); markRead(n.id); }}>
                          <p className="font-mono text-xs font-bold text-white">{n.title}</p>
                          <p className="font-mono text-[11px] text-gray-400 mt-0.5">{n.body}</p>
                        </Link>
                      ) : (
                        <>
                          <p className="font-mono text-xs font-bold text-white">{n.title}</p>
                          <p className="font-mono text-[11px] text-gray-400 mt-0.5">{n.body}</p>
                        </>
                      )}
                      <p className="font-mono text-[10px] text-gray-600 mt-1">
                        {new Date(n.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {!n.isRead && (
                      <button
                        onClick={(e) => { e.stopPropagation(); markRead(n.id); }}
                        className="font-mono text-[10px] text-[#ff4060] hover:underline shrink-0"
                      >
                        Lu
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
