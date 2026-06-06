"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CertificationUpload() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    fullName: "",
    issuer: "",
    issuedAt: "",
    expiresAt: "",
    credentialUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit() {
    if (!form.name || !form.issuer || !form.issuedAt) {
      alert("Remplis les champs obligatoires !");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/certifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, fileUrl: null }),
      });

      if (!res.ok) throw new Error("Erreur");

      setDone(true);
      setForm({ name: "", fullName: "", issuer: "", issuedAt: "", expiresAt: "", credentialUrl: "" });
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
        <div className="w-1 h-4 bg-[#00c896] rounded" />
        <span className="font-mono text-sm text-[#00c896]">AJOUTER UNE CERTIFICATION</span>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="font-mono text-xs text-gray-400 mb-1 block">Sigle * (ex: OSCP)</label>
            <input
              className="w-full bg-[#111d2e] border border-[#00c896]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#00c896]"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              placeholder="OSCP"
            />
          </div>
          <div>
            <label className="font-mono text-xs text-gray-400 mb-1 block">Nom complet</label>
            <input
              className="w-full bg-[#111d2e] border border-[#00c896]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#00c896]"
              value={form.fullName}
              onChange={e => setForm({...form, fullName: e.target.value})}
              placeholder="Offensive Security Certified Professional"
            />
          </div>
        </div>

        <div>
          <label className="font-mono text-xs text-gray-400 mb-1 block">Organisme *</label>
          <input
            className="w-full bg-[#111d2e] border border-[#00c896]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#00c896]"
            value={form.issuer}
            onChange={e => setForm({...form, issuer: e.target.value})}
            placeholder="Offensive Security"
          />
        </div>

        <div>
          <label className="font-mono text-xs text-gray-400 mb-1 block">Lien de vérification</label>
          <input
            className="w-full bg-[#111d2e] border border-[#00c896]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#00c896]"
            value={form.credentialUrl}
            onChange={e => setForm({...form, credentialUrl: e.target.value})}
            placeholder="https://www.credly.com/badges/..."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="font-mono text-xs text-gray-400 mb-1 block">Date d&apos;obtention *</label>
            <input
              type="date"
              className="w-full bg-[#111d2e] border border-[#00c896]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#00c896]"
              value={form.issuedAt}
              onChange={e => setForm({...form, issuedAt: e.target.value})}
            />
          </div>
          <div>
            <label className="font-mono text-xs text-gray-400 mb-1 block">Date d&apos;expiration</label>
            <input
              type="date"
              className="w-full bg-[#111d2e] border border-[#00c896]/20 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#00c896]"
              value={form.expiresAt}
              onChange={e => setForm({...form, expiresAt: e.target.value})}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || done}
          className="w-full font-mono text-sm font-bold py-3 bg-[#00c896] text-black rounded-lg hover:bg-[#00ff9d] transition disabled:opacity-50"
        >
          {done ? "✓ Certification ajoutée !" : loading ? "Ajout en cours..." : "Ajouter la certification →"}
        </button>
      </div>
    </div>
  );
}