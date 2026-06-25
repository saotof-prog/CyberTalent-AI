"use client";

import { useState, useEffect, useRef, startTransition } from "react";

type Skill = {
  id: string;
  name: string;
  category: string;
};

type CandidateSkill = {
  skillId: string;
  level: string;
  yearsExp: number | null;
  skill: Skill;
};

const LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];

const LEVEL_COLORS: Record<string, string> = {
  BEGINNER: "text-gray-400 border-gray-600",
  INTERMEDIATE: "text-blue-400 border-blue-600",
  ADVANCED: "text-[#00FF41] border-[#00FF41]/60",
  EXPERT: "text-yellow-400 border-yellow-600",
};

const SUGGESTED_SKILLS = [
  { name: "Penetration Testing", category: "Offensive Security" },
  { name: "Burp Suite", category: "Web Security" },
  { name: "Metasploit", category: "Offensive Security" },
  { name: "Nmap", category: "Network" },
  { name: "Python", category: "Programming" },
  { name: "Bash Scripting", category: "Programming" },
  { name: "Wireshark", category: "Network" },
  { name: "OSINT", category: "Intelligence" },
  { name: "Malware Analysis", category: "Defensive Security" },
  { name: "Incident Response", category: "Defensive Security" },
  { name: "Reverse Engineering", category: "Offensive Security" },
  { name: "CTF", category: "Offensive Security" },
];

export default function SkillsManager() {
  const [mySkills, setMySkills] = useState<CandidateSkill[]>([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Skill[]>([]);
  const [selectedLevel, setSelectedLevel] = useState("BEGINNER");
  const [yearsExp, setYearsExp] = useState("");
  const [adding, setAdding] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/candidate/skills")
      .then((r) => r.json())
      .then(setMySkills);
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      startTransition(() => {
        setResults([]);
      });
      return;
    }
    const t = setTimeout(async () => {
      const res = await fetch("/api/skills/search?q=" + encodeURIComponent(search));
      const data = await res.json();
      startTransition(() => {
        setResults(data);
      });
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  async function addSkill(skillName: string, category = "Autre") {
    setAdding(true);
    try {
      const res = await fetch("/api/candidate/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillName,
          category,
          level: selectedLevel,
          yearsExp: yearsExp ? parseFloat(yearsExp) : null,
        }),
      });

      const data = await res.json();

      if (!data.skill) {
        setAdding(false);
        return;
      }

      setMySkills((prev) => {
        const exists = prev.find((s) => s.skillId === data.skill?.id);
        if (exists) {
          return prev.map((s) =>
            s.skillId === data.skill?.id ? { ...s, level: selectedLevel } : s
          );
        }
        return [...prev, { ...data.candidateSkill, skill: data.skill }];
      });

      setSearch("");
      setResults([]);
    } catch (e) {
      console.error(e);
    }
    setAdding(false);
  }

  async function removeSkill(skillId: string) {
    await fetch("/api/candidate/skills/" + skillId, { method: "DELETE" });
    setMySkills((prev) => prev.filter((s) => s.skillId !== skillId));
  }

  return (
    <div className="bg-[#0d1520] border border-[#00FF41]/20 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-4 bg-[#00FF41] rounded" />
        <span className="font-mono text-sm text-[#00FF41]">SKILLS ({mySkills.length})</span>
      </div>

      {/* MES SKILLS */}
      {mySkills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {mySkills.map((cs) => (
            <div
              key={cs.skillId}
              className={
                "flex items-center gap-2 px-3 py-1.5 rounded-full border bg-[#0A0A0A] " +
                (LEVEL_COLORS[cs.level] ?? LEVEL_COLORS.BEGINNER)
              }
            >
              <span className="font-mono text-xs">{cs.skill?.name ?? cs.skillId}</span>
              <span className="font-mono text-[10px] opacity-60">{cs.level.slice(0, 3)}</span>
              <button
                onClick={() => removeSkill(cs.skillId)}
                className="ml-1 opacity-40 hover:opacity-100 transition text-xs"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* AJOUTER UN SKILL */}
      <div className="border-t border-gray-800 pt-4">
        <p className="font-mono text-xs text-gray-500 mb-3">Ajouter un skill</p>

        <div className="flex flex-col sm:flex-row sm:items-stretch gap-3 mb-3">
          <div className="flex-1 min-w-0 relative">
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher ou taper un skill..."
              className="w-full bg-[#0A0A0A] border border-[#00FF41]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#00FF41]"
            />
            {results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#0A0A0A] border border-[#00FF41]/20 rounded-lg overflow-hidden z-10">
                {results.map((skill) => (
                  <button
                    key={skill.id}
                    onClick={() => addSkill(skill.name, skill.category)}
                    className="w-full text-left px-3 py-2 font-mono text-sm text-white hover:bg-[#00FF41]/10 transition"
                  >
                    {skill.name}
                    <span className="text-xs text-gray-500 ml-2">{skill.category}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-[#0A0A0A] border border-[#00FF41]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none w-full sm:w-auto"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={yearsExp}
              onChange={(e) => setYearsExp(e.target.value)}
              placeholder="Années"
              className="bg-[#0A0A0A] border border-[#00FF41]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none w-full sm:w-24"
            />

            {search.trim() && (
              <button
                onClick={() => addSkill(search.trim())}
                disabled={adding}
                className="font-mono text-xs px-4 py-2 bg-[#00FF41] hover:bg-[#00FF41]/80 text-black rounded-lg transition disabled:opacity-50 font-bold w-full sm:w-auto"
              >
                {adding ? "..." : "+ Ajouter"}
              </button>
            )}
          </div>
        </div>

        {/* SUGGESTIONS */}
        <div>
          <p className="font-mono text-xs text-gray-600 mb-2">Suggestions cyber :</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_SKILLS.filter((s) => !mySkills.find((ms) => ms.skill?.name === s.name))
              .slice(0, 8)
              .map((s) => (
                <button
                  key={s.name}
                  onClick={() => addSkill(s.name, s.category)}
                  className="font-mono text-xs px-3 py-1 rounded-full border border-gray-700 text-gray-400 hover:border-[#00FF41]/40 hover:text-[#00FF41] transition"
                >
                  + {s.name}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
