"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import CyberMenu from "@/components/CyberMenu";

const links = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/users", label: "Utilisateurs", icon: "👥" },
  { href: "/admin/companies", label: "Entreprises", icon: "🏢" },
  { href: "/admin/jobs", label: "Offres", icon: "💼" },
  { href: "/admin/certifications", label: "Certifications", icon: "🏆" },
  { href: "/admin/labs", label: "Labs", icon: "🧪" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080c14]">
      <nav className="sticky top-0 z-50 bg-[#080c14]/95 backdrop-blur border-b border-[#0084ff]/30">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#0084ff] animate-pulse" />
            <span className="font-mono text-[#0084ff] font-bold text-sm">CYBERTALENT_ADMIN</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="hidden md:inline font-mono text-xs text-gray-500 hover:text-white transition"
            >
              ← Retour app
            </Link>
            <CyberMenu role="admin" />
            <button
              className="md:hidden font-mono text-gray-400 text-xl"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-1 px-4 py-2 overflow-x-auto">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 font-mono text-xs px-4 py-2 rounded-lg whitespace-nowrap transition ${
                  isActive
                    ? "bg-[#0084ff]/15 text-[#0084ff] border border-[#0084ff]/30"
                    : "text-gray-400 hover:text-white hover:bg-[#111d2e]"
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </div>
        {menuOpen && (
          <div className="md:hidden flex flex-col px-4 py-2 border-t border-[#0084ff]/10 bg-[#080c14]">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 font-mono text-sm px-4 py-3 rounded-lg transition ${
                    isActive ? "text-[#0084ff] bg-[#0084ff]/10" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 font-mono text-sm px-4 py-3 rounded-lg text-gray-500 hover:text-white transition"
            >
              ← Retour app
            </Link>
          </div>
        )}
      </nav>
      <main>{children}</main>
    </div>
  );
}
