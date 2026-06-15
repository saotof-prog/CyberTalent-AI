<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f0c29,50:302b63,100:24243e&height=200&section=header&text=CyberTalent%20AI&fontSize=52&fontColor=ffffff&fontAlignY=38&desc=La%20plateforme%20intelligente%20du%20recrutement%20cybersécurité&descSize=16&descAlignY=60&animation=fadeIn" width="100%"/>

<br/>

[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Gemini](https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.dev/)
[![Neon](https://img.shields.io/badge/Neon-00E599?style=for-the-badge&logo=neon&logoColor=white)](https://neon.tech/)

<br/>

> **CyberTalent AI** plateforme dual-portal qui connecte les talents cybersécurité aux recruteurs — propulsée par un scoring IA, du matching intelligent et des analytics en temps réel.

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_Démo_Live-ff4060?style=for-the-badge)](https://cybertalent.ai)
[![Licence MIT](https://img.shields.io/badge/Licence-MIT-00c896?style=for-the-badge)](LICENSE)

<br/>

> 🇬🇧 The English documentation is available in [README.md](README.md)

</div>

---

## ✨ Fonctionnalités

### 👨‍💻 Portail Candidat (`/dashboard`)
- 🧠 **CyberScore™** — score dynamique 0-100 calculé à partir de certifications, labs, skills et GitHub
- 📜 **Gestion des certifications** — upload avec détection automatique de plateforme (Credly, Coursera, GitHub, .edu) et auto-vérification
- 🧪 **Suivi de labs & CTF** — HackTheBox, TryHackMe, VulnHub, etc. avec niveaux de difficulté
- 🛠️ **Skills Manager** — ajout/retrait de compétences avec niveaux, années d'expérience et autocomplétion
- 🐙 **Sync GitHub** — analyse automatique des repos et contributions
- 🤖 **Analyse IA du profil** — résumé, points forts, axes d'amélioration et questions d'interview (Gemini + analyse locale)
- 🎯 **Recommandations d'emploi** — matching personnalisé avec score de compatibilité
- 📊 **Score IA détaillé** — historique des scores, analyse locale intelligente
- 📝 **Éditeur de profil** — bio, headline, réseaux sociaux, salaire attendu, disponibilité

### 🔴 Portail Recruteur (`/recruiter/dashboard`)
- 🔍 **Recherche intelligente** — filtres par mots-clés, score, certifications, pays + matching sémantique IA
- 👁️ **Profils candidats détaillés** — certifications vérifiées, labs complétés, skills
- 📋 **Gestion des offres d'emploi** — création, activation/désactivation, suivi des candidatures
- 💾 **Candidats sauvegardés** — bookmarquez les profils intéressants
- 📈 **Statistiques** — nombre de candidats, pages, scores

### 🛡️ Administration (`/admin`)
- 📊 **Tableau de bord** — statistiques plateforme (utilisateurs, candidats, recruteurs, offres)
- 👥 **Gestion des utilisateurs**
- 🏢 **Gestion des entreprises**
- 📋 **Gestion des offres et certifications**

---

## 🏗️ Stack Technique

| Layer | Technologie |
|-------|------------|
| **Framework** | Next.js 16.2.6 (App Router + Turbopack) |
| **Langage** | TypeScript 5.x |
| **Styling** | Tailwind CSS v4 |
| **Auth** | Clerk (`@clerk/nextjs`) |
| **ORM** | Prisma 6 + Neon adapter |
| **Base de données** | PostgreSQL (Neon.tech) |
| **IA** | Google Gemini 2.0 Flash |
| **Upload** | UploadThing |
| **WebSockets** | `ws` |
| **Tests** | Vitest (38 tests) |
| **Déploiement** | Vercel |

---

## 🚀 Démarrage rapide

### Prérequis
- Node.js `>= 18.x`
- PostgreSQL (Neon.tech ou local)
- Compte Clerk
- Clé API Google Gemini (gratuite sur aistudio.google.com)

```bash
git clone https://github.com/saotof-prog/cybertalent-ai.git
cd cybertalent-ai
npm install
cp .env.example .env.local  # Configurer les variables
npx prisma db push
npm run dev
```

### Variables d'environnement

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
GEMINI_API_KEY=AIza...
UPLOADTHING_TOKEN=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🧮 CyberScore™

| Facteur | Poids | Détail |
|---------|-------|--------|
| 🏆 Certifications | 40% | TOP (OSCP, CISSP) = 15pts, MID (CEH) = 10pts, Autres = 5pts |
| 🧪 Labs & CTF | 25% | 3pts par lab, max 25pts |
| 🛠️ Compétences | 15% | 2pts par skill, max 15pts |
| 🐙 GitHub | 20% | Username 5pts + repos 10pts + followers 5pts |

**Analyse locale intelligente** : même sans Gemini, le système génère résumé, forces, améliorations et questions d'interview.

---

## 🧪 Tests

```bash
npm test        # 38 tests unitaires
npm run test:watch  # Mode watch
```

Couverture : scoring (14 tests), matching (16 tests), analyse locale (8 tests).

---

## 👤 Auteur

<div align="center">

**Mouhamed Abdallah Dia** — *saotof-prog*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/mouhamed-abdallah-dia-302b743b2)
[![Email](https://img.shields.io/badge/Email-Contact-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:mouhamedabdallah.dia@uadb.edu.sn)

*Full-Stack Developer · AI Engineer · Cybersecurity Enthusiast — Dakar, Sénégal 🇸🇳*

</div>

---

<div align="center">
*Built with ❤️ from Dakar — CyberTalent AI © 2026*
</div>
