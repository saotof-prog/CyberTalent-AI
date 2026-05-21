"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    headline: "",
    location: "",
    country: "",
    githubUsername: "",
    bio: "",
  });

  async function handleSubmit() {
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/dashboard");
      } else {
        alert("Erreur lors de la création du profil");
      }
    } catch (e) {
      alert("Erreur réseau");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="font-mono text-[#00c896] text-xl font-bold mb-2">// SETUP PROFIL</div>
        <p className="text-gray-400 font-mono text-sm mb-8">Configure ton profil CyberTalent AI</p>

        <div className="bg-[#0d1520] border border-[#00c896]/20 rounded-xl p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">Prénom *</label>
              <input
                className="w-full bg-[#111d2e] border border-[#00c896]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#00c896]"
                value={form.firstName}
                onChange={e => setForm({...form, firstName: e.target.value})}
                placeholder="Amine"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">Nom *</label>
              <input
                className="w-full bg-[#111d2e] border border-[#00c896]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#00c896]"
                value={form.lastName}
                onChange={e => setForm({...form, lastName: e.target.value})}
                placeholder="Koné"
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-xs text-gray-400 mb-1 block">Titre professionnel</label>
            <input
              className="w-full bg-[#111d2e] border border-[#00c896]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#00c896]"
              value={form.headline}
              onChange={e => setForm({...form, headline: e.target.value})}
              placeholder="Penetration Tester | OSCP"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">Ville</label>
              <input
                className="w-full bg-[#111d2e] border border-[#00c896]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#00c896]"
                value={form.location}
                onChange={e => setForm({...form, location: e.target.value})}
                placeholder="Dakar"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">Pays</label>
              <input
                className="w-full bg-[#111d2e] border border-[#00c896]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#00c896]"
                value={form.country}
                onChange={e => setForm({...form, country: e.target.value})}
                placeholder="SN"
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-xs text-gray-400 mb-1 block">GitHub username</label>
            <input
              className="w-full bg-[#111d2e] border border-[#00c896]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#00c896]"
              value={form.githubUsername}
              onChange={e => setForm({...form, githubUsername: e.target.value})}
              placeholder="aminekone"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-gray-400 mb-1 block">Bio</label>
            <textarea
              className="w-full bg-[#111d2e] border border-[#00c896]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#00c896] resize-none"
              rows={3}
              value={form.bio}
              onChange={e => setForm({...form, bio: e.target.value})}
              placeholder="Passionné de cybersécurité offensive..."
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !form.firstName || !form.lastName}
            className="w-full font-mono text-sm font-bold py-3 bg-[#00c896] text-black rounded-lg hover:bg-[#00ff9d] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Création en cours..." : "Créer mon profil →"}
          </button>
        </div>
      </div>
    </div>
  );
}