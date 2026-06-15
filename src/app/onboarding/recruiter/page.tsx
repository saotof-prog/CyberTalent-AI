"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RecruiterOnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    companyName: "",
    companySize: "",
    companyIndustry: "",
    phoneNumber: "",
    linkedinUrl: "",
  });

  function validate() {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "Requis";
    if (!form.lastName.trim()) e.lastName = "Requis";
    if (!form.companyName.trim()) e.companyName = "Requis";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      const res = await fetch("/api/onboarding/recruiter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/recruiter/dashboard");
      } else {
        const data = await res.json();
        setErrors({ submit: data.error || "Erreur" });
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
    `w-full bg-[#111d2e] border ${errors[field] ? "border-[#ff4060]" : "border-[#ff4060]/20"} rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#ff4060]`;

  return (
    <div className="min-h-screen bg-[#080c14] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#ff4060] animate-pulse" />
            <span className="font-mono text-[#ff4060] font-bold text-sm">
              CYBERTALENT_RECRUITER
            </span>
          </div>
          <h1 className="font-mono text-2xl font-bold text-white mb-2">
            Setup ton profil <span className="text-[#ff4060]">Recruteur</span>
          </h1>
          <p className="font-mono text-xs text-gray-400">
            Configure ton espace pour trouver les meilleurs talents cyber
          </p>
        </div>

        <div className="bg-[#0d1520] border border-[#ff4060]/20 rounded-xl p-6 flex flex-col gap-4">
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
                placeholder="Mariam"
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
                placeholder="Diop"
              />
              {errors.lastName && (
                <p className="font-mono text-[10px] text-[#ff4060] mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="font-mono text-xs text-gray-400 mb-1 block">Titre du poste</label>
            <input
              className={inputClass("jobTitle")}
              value={form.jobTitle}
              onChange={(e) => update("jobTitle", e.target.value)}
              placeholder="Head of Talent Acquisition"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-gray-400 mb-1 block">Entreprise *</label>
            <input
              className={inputClass("companyName")}
              value={form.companyName}
              onChange={(e) => update("companyName", e.target.value)}
              placeholder="SecureCorp"
            />
            {errors.companyName && (
              <p className="font-mono text-[10px] text-[#ff4060] mt-1">{errors.companyName}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">
                Taille entreprise
              </label>
              <select
                className={inputClass("companySize")}
                value={form.companySize}
                onChange={(e) => update("companySize", e.target.value)}
              >
                <option value="">Choisir...</option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="201-500">201-500</option>
                <option value="500+">500+</option>
              </select>
            </div>
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">Secteur</label>
              <select
                className={inputClass("companyIndustry")}
                value={form.companyIndustry}
                onChange={(e) => update("companyIndustry", e.target.value)}
              >
                <option value="">Choisir...</option>
                <option value="Cybersécurité">Cybersécurité</option>
                <option value="Finance">Finance</option>
                <option value="Télécoms">Télécoms</option>
                <option value="Gouvernement">Gouvernement</option>
                <option value="Santé">Santé</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-mono text-xs text-gray-400 mb-1 block">Téléphone</label>
            <input
              className={inputClass("phoneNumber")}
              value={form.phoneNumber}
              onChange={(e) => update("phoneNumber", e.target.value)}
              placeholder="+221 77 000 00 00"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-gray-400 mb-1 block">LinkedIn</label>
            <input
              className={inputClass("linkedinUrl")}
              value={form.linkedinUrl}
              onChange={(e) => update("linkedinUrl", e.target.value)}
              placeholder="https://linkedin.com/in/..."
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full font-mono text-sm font-bold py-3 bg-[#ff4060] text-white rounded-lg hover:bg-[#ff2040] transition disabled:opacity-50"
          >
            {loading ? "Création en cours..." : "Accéder au dashboard recruteur →"}
          </button>
        </div>
      </div>
    </div>
  );
}
