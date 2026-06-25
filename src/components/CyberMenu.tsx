"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { playAmbient, stopAmbient, getCurrentMode } from "@/lib/ambient-sound";

interface CyberMenuProps {
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
  jobsCount?: number;
  searchesCount?: number;
}

function getLevelColor(level?: string | null) {
  const colors: Record<string, string> = {
    BEGINNER: "#00FF41",
    INTERMEDIATE: "#00e5ff",
    ADVANCED: "#aa66ff",
    EXPERT: "#ff6600",
  };
  return colors[level ?? ""] ?? "#00FF41";
}

function getLevelLabel(level?: string | null) {
  const labels: Record<string, string> = {
    BEGINNER: "DÉBUTANT",
    INTERMEDIATE: "INTERMÉDIAIRE",
    ADVANCED: "AVANCÉ",
    EXPERT: "EXPERT",
  };
  return labels[level ?? ""] ?? "DÉBUTANT";
}

function getInitials(first?: string | null, last?: string | null) {
  return `${(first?.[0] ?? "").toUpperCase()}${(last?.[0] ?? "").toUpperCase()}`;
}

function CyberScoreRing({ score, level }: { score: number; level?: string | null }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const color = getLevelColor(level);

  useEffect(() => {
    let frame = 0;
    const total = Math.min(score, 100);
    const animate = () => {
      frame++;
      setAnimatedScore((prev) => {
        const next = prev + Math.ceil((total - prev) / 3);
        return next >= total ? total : next;
      });
      if (frame < 20) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [score]);

  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="relative w-[72px] h-[72px] flex items-center justify-center">
      <svg width="72" height="72" className="transform -rotate-90">
        <circle cx="36" cy="36" r={radius} fill="none" stroke="#1a2a3a" strokeWidth="4" />
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.3s ease, stroke 0.5s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-lg font-bold" style={{ color }}>
          {animatedScore}
        </span>
      </div>
    </div>
  );
}

export default function CyberMenu({
  email,
  firstName,
  lastName,
  imageUrl,
  score = 0,
  scoreLevel,
  role,
  certsCount = 0,
  reposCount = 0,
  profileComplete = 0,
  githubSynced = false,
  jobsCount = 0,
  searchesCount = 0,
}: CyberMenuProps) {
  const [open, setOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [ambientOn, setAmbientOn] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { signOut } = useClerk();

  useEffect(() => {
    const stored = localStorage.getItem("cyber-focus");
    if (stored === "true") {
      setFocusMode(true);
      document.body.classList.add("cyber-focus");
    }
  }, []);

  const toggleAmbient = useCallback(() => {
    if (ambientOn) {
      stopAmbient();
      setAmbientOn(false);
    } else {
      playAmbient("drone");
      setAmbientOn(true);
    }
  }, [ambientOn]);

  const toggleFocus = useCallback(() => {
    const next = !focusMode;
    setFocusMode(next);
    if (next) {
      document.body.classList.add("cyber-focus");
      playAmbient("drone");
      setAmbientOn(true);
    } else {
      document.body.classList.remove("cyber-focus");
      stopAmbient();
      setAmbientOn(false);
    }
    localStorage.setItem("cyber-focus", String(next));
  }, [focusMode]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const levelColor = getLevelColor(scoreLevel);
  const initials = getInitials(firstName, lastName);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative group outline-none"
        aria-label="Menu profil"
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold text-white bg-[#0A0A0A] border-2 overflow-hidden shadow-lg transition-all duration-300"
          style={{
            borderColor: levelColor,
            boxShadow: open ? `0 0 16px ${levelColor}44` : undefined,
          }}
        >
          {imageUrl ? (
            <img src={imageUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            initials || "?"
          )}
        </div>
        <span
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#080c14]"
          style={{ backgroundColor: levelColor }}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 max-w-[calc(100vw-16px)] z-[100]">
          <div
            className="bg-[#0d1520]/95 backdrop-blur-xl rounded-2xl border overflow-hidden shadow-2xl"
            style={{ borderColor: `${levelColor}22` }}
          >
            {/* Scanline header */}
            <div className="relative px-5 pt-5 pb-4 overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
                }}
              />
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center font-mono text-lg font-bold text-white bg-[#0A0A0A] border-2 overflow-hidden"
                    style={{ borderColor: levelColor }}
                  >
                    {imageUrl ? (
                      <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      initials || "?"
                    )}
                  </div>
                  <div
                    className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-white"
                    style={{ backgroundColor: levelColor }}
                  >
                    {role === "recruiter" ? "REC" : role === "admin" ? "ADM" : "CND"}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-sm font-bold text-white truncate">
                    {firstName ? `${firstName} ${lastName ?? ""}` : "CyberPunk"}
                  </div>
                  <div className="font-mono text-[10px] text-gray-500 truncate mt-0.5">
                    {email || "connecté"}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span
                      className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{
                        color: levelColor,
                        backgroundColor: `${levelColor}15`,
                        border: `1px solid ${levelColor}30`,
                      }}
                    >
                      {getLevelLabel(scoreLevel)}
                    </span>
                    <span className="font-mono text-[10px] text-gray-500">
                      {profileComplete}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Score ring + stats row */}
            <div className="flex items-center justify-center gap-6 px-5 py-4 border-t border-[#ffffff08]">
              <CyberScoreRing score={score} level={scoreLevel} />
              <div className="flex gap-5">
                {(role === "recruiter"
                  ? [
                      { label: "OFFRES", value: jobsCount, color: "#FF3333" },
                      { label: "RECHERCHES", value: searchesCount, color: "#ff8800" },
                      { label: "SCORE", value: score, color: levelColor },
                    ]
                  : [
                      { label: "CERT", value: certsCount, color: "#00FF41" },
                      { label: "LABS", value: reposCount, color: "#00e5ff" },
                      { label: "SCORE", value: score, color: levelColor },
                    ]
                ).map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div
                      className="font-mono text-lg font-bold"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </div>
                    <div className="font-mono text-[9px] text-gray-500 tracking-widest">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Missions */}
            <div className="px-5 py-3 border-t border-[#ffffff08]">
              <div className="font-mono text-[10px] text-gray-500 tracking-widest mb-2">
                ▸ MISSIONS DU JOUR
              </div>
              <div className="space-y-1.5">
                {role === "recruiter" ? (
                  <>
                    <MissionItem
                      label="Profil complété"
                      done={profileComplete >= 80}
                      value={`${profileComplete}%`}
                      color="#FF3333"
                    />
                    <MissionItem
                      label="Offre publiée"
                      done={jobsCount > 0}
                      value={jobsCount > 0 ? `${jobsCount}` : undefined}
                      color="#FF3333"
                    />
                    <MissionItem
                      label="Recherche IA effectuée"
                      done={searchesCount > 0}
                      color="#FF3333"
                    />
                  </>
                ) : (
                  <>
                    <MissionItem
                      label="Profil complété"
                      done={profileComplete >= 80}
                      value={`${profileComplete}%`}
                      color="#00FF41"
                    />
                    <MissionItem
                      label="GitHub synchronisé"
                      done={githubSynced}
                      color="#00FF41"
                    />
                    <MissionItem
                      label="Certification ajoutée"
                      done={certsCount > 0}
                      value={certsCount > 0 ? `${certsCount}` : undefined}
                      color="#00FF41"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Quick links */}
            <div className="px-3 py-3 border-t border-[#ffffff08]">
              <div className="font-mono text-[10px] text-gray-500 tracking-widest mb-2 px-2">
                ▸ ACTIONS RAPIDES
              </div>
              <div className="grid grid-cols-2 gap-1">
                {role === "admin" && (
                  <Link
                    href="/admin"
                    className="col-span-2 flex items-center gap-2 font-mono text-xs text-[#0084ff] bg-[#0084ff]/10 hover:bg-[#0084ff]/20 rounded-lg px-3 py-2.5 transition border border-[#0084ff]/20"
                  >
                    <span>🛡️</span>
                    <span className="font-bold">Admin Panel</span>
                    <span className="ml-auto opacity-40">→</span>
                  </Link>
                )}
                <MenuLink href="/dashboard/edit" icon="✎" label="Mon Profil" />
                <MenuLink
                  href={role === "recruiter" ? "/recruiter/dashboard" : "/dashboard"}
                  icon="⚡"
                  label="Dashboard"
                />
                {role !== "recruiter" && (
                  <MenuLink href="/dashboard/certifications" icon="🏆" label="Certifications" />
                )}
                {role === "recruiter" && (
                  <MenuLink href="/recruiter/search" icon="🔍" label="Recherche" />
                )}
                {(role === "candidate" || !role) && (
                  <MenuLink href="/dashboard/skills" icon="💡" label="Skills" />
                )}
              </div>
            </div>

            {/* Gadgets */}
            <div className="px-3 py-3 border-t border-[#ffffff08]">
              <div className="font-mono text-[10px] text-gray-500 tracking-widest mb-2 px-2">
                ▸ EXTRA
              </div>
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={toggleFocus}
                  className={`flex items-center gap-2 font-mono text-xs rounded-lg px-3 py-2.5 transition ${
                    focusMode
                      ? "text-[#00FF41] bg-[#00FF41]/10"
                      : "text-gray-400 hover:text-white hover:bg-[#0A0A0A]"
                  }`}
                >
                  <span className="text-sm">{focusMode ? "◉" : "○"}</span>
                  <span>Focus {focusMode ? "ON" : "OFF"}</span>
                </button>
                <button
                  onClick={toggleAmbient}
                  className={`flex items-center gap-2 font-mono text-xs rounded-lg px-3 py-2.5 transition ${
                    ambientOn
                      ? "text-[#00e5ff] bg-[#00e5ff]/10"
                      : "text-gray-400 hover:text-white hover:bg-[#0A0A0A]"
                  }`}
                >
                  <span className="text-sm">{ambientOn ? "♪" : "♩"}</span>
                  <span>Son {ambientOn ? "ON" : "OFF"}</span>
                </button>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("cyber:screensaver"))}
                  className="flex items-center gap-2 font-mono text-xs text-gray-400 hover:text-white hover:bg-[#0A0A0A] rounded-lg px-3 py-2.5 transition"
                >
                  <span className="text-sm">▣</span>
                  <span>Écran veille</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-3 py-3 border-t border-[#ffffff08] bg-[#080c14]/60">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 font-mono text-xs text-[#FF3333] hover:text-white hover:bg-[#FF3333]/10 rounded-lg px-3 py-2 transition w-full"
                >
                  <span className="text-sm">⏻</span>
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function MissionItem({
  label,
  done,
  value,
  color,
}: {
  label: string;
  done: boolean;
  value?: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#080c14]/60 hover:bg-[#0A0A0A] transition group">
      <div className="flex items-center gap-2.5">
        <div
          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
            done
              ? `border-transparent text-white`
              : "border-gray-600 group-hover:border-gray-400"
          }`}
          style={done ? { backgroundColor: color } : undefined}
        >
          {done && <span className="text-[10px]">✓</span>}
        </div>
        <span
          className={`font-mono text-xs transition ${
            done ? "text-gray-400 line-through" : "text-gray-300"
          }`}
        >
          {label}
        </span>
      </div>
      {value !== undefined && (
        <span className="font-mono text-[10px] text-gray-500">{value}</span>
      )}
    </div>
  );
}

function MenuLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 font-mono text-xs text-gray-400 hover:text-white hover:bg-[#0A0A0A] rounded-lg px-3 py-2.5 transition"
    >
      <span className="text-sm">{icon}</span>
      {label}
    </Link>
  );
}
