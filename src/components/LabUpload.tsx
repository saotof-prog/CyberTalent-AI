"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const PLATFORMS = ["HACKTHEBOX", "TRYHACKME", "VULNHUB", "PWNEDLABS", "PORTSWIGGER", "CUSTOM"];
const DIFFICULTIES = ["EASY", "MEDIUM", "HARD", "INSANE"];

export default function LabUpload() {
  const router = useRouter();
  const [form, setForm] = useState({
    platform: "HACKTHEBOX",
    labName: "",
    difficulty: "MEDIUM",
    category: "",
    completedAt: "",
    proofUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit() {
    if (!form.labName || !form.completedAt) {
      alert("Remplis les champs obligatoires !");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/labs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Erreur");

      setDone(true);
      setForm({ platform: "HACKTHEBOX", labName: "", difficulty: "MEDIUM", category: "", completedAt: "", proofUrl: "" });
      setTimeout(() => {
        setDone(false);
        router.refresh();
      }, 1500);
    } catch {
      alert("Erreur lors de l'ajout");
    }
    setLoading(false);
  }

  return (
    <div className="bg-[#0d1520] border border-[#00c896]/20 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-4 bg-[#0084ff] rounded" />
        <span className="font-mono text-sm text-[#0084ff]">AJOUTER UN LAB COMPLÉTÉ</span>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="font-mono text-xs text-gray-400 mb-1 block">Plateforme *</label>
            <select
              className="w-full bg-[#111d2e] border border-[#00c896]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#00c896]"
              value={form.platform}
              onChange={e => setForm({...form, platform: e.target.value})}
            >
              {PLATFORMS.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-mono text-xs text-gray-400 mb-1 block">Difficulté *</label>
            <select
              className="w-full bg-[#111d2e] border border-[#00c896]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#00c896]"
              value={form.difficulty}
              onChange={e => setForm({...form, difficulty: e.target.value})}
            >
              {DIFFICULTIES.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="font-mono text-xs text-gray-400 mb-1 block">Nom du lab * (ex: Lame, Blue, Inject)</label>
          <input
            className="w-full bg-[#111d2e] border border-[#00c896]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#00c896]"
            value={form.labName}
            onChange={e => setForm({...form, labName: e.target.value})}
            placeholder="Lame"
          />
        </div>

        <div>
          <label className="font-mono text-xs text-gray-400 mb-1 block">Catégorie (ex: Linux, Web, Windows)</label>
          <input
            className="w-full bg-[#111d2e] border border-[#00c896]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#00c896]"
            value={form.category}
            onChange={e => setForm({...form, category: e.target.value})}
            placeholder="Linux"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="font-mono text-xs text-gray-400 mb-1 block">Date de complétion *</label>
            <input
              type="date"
              className="w-full bg-[#111d2e] border border-[#00c896]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#00c896]"
              value={form.completedAt}
              onChange={e => setForm({...form, completedAt: e.target.value})}
            />
          </div>
          <div>
            <label className="font-mono text-xs text-gray-400 mb-1 block">Lien preuve (screenshot/writeup)</label>
            <input
              className="w-full bg-[#111d2e] border border-[#00c896]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#00c896]"
              value={form.proofUrl}
              onChange={e => setForm({...form, proofUrl: e.target.value})}
              placeholder="https://..."
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || done}
          className="w-full font-mono text-sm font-bold py-3 bg-[#0084ff] text-white rounded-lg hover:bg-[#0094ff] transition disabled:opacity-50"
        >
          {done ? "✓ Lab ajouté !" : loading ? "Ajout en cours..." : "Ajouter le lab →"}
        </button>
      </div>
    </div>
  );
}