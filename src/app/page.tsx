import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CyberBackground from "@/components/cyber-background";
import LandingNav from "@/components/landing-nav";
import AnimatedCounter from "@/components/animated-counter";

const CANDIDATE_FEATURES = [
  {
    icon: "🏆",
    title: "Certifications vérifiées",
    desc: "Upload tes certifications OSCP, CEH, CISSP — l'IA vérifie leur authenticité automatiquement.",
  },
  {
    icon: "🧪",
    title: "Labs & CTF",
    desc: "Ajoute tes machines HackTheBox, TryHackMe et résultats CTF pour prouver ton niveau pratique.",
  },
  {
    icon: "📊",
    title: "Score IA 0-100",
    desc: "Reçois un score basé sur tes vraies preuves. Plus de CV bidon — que des compétences réelles.",
  },
  {
    icon: "⬡",
    title: "Sync GitHub",
    desc: "Connecte ton GitHub pour que l'IA analyse tes repos, contributions et qualité de code.",
  },
  {
    icon: "🎯",
    title: "Questions d'interview",
    desc: "L'IA génère des questions techniques personnalisées pour te préparer aux entretiens.",
  },
  {
    icon: "🔍",
    title: "Visibilité recruteurs",
    desc: "Ton profil est visible des meilleurs recruteurs cyber du monde entier.",
  },
];

const RECRUITER_FEATURES = [
  {
    icon: "⚡",
    title: "Recherche IA naturelle",
    desc: "Tape ce que tu cherches en langage naturel et l'IA trouve les candidats qui matchent vraiment.",
  },
  {
    icon: "📈",
    title: "Ranking par score réel",
    desc: "Les candidats sont classés par leur score IA basé sur des preuves concrètes, pas des mots-clés.",
  },
  {
    icon: "🛡️",
    title: "Zéro fake skills",
    desc: "L'IA détecte automatiquement les incohérences entre certifications, labs et compétences déclarées.",
  },
  {
    icon: "✉️",
    title: "Contact direct",
    desc: "Contacte directement les candidats qui t'intéressent sans intermédiaire.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Crée ton profil",
    desc: "Inscris-toi et remplis ton profil avec tes certifications, labs et compétences.",
  },
  {
    step: "02",
    title: "L'IA analyse",
    desc: "Gemini AI vérifie la cohérence de ton profil et calcule ton CyberScore en temps réel.",
  },
  {
    step: "03",
    title: "Sois découvert",
    desc: "Les recruteurs te trouvent via la recherche IA et te contactent directement.",
  },
];

