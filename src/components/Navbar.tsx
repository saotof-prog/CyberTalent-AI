"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useState } from "react";
import NotificationsBell from "@/components/NotificationsBell";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: "⚡" },
  { href: "/dashboard/certifications", label: "Certifications", icon: "🏆" },
  { href: "/dashboard/labs", label: "Labs", icon: "🧪" },
  { href: "/dashboard/skills", label: "Skills", icon: "💡" },
  { href: "/dashboard/score", label: "Score IA", icon: "📊" },
  { href: "/dashboard/jobs", label: "Offres", icon: "💼" },
];

export default function Navbar({ email }: { email?: string }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#080c14]/95 backdrop-blur border-b border-[#00c896]/20">
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00c896] animate-pulse" />
          <span className="font-mono text-[#00c896] font-bold text-sm">CYBERTALENT_AI</span>
        </div>
        <div className="flex items-center gap-3">
          <NotificationsBell />
          <span className="hidden md:block font-mono text-xs text-gray-400">{email}</span>
          <UserButton />
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
                  ? "bg-[#00c896]/15 text-[#00c896] border border-[#00c896]/30"
                  : "text-gray-400 hover:text-white hover:bg-[#111d2e]"
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
        <div className="md:hidden flex flex-col px-4 py-2 border-t border-[#00c896]/10 bg-[#080c14]">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 font-mono text-sm px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "text-[#00c896] bg-[#00c896]/10"
                    : "text-gray-400 hover:text-white"
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