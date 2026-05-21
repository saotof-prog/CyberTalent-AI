"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingRecruiterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    companyName: "",
    phoneNumber: "",
    linkedinUrl: "",
    bio: "",
  });

  async function handleSubmit() {
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding/recruiter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/recruiter/dashboard");
      } else {
        alert("Erreur lors de la création du profil");
      }
    } catch {
      alert("Erreur réseau");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="font-mono text-[#ff4060] text-xl font-bold mb-2">
          // SETUP PROFIL RECRUTEUR
        </div>
        <p className="text-gray-400 font-mono text-sm mb-8">
          Configure ton espace recruteur CyberTalent AI
        </p>

        <div className="bg-[#0d1520] border border-[#ff4060]/20 rounded-xl p-6 flex flex-col gap-4">
          {/* Prénom / Nom */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">Prénom *</label>
              <input
                className="w-full bg-[#111d2e] border border-[#ff4060]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#ff4060]"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                placeholder="Fatou"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">Nom *</label>
              <input
                className="w-full bg-[#111d2e] border border-[#ff4060]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#ff4060]"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder="Diallo"
              />
            </div>
          </div>

          {/* Titre du poste */}
          <div>
            <label className="font-mono text-xs text-gray-400 mb-1 block">Titre du poste</label>
            <input
              className="w-full bg-[#111d2e] border border-[#ff4060]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#ff4060]"
              value={form.jobTitle}
              onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
              placeholder="Head of Talent Acquisition"
            />
          </div>

          {/* Entreprise */}
          <div>
            <label className="font-mono text-xs text-gray-400 mb-1 block">Entreprise</label>
            <input
              className="w-full bg-[#111d2e] border border-[#ff4060]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#ff4060]"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              placeholder="CyberCorp Africa"
            />
          </div>

          {/* Téléphone */}
          <div>
            <label className="font-mono text-xs text-gray-400 mb-1 block">Téléphone</label>
            <input
              className="w-full bg-[#111d2e] border border-[#ff4060]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#ff4060]"
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              placeholder="+221 77 000 00 00"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="font-mono text-xs text-gray-400 mb-1 block">LinkedIn</label>
            <input
              className="w-full bg-[#111d2e] border border-[#ff4060]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#ff4060]"
              value={form.linkedinUrl}
              onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
              placeholder="https://linkedin.com/in/..."
            />
          </div>

          {/* Bio */}
          <div>
            <label className="font-mono text-xs text-gray-400 mb-1 block">Bio</label>
            <textarea
              className="w-full bg-[#111d2e] border border-[#ff4060]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#ff4060] resize-none"
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Je recrute des talents cyber pour..."
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !form.firstName || !form.lastName}
            className="w-full font-mono text-sm font-bold py-3 bg-[#ff4060] text-white rounded-lg hover:bg-[#ff4060]/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Création en cours..." : "Créer mon espace recruteur →"}
          </button>
        </div>
      </div>
    </div>
  );
}