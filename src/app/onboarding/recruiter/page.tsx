"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RecruiterOnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  async function handleSubmit() {
    if (!form.firstName || !form.lastName || !form.companyName) {
      alert("Remplis les champs obligatoires !");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/onboarding/recruiter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Erreur");
      router.push("/recruiter/dashboard");
    } catch (e) {
      alert("Erreur lors de la création du profil");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#ff4060] animate-pulse" />
            <span className="font-mono text-[#ff4060] font-bold text-sm">CYBERTALENT_RECRUITER</span>
          </div>
          <h1 className="font-mono text-2xl font-bold text-white mb-2">
            Setup ton profil <span className="text-[#ff4060]">Recruteur</span>
          </h1>
          <p className="font-mono text-xs text-gray-400">
            Configure ton espace pour trouver les meilleurs talents cyber
          </p>
        </div>

        <div className="bg-[#0d1520] border border-[#ff4060]/20 rounded-xl p-6 flex flex-col gap-4">

          {/* Nom */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">Prénom *</label>
              <input
                className="w-full bg-[#111d2e] border border-[#ff4060]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#ff4060]"
                value={form.firstName}
                onChange={e => setForm({...form, firstName: e.target.value})}
                placeholder="Mariam"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">Nom *</label>
              <input
                className="w-full bg-[#111d2e] border border-[#ff4060]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#ff4060]"
                value={form.lastName}
                onChange={e => setForm({...form, lastName: e.target.value})}
                placeholder="Diop"
              />
            </div>
          </div>

          {/* Titre */}
          <div>
            <label className="font-mono text-xs text-gray-400 mb-1 block">Titre du poste</label>
            <input
              className="w-full bg-[#111d2e] border border-[#ff4060]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#ff4060]"
              value={form.jobTitle}
              onChange={e => setForm({...form, jobTitle: e.target.value})}
              placeholder="Head of Talent Acquisition"
            />
          </div>

          {/* Entreprise */}
          <div>
            <label className="font-mono text-xs text-gray-400 mb-1 block">Entreprise *</label>
            <input
              className="w-full bg-[#111d2e] border border-[#ff4060]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#ff4060]"
              value={form.companyName}
              onChange={e => setForm({...form, companyName: e.target.value})}
              placeholder="SecureCorp"
            />
          </div>

          {/* Taille + Secteur */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">Taille entreprise</label>
              <select
                className="w-full bg-[#111d2e] border border-[#ff4060]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none"
                value={form.companySize}
                onChange={e => setForm({...form, companySize: e.target.value})}
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
                className="w-full bg-[#111d2e] border border-[#ff4060]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none"
                value={form.companyIndustry}
                onChange={e => setForm({...form, companyIndustry: e.target.value})}
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

          {/* Téléphone */}
          <div>
            <label className="font-mono text-xs text-gray-400 mb-1 block">Téléphone</label>
            <input
              className="w-full bg-[#111d2e] border border-[#ff4060]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#ff4060]"
              value={form.phoneNumber}
              onChange={e => setForm({...form, phoneNumber: e.target.value})}
              placeholder="+221 77 000 00 00"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="font-mono text-xs text-gray-400 mb-1 block">LinkedIn</label>
            <input
              className="w-full bg-[#111d2e] border border-[#ff4060]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#ff4060]"
              value={form.linkedinUrl}
              onChange={e => setForm({...form, linkedinUrl: e.target.value})}
              placeholder="https://linkedin.com/in/..."
            />
          </div>

          {/* Bouton */}
          <button
            onClick={handleSubmit}
            disabled={loading || !form.firstName || !form.lastName || !form.companyName}
            className="w-full font-mono text-sm font-bold py-3 bg-[#ff4060] text-white rounded-lg hover:bg-[#ff2040] transition disabled:opacity-50"
          >
            {loading ? "Création en cours..." : "Accéder au dashboard recruteur →"}
          </button>
        </div>
      </div>
    </div>
  );
}