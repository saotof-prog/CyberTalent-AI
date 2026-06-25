"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast";

export default function CreateJobPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    country: "",
    type: "FULL_TIME",
    mode: "REMOTE",
    salaryMin: "",
    salaryMax: "",
    minScore: "",
    isUrgent: false,
    tags: "",
  });

  async function handleSubmit() {
    if (!form.title || !form.description) {
      toast("Remplis les champs obligatoires !", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          salaryMin: form.salaryMin ? parseInt(form.salaryMin) : null,
          salaryMax: form.salaryMax ? parseInt(form.salaryMax) : null,
          minScore: form.minScore ? parseInt(form.minScore) : null,
          tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
        }),
      });

      if (!res.ok) throw new Error("Erreur");
      router.push("/recruiter/jobs");
      router.refresh();
    } catch {
      toast("Erreur lors de la création", "error");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="font-mono text-2xl font-bold text-white mb-1">
            Publier une <span className="text-[#FF3333]">offre demploi</span>
          </h1>
          <p className="font-mono text-xs text-gray-400">
            L IA matchera automatiquement les meilleurs candidats
          </p>
        </div>

        <div className="bg-[#0d1520] border border-[#FF3333]/20 rounded-xl p-6 flex flex-col gap-4">
          {/* Titre */}
          <div>
            <label className="font-mono text-xs text-gray-400 mb-1 block">Titre du poste *</label>
            <input
              className="w-full bg-[#0A0A0A] border border-[#FF3333]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#FF3333]"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Senior Penetration Tester"
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-mono text-xs text-gray-400 mb-1 block">Description *</label>
            <textarea
              className="w-full bg-[#0A0A0A] border border-[#FF3333]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#FF3333] resize-none"
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Décris le poste, les responsabilités..."
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="font-mono text-xs text-gray-400 mb-1 block">Prérequis</label>
            <textarea
              className="w-full bg-[#0A0A0A] border border-[#FF3333]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#FF3333] resize-none"
              rows={3}
              value={form.requirements}
              onChange={(e) => setForm({ ...form, requirements: e.target.value })}
              placeholder="OSCP obligatoire, 3+ ans d'expérience..."
            />
          </div>

          {/* Type + Mode */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">Type de contrat</label>
              <select
                className="w-full bg-[#0A0A0A] border border-[#FF3333]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="FULL_TIME">Temps plein</option>
                <option value="PART_TIME">Temps partiel</option>
                <option value="CONTRACT">Contrat</option>
                <option value="FREELANCE">Freelance</option>
                <option value="INTERNSHIP">Stage</option>
              </select>
            </div>
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">Mode de travail</label>
              <select
                className="w-full bg-[#0A0A0A] border border-[#FF3333]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none"
                value={form.mode}
                onChange={(e) => setForm({ ...form, mode: e.target.value })}
              >
                <option value="REMOTE">Remote</option>
                <option value="ONSITE">Présentiel</option>
                <option value="HYBRID">Hybride</option>
              </select>
            </div>
          </div>

          {/* Localisation */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">Ville</label>
              <input
                className="w-full bg-[#0A0A0A] border border-[#FF3333]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#FF3333]"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Dakar"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">Pays</label>
              <input
                className="w-full bg-[#0A0A0A] border border-[#FF3333]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#FF3333]"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                placeholder="SN"
              />
            </div>
          </div>

          {/* Salaire */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">
                Salaire min (USD/mois)
              </label>
              <input
                type="number"
                className="w-full bg-[#0A0A0A] border border-[#FF3333]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#FF3333]"
                value={form.salaryMin}
                onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
                placeholder="3000"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">
                Salaire max (USD/mois)
              </label>
              <input
                type="number"
                className="w-full bg-[#0A0A0A] border border-[#FF3333]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#FF3333]"
                value={form.salaryMax}
                onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
                placeholder="6000"
              />
            </div>
          </div>

          {/* Score min + Urgent */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">Score IA minimum</label>
              <input
                type="number"
                className="w-full bg-[#0A0A0A] border border-[#FF3333]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#FF3333]"
                value={form.minScore}
                onChange={(e) => setForm({ ...form, minScore: e.target.value })}
                placeholder="70"
                min="0"
                max="100"
              />
            </div>
            <div className="flex items-center gap-3 mt-5">
              <input
                type="checkbox"
                id="urgent"
                checked={form.isUrgent}
                onChange={(e) => setForm({ ...form, isUrgent: e.target.checked })}
                className="w-4 h-4 accent-[#FF3333]"
              />
              <label htmlFor="urgent" className="font-mono text-xs text-gray-400 cursor-pointer">
                Offre urgente 🔥
              </label>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="font-mono text-xs text-gray-400 mb-1 block">
              Tags (séparés par des virgules)
            </label>
            <input
              className="w-full bg-[#0A0A0A] border border-[#FF3333]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#FF3333]"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="pentest, OSCP, red team, senior"
            />
          </div>

          {/* Bouton */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full font-mono text-sm font-bold py-3 bg-[#FF3333] text-white rounded-lg hover:bg-[#ff2040] transition disabled:opacity-50"
          >
            {loading ? "Publication en cours..." : "🚀 Publier l'offre →"}
          </button>
        </div>
      </div>
    </div>
  );
}
