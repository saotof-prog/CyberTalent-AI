import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function LandingPage() {
  const { userId } = await auth();

  if (userId) {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    });

    if (user?.role === "RECRUITER") {
      redirect("/recruiter/dashboard");
    } else {
      redirect("/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-white overflow-x-hidden">

      {/* GRID BACKGROUND */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,200,150,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,150,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />

      {/* NAVBAR */}
      <nav className="relative z-10 flex items-center justify-between px-4 md:px-8 py-5 border-b border-[#00c896]/10 bg-[#080c14]/90 backdrop-blur sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00c896] animate-pulse" />
          <span className="font-mono text-[#00c896] font-bold text-sm">CYBERTALENT_AI</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <span className="font-mono text-xs text-gray-400 hover:text-white cursor-pointer transition">Features</span>
          <span className="font-mono text-xs text-gray-400 hover:text-white cursor-pointer transition">Recruteurs</span>
          <span className="font-mono text-xs text-gray-400 hover:text-white cursor-pointer transition">Candidats</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="font-mono text-xs px-4 py-2 border border-[#00c896]/30 text-[#00c896] rounded-lg hover:bg-[#00c896]/10 transition">
            Connexion
          </Link>
          <Link href="/sign-up" className="font-mono text-xs px-4 py-2 bg-[#00c896] text-black font-bold rounded-lg hover:bg-[#00ff9d] transition">
            Commencer
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 md:px-6 py-20 md:py-32">
        <div className="font-mono text-xs text-[#00c896] border border-[#00c896]/30 px-4 py-2 rounded-full mb-8 bg-[#00c896]/5">
          ⚡ Propulsé par Google Gemini AI
        </div>
        <h1 className="font-mono text-4xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Le recrutement<br />
          <span className="text-[#00c896]">cybersécurité</span><br />
          réinventé
        </h1>
        <p className="text-gray-400 text-base md:text-lg max-w-2xl mb-12 leading-relaxed">
          CyberTalent AI vérifie les vraies compétences, score les profils et connecte
          les meilleurs talents cyber aux entreprises qui en ont besoin.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/sign-up" className="font-mono text-sm px-8 py-4 bg-[#00c896] text-black font-bold rounded-xl hover:bg-[#00ff9d] transition w-full sm:w-auto text-center">
            Créer mon profil 👨‍💻
          </Link>
          <Link href="/sign-up" className="font-mono text-sm px-8 py-4 border border-[#ff4060]/30 text-[#ff4060] rounded-xl hover:bg-[#ff4060]/10 transition w-full sm:w-auto text-center">
            Espace recruteur 🎯
          </Link>
        </div>

        {/* STATS */}
        <div className="flex items-center gap-8 md:gap-12 mt-16 pt-12 border-t border-[#00c896]/10">
          <div className="text-center">
            <div className="font-mono text-2xl md:text-3xl font-bold text-[#00c896]">100%</div>
            <div className="font-mono text-xs text-gray-500 mt-1">Compétences vérifiées</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-2xl md:text-3xl font-bold text-white">IA</div>
            <div className="font-mono text-xs text-gray-500 mt-1">Scoring automatique</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-2xl md:text-3xl font-bold text-[#ff4060]">0</div>
            <div className="font-mono text-xs text-gray-500 mt-1">Fake skills tolérés</div>
          </div>
        </div>
      </section>

      {/* FEATURES CANDIDAT */}
      <section className="relative z-10 px-4 md:px-8 py-16 md:py-20 max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <div className="font-mono text-xs text-[#00c896] mb-4">/ POUR LES CANDIDATS</div>
          <h2 className="font-mono text-2xl md:text-3xl font-bold text-white">Prouve tes vraies compétences</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {[
            { icon: "🏆", title: "Certifications vérifiées", desc: "Upload tes certifications OSCP, CEH, CISSP — l'IA vérifie leur authenticité automatiquement." },
            { icon: "🧪", title: "Labs & CTF", desc: "Ajoute tes machines HackTheBox, TryHackMe et résultats CTF pour prouver ton niveau pratique." },
            { icon: "📊", title: "Score IA 0-100", desc: "Reçois un score basé sur tes vraies preuves. Plus de CV bidon — que des compétences réelles." },
            { icon: "⬡", title: "Sync GitHub", desc: "Connecte ton GitHub pour que l'IA analyse tes repos, contributions et qualité de code." },
            { icon: "🎯", title: "Questions d'interview", desc: "L'IA génère des questions techniques personnalisées pour te préparer aux entretiens." },
            { icon: "🔍", title: "Visibilité recruteurs", desc: "Ton profil est visible des meilleurs recruteurs cyber du monde entier." },
          ].map((f, i) => (
            <div key={i} className="bg-[#0d1520] border border-[#00c896]/10 rounded-xl p-6 hover:border-[#00c896]/30 transition">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-mono text-sm font-bold text-white mb-2">{f.title}</h3>
              <p className="font-mono text-xs text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES RECRUTEUR */}
      <section className="relative z-10 px-4 md:px-8 py-16 md:py-20 bg-[#0d1520]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <div className="font-mono text-xs text-[#ff4060] mb-4">/ POUR LES RECRUTEURS</div>
            <h2 className="font-mono text-2xl md:text-3xl font-bold text-white">Trouve le bon talent en secondes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {[
              { icon: "⚡", title: "Recherche IA naturelle", desc: "Tape ce que tu cherches en langage naturel et l'IA trouve les candidats qui matchent vraiment." },
              { icon: "📈", title: "Ranking par score réel", desc: "Les candidats sont classés par leur score IA basé sur des preuves concrètes, pas des mots-clés." },
              { icon: "🛡️", title: "Zéro fake skills", desc: "L'IA détecte automatiquement les incohérences entre certifications, labs et compétences déclarées." },
              { icon: "✉️", title: "Contact direct", desc: "Contacte directement les candidats qui t'intéressent sans intermédiaire." },
            ].map((f, i) => (
              <div key={i} className="bg-[#080c14] border border-[#ff4060]/10 rounded-xl p-6 hover:border-[#ff4060]/30 transition">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-mono text-sm font-bold text-white mb-2">{f.title}</h3>
                <p className="font-mono text-xs text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative z-10 px-4 md:px-8 py-16 md:py-20 max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <div className="font-mono text-xs text-[#00c896] mb-4">/ COMMENT CA MARCHE</div>
          <h2 className="font-mono text-2xl md:text-3xl font-bold text-white">3 etapes simples</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Cree ton profil", desc: "Inscris-toi et remplis ton profil avec tes certifications, labs et competences." },
            { step: "02", title: "L'IA analyse", desc: "Gemini AI verifie la coherence de ton profil et calcule ton CyberScore en temps reel." },
            { step: "03", title: "Sois decouvert", desc: "Les recruteurs te trouvent via la recherche IA et te contactent directement." },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-mono text-6xl font-bold text-[#00c896]/20 mb-4">{s.step}</div>
              <h3 className="font-mono text-lg font-bold text-white mb-3">{s.title}</h3>
              <p className="font-mono text-xs text-gray-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-4 md:px-8 py-16 md:py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-mono text-3xl md:text-4xl font-bold text-white mb-6">Pret a prouver ton niveau ?</h2>
          <p className="font-mono text-sm text-gray-400 mb-10">
            Rejoins CyberTalent AI et laisse tes vraies competences parler pour toi.
          </p>
          <Link href="/sign-up" className="font-mono text-sm px-10 py-4 bg-[#00c896] text-black font-bold rounded-xl hover:bg-[#00ff9d] transition inline-block">
            Creer mon profil
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-[#00c896]/10 px-4 md:px-8 py-8 text-center">
        <div className="font-mono text-xs text-gray-600">
          © Mouhamed Dia 2026 CyberTalent AI · Propulse par Google Gemini · Fait avec pour la communaute cyber africaine
        </div>
      </footer>

    </div>
  );
}