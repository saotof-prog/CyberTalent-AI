"use client";
import { useEffect, useState } from "react";

export default function BannedGuard({ children }: { children: React.ReactNode }) {
  const [banned, setBanned] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        setBanned(!!data.isBanned);
        setChecked(true);
      })
      .catch(() => setChecked(true)); // on error, allow app to render
  }, []);

  if (!checked) return null; // optionally a loading spinner

  if (banned) {
    return (
      <div className="fixed inset-0 bg-[#ff0000] flex items-center justify-center text-white text-3xl font-bold">
        Compte Banni
      </div>
    );
  }

  return <>{children}</>;
}
