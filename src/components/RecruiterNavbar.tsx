"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import NotificationsBell from "@/components/NotificationsBell";
import CyberMenu from "@/components/CyberMenu";

const links = [
  { href: "/recruiter/dashboard", label: "Candidats", icon: "👥" },
  { href: "/recruiter/jobs", label: "Mes Offres", icon: "💼" },
  { href: "/recruiter/analytics", label: "Analytics", icon: "📊" },
  { href: "/recruiter/search", label: "Recherche IA", icon: "⚡" },
  { href: "/recruiter/saved", label: "Sauvegardés", icon: "★" },
];

interface RecruiterNavbarProps {
  email?: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
  role?: "candidate" | "recruiter" | "admin";
  jobsCount?: number;
  searchesCount?: number;
}

export default function RecruiterNavbar({
  email,
  firstName,
  lastName,
  imageUrl,
  role,
  jobsCount,
  searchesCount,
}: RecruiterNavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#080c14]/95 backdrop-blur border-b border-[#ff4060]/20">
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#ff4060] animate-pulse" />
          <span className="font-mono text-[#ff4060] font-bold text-sm">CYBERTALENT_RECRUITER</span>
        </div>
        <div className="flex items-center gap-3">
          <NotificationsBell />
          <span className="hidden md:block font-mono text-xs text-gray-400">{email}</span>
          <CyberMenu
            email={email}
            firstName={firstName}
            lastName={lastName}
            imageUrl={imageUrl}
            role={role}
            jobsCount={jobsCount}
            searchesCount={searchesCount}
          />
          <button
            className="md:hidden font-mono text-gray-400 text-xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-1 px-4 py-2 overflow-x-auto">
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

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col px-4 py-2 border-t border-[#ff4060]/10 bg-[#080c14]">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 font-mono text-sm px-4 py-3 rounded-lg transition ${
                  isActive ? "text-[#ff4060] bg-[#ff4060]/10" : "text-gray-400 hover:text-white"
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
          <div className="font-mono text-xs text-gray-600 px-4 py-2">{email}</div>
        </div>
      )}
    </nav>
  );
}
