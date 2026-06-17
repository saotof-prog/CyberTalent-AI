"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    headline: "",
    bio: "",
    location: "",
    country: "",
    timezone: "",
    phoneNumber: "",
    website: "",
    linkedinUrl: "",
    twitterUrl: "",
    githubUsername: "",
    isAvailable: true,
    salaryMin: "",
    salaryMax: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/candidate/profile");
        const data = await res.json();
        if (res.ok && data.profile) {
          const p = data.profile;
          setForm({
            firstName: p.firstName ?? "",
            lastName: p.lastName ?? "",
            headline: p.headline ?? "",
            bio: p.bio ?? "",
            location: p.location ?? "",
            country: p.country ?? "",
            timezone: p.timezone ?? "",
            phoneNumber: p.phoneNumber ?? "",
            website: p.website ?? "",
            linkedinUrl: p.linkedinUrl ?? "",
            twitterUrl: p.twitterUrl ?? "",
            githubUsername: p.githubUsername ?? "",
            isAvailable: p.isAvailable ?? true,
            salaryMin: p.salaryMin?.toString() ?? "",
            salaryMax: p.salaryMax?.toString() ?? "",
          });
        }
      } catch {}
    }
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const payload = {
        ...form,
        salaryMin: form.salaryMin ? parseInt(form.salaryMin) : null,
        salaryMax: form.salaryMax ? parseInt(form.salaryMax) : null,
      };
      const res = await fetch("/api/candidate/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setMessage("✓ Profil mis à jour");
        router.refresh();
      } else {
        const err = await res.json();
        setMessage(`✗ ${err.error}`);
      }
    } catch {
      setMessage("✗ Erreur réseau");
    }
    setLoading(false);
    setTimeout(() => setMessage(null), 4000);
  }

  function update(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const inputClass =
    "bg-[#111d2e] border border-[#ff4060]/30 rounded-lg px-3 py-2 font-mono text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ff4060] w-full";

  return (
    <div className="min-h-screen bg-[#080c14] text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="font-mono text-xs text-[#00c896] hover:underline mb-4 inline-block"
          >
            ← Retour
          </button>
          <h1 className="font-mono text-2xl font-bold text-white mb-1">
            Modifier mon <span className="text-[#00c896]">Profil</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">Prénom *</label>
              <input
                className={inputClass}
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">Nom *</label>
              <input
                className={inputClass}
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-xs text-gray-400 mb-1 block">Titre / Headline</label>
            <input
              className={inputClass}
              value={form.headline}
              onChange={(e) => update("headline", e.target.value)}
              placeholder="Penetration Tester | OSCP"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-gray-400 mb-1 block">Bio</label>
            <textarea
              className={`${inputClass} min-h-[80px]`}
              value={form.bio}
              onChange={(e) => update("bio", e.target.value)}
              placeholder="Parle de ton parcours..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">Localisation</label>
              <input
                className={inputClass}
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                placeholder="Dakar"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">Pays</label>
              <input
                className={inputClass}
                value={form.country}
                onChange={(e) => update("country", e.target.value)}
                placeholder="SN"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">GitHub</label>
              <input
                className={inputClass}
                value={form.githubUsername}
                onChange={(e) => update("githubUsername", e.target.value)}
                placeholder="username"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">Site web</label>
              <input
                className={inputClass}
                value={form.website}
                onChange={(e) => update("website", e.target.value)}
                placeholder="https://"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">LinkedIn</label>
              <input
                className={inputClass}
                value={form.linkedinUrl}
                onChange={(e) => update("linkedinUrl", e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">Twitter / X</label>
              <input
                className={inputClass}
                value={form.twitterUrl}
                onChange={(e) => update("twitterUrl", e.target.value)}
                placeholder="https://x.com/..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">Téléphone</label>
              <input
                className={inputClass}
                value={form.phoneNumber}
                onChange={(e) => update("phoneNumber", e.target.value)}
                placeholder="+221..."
              />
            </div>
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">Timezone</label>
              <input
                className={inputClass}
                value={form.timezone}
                onChange={(e) => update("timezone", e.target.value)}
                placeholder="Africa/Dakar"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">
                Salaire min (USD/mois)
              </label>
              <input
                type="number"
                className={inputClass}
                value={form.salaryMin}
                onChange={(e) => update("salaryMin", e.target.value)}
                placeholder="2000"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-gray-400 mb-1 block">
                Salaire max (USD/mois)
              </label>
              <input
                type="number"
                className={inputClass}
                value={form.salaryMax}
                onChange={(e) => update("salaryMax", e.target.value)}
                placeholder="5000"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="available"
              checked={form.isAvailable}
              onChange={(e) => update("isAvailable", e.target.checked)}
              className="accent-[#00c896]"
            />
            <label htmlFor="available" className="font-mono text-sm text-gray-300">
              Disponible pour des opportunités
            </label>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="font-mono text-sm px-6 py-3 bg-[#00c896] text-[#080c14] font-bold rounded-lg hover:bg-[#00b884] transition disabled:opacity-50"
            >
              {loading ? "⏳ Sauvegarde..." : "💾 Sauvegarder"}
            </button>
            {message && <span className="font-mono text-xs text-gray-400">{message}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
