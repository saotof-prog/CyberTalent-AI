"use client";
import { useEffect, useState } from "react";

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function BannedGuard({ children }: { children: React.ReactNode }) {
  const { signOut } = useClerk();
  const router = useRouter();
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
      <div className="fixed inset-0 bg-[#ff0000] flex flex-col items-center justify-center text-white text-3xl font-bold">
        Compte Banni
        <button
          onClick={async () => { await signOut(); router.push('/'); }}
          className="mt-4 px-4 py-2 bg-white text-red-600 rounded"
        >
          Se déconnecter
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
