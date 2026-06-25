"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import NotificationsBell from "@/components/NotificationsBell";
import CyberMenu from "@/components/CyberMenu";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: "⚡" },
  { href: "/dashboard/certifications", label: "Certifications", icon: "🏆" },
  { href: "/dashboard/labs", label: "Labs", icon: "🧪" },
  { href: "/dashboard/skills", label: "Skills", icon: "💡" },
  { href: "/dashboard/score", label: "Score IA", icon: "📊" },
  { href: "/dashboard/jobs", label: "Offres", icon: "💼" },
];

interface NavbarProps {
  email?: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
  score?: number;
  scoreLevel?: string;
  role?: "candidate" | "recruiter" | "admin";
  certsCount?: number;
  labsCount?: number;
  reposCount?: number;
  profileComplete?: number;
  githubSynced?: boolean;
}

export default function Navbar({
  email,
  firstName,
  lastName,
  imageUrl,
  score,
  scoreLevel,
  role,
  certsCount,
  labsCount,
  reposCount,
  profileComplete,
  githubSynced,
}: NavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#080c14]/95 backdrop-blur border-b border-[#00FF41]/20">
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse" />
          <span className="font-mono text-[#00FF41] font-bold text-sm">CYBERTALENT_AI</span>
        </div>
        <div className="flex items-center gap-3">
          <NotificationsBell />
          <span className="hidden md:block font-mono text-xs text-gray-400">{email}</span>
          <CyberMenu
            email={email}
            firstName={firstName}
            lastName={lastName}
            imageUrl={imageUrl}
            score={score}
            scoreLevel={scoreLevel}
            role={role}
            certsCount={certsCount}
            labsCount={labsCount}
            reposCount={reposCount}
            profileComplete={profileComplete}
            githubSynced={githubSynced}
          />
          {/* Hamburger mobile */}
          <button
            className="md:hidden font-mono text-gray-400 text-xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* NAV LINKS — desktop */}
      <div className="hidden md:flex items-center gap-1 px-4 py-2 overflow-x-auto">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 font-mono text-xs px-4 py-2 rounded-lg whitespace-nowrap transition ${
                isActive
                  ? "bg-[#00FF41]/15 text-[#00FF41] border border-[#00FF41]/30"
                  : "text-gray-400 hover:text-white hover:bg-[#0A0A0A]"
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* NAV LINKS — mobile menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col px-4 py-2 border-t border-[#00FF41]/10 bg-[#080c14]">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 font-mono text-sm px-4 py-3 rounded-lg transition ${
                  isActive ? "text-[#00FF41] bg-[#00FF41]/10" : "text-gray-400 hover:text-white"
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
