"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    headline: "",
    location: "",
    country: "",
    githubUsername: "",
    bio: "",
  });

  function validate() {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "Requis";
    if (!form.lastName.trim()) e.lastName = "Requis";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/dashboard");
      } else {
        const data = await res.json();
        setErrors({ submit: data.error || "Erreur lors de la création" });
      }
    } catch {
      setErrors({ submit: "Erreur réseau" });
    }
    setLoading(false);
  }

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field])
      setErrors((prev) => {
        const n = { ...prev };
        delete n[field];
        return n;
      });
  }

  const inputClass = (field: string) =>
    `w-full bg-[#111d2e] border ${errors[field] ? "border-[#ff4060]" : "border-[#00c896]/20"} rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#00c896]`;

  return (
    <div className="min-h-screen bg-[#080c14] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="font-mono text-[#00c896] text-xl font-bold mb-2">{"// SETUP PROFIL"}</div>
        <p className="text-gray-400 font-mono text-sm mb-8">Configure ton profil CyberTalent AI</p>

        <div className="bg-[#0d1520] border border-[#00c896]/20 rounded-xl p-6 flex flex-col gap-4">
          {errors.submit && (
            <div className="font-mono text-xs text-[#ff4060] bg-[#ff4060]/10 border border-[#ff4060]/30 rounded-lg px-3 py-2">
              {errors.submit}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">Prénom *</label>
              <input
                className={inputClass("firstName")}
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                placeholder="Amine"
              />
              {errors.firstName && (
                <p className="font-mono text-[10px] text-[#ff4060] mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">Nom *</label>
              <input
                className={inputClass("lastName")}
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                placeholder="Koné"
              />
              {errors.lastName && (
                <p className="font-mono text-[10px] text-[#ff4060] mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="font-mono text-xs text-gray-400 mb-1 block">
              Titre professionnel
            </label>
            <input
              className={inputClass("headline")}
              value={form.headline}
              onChange={(e) => update("headline", e.target.value)}
              placeholder="Penetration Tester | OSCP"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">Ville</label>
              <input
                className={inputClass("location")}
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                placeholder="Dakar"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">Pays</label>
              <input
                className={inputClass("country")}
                value={form.country}
                onChange={(e) => update("country", e.target.value)}
                placeholder="SN"
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-xs text-gray-400 mb-1 block">GitHub username</label>
            <input
              className={inputClass("githubUsername")}
              value={form.githubUsername}
              onChange={(e) => update("githubUsername", e.target.value)}
              placeholder="aminekone"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-gray-400 mb-1 block">Bio</label>
            <textarea
              className={`${inputClass("bio")} resize-none`}
              rows={3}
              value={form.bio}
              onChange={(e) => update("bio", e.target.value)}
              placeholder="Passionné de cybersécurité offensive..."
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full font-mono text-sm font-bold py-3 bg-[#00c896] text-black rounded-lg hover:bg-[#00ff9d] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Création en cours..." : "Créer mon profil →"}
          </button>
        </div>
      </div>
    </div>
  );
}
