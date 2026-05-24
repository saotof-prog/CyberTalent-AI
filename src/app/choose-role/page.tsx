"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ChooseRolePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<"CANDIDATE" | "RECRUITER" | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    if (!selected) return;
    setLoading(true);

    await fetch("/api/choose-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: selected }),
    });

    if (selected === "CANDIDATE") {
      router.push("/onboarding");
    } else {
      router.push("/onboarding/recruiter");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#00c896] animate-pulse" />
            <span className="font-mono text-[#00c896] font-bold text-sm">CYBERTALENT_AI</span>
          </div>
          <h1 className="font-mono text-3xl font-bold text-white mb-3">
            Bienvenue ! Tu es...
          </h1>
          <p className="font-mono text-sm text-gray-400">
            Choisis ton rôle pour personnaliser ton expérience
          </p>
        </div>

        {/* CHOIX */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* CANDIDAT */}
          <div
            onClick={() => setSelected("CANDIDATE")}
            className={`cursor-pointer rounded-2xl p-8 border-2 transition-all ${
              selected === "CANDIDATE"
                ? "border-[#00c896] bg-[#00c896]/10"
                : "border-[#00c896]/20 bg-[#0d1520] hover:border-[#00c896]/50"
            }`}
          >
            <div className="text-5xl mb-4 text-center">👨‍💻</div>
            <h2 className="font-mono text-xl font-bold text-white text-center mb-3">
              Candidat
            </h2>
            <p className="font-mono text-xs text-gray-400 text-center leading-relaxed">
              Je cherche un emploi en cybersécurité et je veux mettre en valeur mes compétences réelles
            </p>
            <div className="mt-6 flex flex-col gap-2">
              {["Upload certifications", "Ajouter mes labs", "Score IA 0-100", "Être découvert"].map((f) => (
                <div key={f} className="flex items-center gap-2 font-mono text-xs text-gray-400">
                  <span className="text-[#00c896]">✓</span> {f}
                </div>
              ))}
            </div>
            {selected === "CANDIDATE" && (
              <div className="mt-4 text-center font-mono text-xs text-[#00c896] font-bold">
                ✓ Sélectionné
              </div>
            )}
          </div>

          {/* RECRUTEUR */}
          <div
            onClick={() => setSelected("RECRUITER")}
            className={`cursor-pointer rounded-2xl p-8 border-2 transition-all ${
              selected === "RECRUITER"
                ? "border-[#ff4060] bg-[#ff4060]/10"
                : "border-[#ff4060]/20 bg-[#0d1520] hover:border-[#ff4060]/50"
            }`}
          >
            <div className="text-5xl mb-4 text-center">🎯</div>
            <h2 className="font-mono text-xl font-bold text-white text-center mb-3">
              Recruteur
            </h2>
            <p className="font-mono text-xs text-gray-400 text-center leading-relaxed">
              Je recrute des talents cyber et je veux trouver les meilleurs candidats rapidement
            </p>
            <div className="mt-6 flex flex-col gap-2">
              {["Recherche IA", "Voir les vrais skills", "Ranking par score", "Publier des offres"].map((f) => (
                <div key={f} className="flex items-center gap-2 font-mono text-xs text-gray-400">
                  <span className="text-[#ff4060]">✓</span> {f}
                </div>
              ))}
            </div>
            {selected === "RECRUITER" && (
              <div className="mt-4 text-center font-mono text-xs text-[#ff4060] font-bold">
                ✓ Sélectionné
              </div>
            )}
          </div>
        </div>

        {/* BOUTON CONFIRMER */}
        <button
          onClick={handleConfirm}
          disabled={!selected || loading}
          className={`w-full font-mono text-sm font-bold py-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed ${
            selected === "RECRUITER"
              ? "bg-[#ff4060] text-white hover:bg-[#ff2040]"
              : "bg-[#00c896] text-black hover:bg-[#00ff9d]"
          }`}
        >
          {loading ? "Chargement..." : selected ? `Continuer comme ${selected === "CANDIDATE" ? "Candidat" : "Recruteur"} →` : "Choisis ton rôle"}
        </button>
      </div>
    </div>
  );
}