"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const links = [
  { href: "/recruiter/dashboard", label: "Candidats", icon: "👥" },
  { href: "/recruiter/jobs", label: "Mes Offres", icon: "💼" },
  { href: "/recruiter/search", label: "Recherche IA", icon: "⚡" },
  { href: "/recruiter/saved", label: "Sauvegardés", icon: "★" },
];

export default function RecruiterNavbar({ email }: { email?: string }) {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-[#080c14]/95 backdrop-blur border-b border-[#ff4060]/20">
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#ff4060]/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#ff4060] animate-pulse" />
          <span className="font-mono text-[#ff4060] font-bold text-sm">CYBERTALENT_RECRUITER</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="font-mono text-xs px-3 py-1 border border-[#00c896]/30 text-[#00c896] rounded-lg hover:bg-[#00c896]/10 transition"
          >
            ⚡ Espace Candidat
          </Link>
          <span className="font-mono text-xs text-gray-400">{email}</span>
          <UserButton />
        </div>
      </div>

      {/* NAV LINKS */}
      <div className="flex items-center gap-1 px-6 py-2 overflow-x-auto">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 font-mono text-xs px-4 py-2 rounded-lg whitespace-nowrap transition ${
                isActive
                  ? "bg-[#ff4060]/15 text-[#ff4060] border border-[#ff4060]/30"
                  : "text-gray-400 hover:text-white hover:bg-[#111d2e]"
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}