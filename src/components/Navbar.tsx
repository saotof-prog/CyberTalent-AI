"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

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

  return (
    <nav className="sticky top-0 z-50 bg-[#080c14]/95 backdrop-blur border-b border-[#00c896]/20">
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#00c896]/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00c896] animate-pulse" />
          <span className="font-mono text-[#00c896] font-bold text-sm">CYBERTALENT_AI</span>
        </div>
        <div className="flex items-center gap-4">
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
    </nav>
  );
}