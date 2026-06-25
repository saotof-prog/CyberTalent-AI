"use client";
import { useState } from "react";
import Link from "next/link";

export default function LandingNav() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Candidats", href: "#features" },
    { label: "Recruteurs", href: "#recruiters" },
    { label: "Comment ça marche", href: "#how-it-works" },
  ];

  return (
    <nav className="relative z-10 flex items-center justify-between px-4 md:px-8 py-5 border-b border-[#00FF41]/10 bg-[#080c14]/90 backdrop-blur sticky top-0">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse" />
        <span className="font-mono text-[#00FF41] font-bold text-sm">CYBERTALENT_AI</span>
      </div>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-6">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="font-mono text-xs text-gray-400 hover:text-white transition"
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/sign-in"
          className="font-mono text-xs px-4 py-2 border border-[#00FF41]/30 text-[#00FF41] rounded-lg hover:bg-[#00FF41]/10 transition"
        >
          Connexion
        </Link>
        <Link
          href="/sign-up"
          className="font-mono text-xs px-4 py-2 bg-[#00FF41] text-black font-bold rounded-lg hover:bg-[#00FF41] transition shadow-lg shadow-[#00FF41]/20"
        >
          Commencer
        </Link>
        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1 p-2"
          aria-label="Menu"
        >
          <span className={`block w-5 h-[2px] bg-gray-400 transition ${open ? "rotate-45 translate-y-[3px]" : ""}`} />
          <span className={`block w-5 h-[2px] bg-gray-400 transition ${open ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-[2px] bg-gray-400 transition ${open ? "-rotate-45 -translate-y-[3px]" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-[#080c14]/95 backdrop-blur border-b border-[#00FF41]/10 md:hidden flex flex-col items-center gap-4 py-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-mono text-sm text-gray-400 hover:text-white transition"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