export default async function LandingPage() {
  const { userId } = await auth();

  if (userId) {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    });

    if (user?.role === "RECRUITER") {
      redirect("/recruiter/dashboard");
    }
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen text-white overflow-x-hidden">
      <CyberBackground />

      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#00FF41] rounded-full blur-[120px] opacity-[0.04] animate-orb" />
        <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-[#00FF41] rounded-full blur-[150px] opacity-[0.03] animate-orb2" />
        <div className="absolute top-2/3 left-1/3 w-[400px] h-[400px] bg-[#00FF41] rounded-full blur-[100px] opacity-[0.025] animate-orb3" />
      </div>

      <LandingNav />

      <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 md:px-6 py-20 md:py-32">
        <div className="font-mono text-xs text-[#00FF41] border border-[#00FF41]/30 px-4 py-2 rounded-full mb-8 bg-[#00FF41]/5 animate-glow-pulse">
          ⚡ Propulsé par Google Gemini AI
        </div>
        <h1 className="font-mono text-4xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Le recrutement
          <br />
          <span className="text-[#00FF41]">cybersécurité</span>
          <br />
          réinventé
        </h1>
        <p className="text-gray-400 text-base md:text-lg max-w-2xl mb-12 leading-relaxed">
          CyberTalent AI vérifie les vraies compétences, score les profils et connecte les meilleurs
          talents cyber aux entreprises qui en ont besoin.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/sign-up"
            className="font-mono text-sm px-8 py-4 bg-[#00FF41] text-black font-bold rounded-xl hover:bg-[#00FF41] transition w-full sm:w-auto text-center shadow-lg shadow-[#00FF41]/20"
          >
            Créer mon profil 👨‍💻
          </Link>
          <Link
            href="/sign-up"
            className="font-mono text-sm px-8 py-4 border border-[#FF3333]/30 text-[#FF3333] rounded-xl hover:bg-[#FF3333]/10 transition w-full sm:w-auto text-center"
          >
            Espace recruteur 🎯
          </Link>
        </div>

        <div className="flex items-center gap-8 md:gap-12 mt-16 pt-12 border-t border-[#00FF41]/10">
          <div className="text-center">
            <AnimatedCounter
              value={100}
              suffix="%"
              className="font-mono text-2xl md:text-3xl font-bold text-[#00FF41]"
            />
            <div className="font-mono text-xs text-gray-500 mt-1">Compétences vérifiées</div>
          </div>
          <div className="text-center">
            <AnimatedCounter
              value={100}
              suffix=""
              className="font-mono text-2xl md:text-3xl font-bold text-white"
            />
            <div className="font-mono text-xs text-gray-500 mt-1">Score IA calculé</div>
          </div>
          <div className="text-center">
            <AnimatedCounter
              value={0}
              suffix=""
              className="font-mono text-2xl md:text-3xl font-bold text-[#FF3333]"
            />
            <div className="font-mono text-xs text-gray-500 mt-1">Fake skills tolérés</div>
          </div>
        </div>
      </section>

      <section id="features" className="relative z-10 px-4 md:px-8 py-16 md:py-20 max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <div className="font-mono text-xs text-[#00FF41] mb-4">/ POUR LES CANDIDATS</div>
          <h2 className="font-mono text-2xl md:text-3xl font-bold text-white">
            Prouve tes vraies compétences
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {CANDIDATE_FEATURES.map((f, i) => (
            <div
              key={i}
              className="bg-[#0A0A0A] border border-[#00FF41]/10 rounded-xl p-6 hover:border-[#00FF41]/30 transition hover:-translate-y-1 duration-300"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-mono text-sm font-bold text-white mb-2">{f.title}</h3>
              <p className="font-mono text-xs text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="recruiters" className="relative z-10 px-4 md:px-8 py-16 md:py-20 bg-[#0A0A0A]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <div className="font-mono text-xs text-[#FF3333] mb-4">/ POUR LES RECRUTEURS</div>
            <h2 className="font-mono text-2xl md:text-3xl font-bold text-white">
              Trouve le bon talent en secondes
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {RECRUITER_FEATURES.map((f, i) => (
              <div
                key={i}
                className="bg-[#080c14] border border-[#FF3333]/10 rounded-xl p-6 hover:border-[#FF3333]/30 transition hover:-translate-y-1 duration-300"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-mono text-sm font-bold text-white mb-2">{f.title}</h3>
                <p className="font-mono text-xs text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="relative z-10 px-4 md:px-8 py-16 md:py-20 max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <div className="font-mono text-xs text-[#00FF41] mb-4">/ COMMENT CA MARCHE</div>
          <h2 className="font-mono text-2xl md:text-3xl font-bold text-white">3 étapes simples</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-mono text-6xl font-bold text-[#00FF41]/20 mb-4">{s.step}</div>
              <h3 className="font-mono text-lg font-bold text-white mb-3">{s.title}</h3>
              <p className="font-mono text-xs text-gray-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-4 md:px-8 py-16 md:py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-mono text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à prouver ton niveau ?
          </h2>
          <p className="font-mono text-sm text-gray-400 mb-10">
            Rejoins CyberTalent AI et laisse tes vraies competences parler pour toi.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="font-mono text-sm px-10 py-4 bg-[#00FF41] text-black font-bold rounded-xl hover:bg-[#00FF41] transition shadow-lg shadow-[#00FF41]/20"
            >
              Créer mon profil
            </Link>
            <Link
              href="/sign-up"
              className="font-mono text-sm px-10 py-4 border border-[#FF3333]/30 text-[#FF3333] rounded-xl hover:bg-[#FF3333]/10 transition"
            >
              Espace recruteur →
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-[#00FF41]/10 px-4 md:px-8 py-8 text-center">
        <div className="font-mono text-xs text-gray-600">
          © Mouhamed Dia 2026 CyberTalent AI · Propulsé par Google Gemini · Fait avec ❤️ pour la
          communauté cyber africaine
        </div>
      </footer>
    </div>
  );
}
