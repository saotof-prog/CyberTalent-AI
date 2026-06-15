<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f0c29,50:302b63,100:24243e&height=200&section=header&text=CyberTalent%20AI&fontSize=52&fontColor=ffffff&fontAlignY=38&desc=The%20Intelligence%20Layer%20for%20Cybersecurity%20Hiring&descSize=18&descAlignY=60&animation=fadeIn" width="100%"/>

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

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-ff4060?style=for-the-badge)](https://cybertalent.ai)
[![MIT License](https://img.shields.io/badge/License-MIT-00c896?style=for-the-badge)](LICENSE)

</div>

---

## ✨ Fonctionnalités

### 👨‍💻 Portail Candidat (`/dashboard`)
- 🧠 **CyberScore™** — score dynamique 0-100 calculé à partir de certifications, labs, skills et GitHub
- 📜 **Gestion des certifications** — upload avec détection automatique de plateforme (Credly, Coursera, GitHub, .edu) et auto-vérification
- 🧪 **Suivi de labs & CTF** — HackTheBox, TryHackMe, VulnHub, etc. avec niveaux de difficulté
- 🛠️ **Skills Manager** — ajout/retrait de compétences avec niveaux, années d'expérience et autocomplétion
- 🐙 **Sync GitHub** — analyse automatique des repos et contributions
- 🤖 **Analyse IA du profil** — résumé, points forts, axes d'amélioration et questions d'interview générées par Gemini
- 🎯 **Recommandations d'emploi** — matching personnalisé avec score de compatibilité
- 📊 **Score IA détaillé** — historique des scores, analyse locale intelligente (même sans connexion Gemini)
- 📝 **Éditeur de profil** — bio, headline, réseaux sociaux, salaire attendu, disponibilité

### 🔴 Portail Recruteur (`/recruiter/dashboard`)
- 🔍 **Recherche intelligente** — filtres par mots-clés, score, certifications, pays + matching sémantique IA
- 👁️ **Profils candidats détaillés** — certifications vérifiées, labs complétés, skills
- 📋 **Gestion des offres d'emploi** — création, activation/désactivation, suivi des candidatures
- 💾 **Candidats sauvegardés** — bookmarquez les profils intéressants
- 📈 **Statistiques** — nombre de candidats, pages, scores

### 🛡️ Administration (`/admin`)
- 📊 **Tableau de bord** — statistiques plateforme (utilisateurs, candidats, recruteurs, offres)
- 👥 **Gestion des utilisateurs** — liste, détails
- 🏢 **Gestion des entreprises**
- 📋 **Gestion des offres**
- 🎓 **Gestion des certifications**

### 🤖 Moteur IA
- **Scoring CyberScore™** — 4 facteurs pondérés (certs 40%, labs 25%, skills 15%, GitHub 20%)
- **Analyse locale intelligente** — génère résumé, forces, améliorations et questions d'interview sans dépendre de Gemini
- **Analyse Gemini AI** — analyse approfondie quand l'API est disponible
- **Matching sémantique** — correspondance skills/offres avec score pondéré
- **Détection d'incohérences** — fake skills detection par croisement certs/labs/skills
- **Génération de questions d'interview** — personnalisées par domaine (réseau, web, pentest, cloud, SOC)

---

## 🏗️ Tech Stack

| Layer | Technologie |
|-------|------------|
| **Framework** | Next.js 16.2.6 (App Router + Turbopack) |
| **Langage** | TypeScript 5.x |
| **Styling** | Tailwind CSS v4 |
| **Auth** | Clerk (`@clerk/nextjs`) |
| **ORM** | Prisma 6 (`@prisma/client` + `@prisma/adapter-neon`) |
| **Base de données** | PostgreSQL (Neon.tech) |
| **IA** | Google Gemini 2.0 Flash (`@google/generative-ai`) |
| **Upload** | UploadThing |
| **Temps réel** | WebSockets (`ws`) |
| **Tests** | Vitest |
| **Déploiement** | Vercel |

---

## 🚀 Démarrage rapide

### Prérequis

- Node.js `>= 18.x`
- PostgreSQL (via Neon.tech ou local)
- Compte Clerk
- Clé API Google Gemini (gratuite)

### Installation

```bash
git clone https://github.com/saotof-prog/cybertalent-ai.git
cd cybertalent-ai
npm install
```

### Variables d'environnement

```env
# Base de données PostgreSQL (Neon)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/choose-role

# Google Gemini AI (gratuit : https://aistudio.google.com/)
GEMINI_API_KEY=AIza...

# UploadThing
UPLOADTHING_TOKEN=...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=CyberTalent AI
```

### Lancer en développement

```bash
npx prisma db push
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## 🧮 Algorithme CyberScore™

Score dynamique 0-100 calculé à partir de **preuves vérifiables** :

| Facteur | Poids | Détail |
|---------|-------|--------|
| 🏆 **Certifications** | 40% | TOP (OSCP, CISSP, etc.) = 15pts, MID (CEH, SECURITY+) = 10pts, Autres = 5pts |
| 🧪 **Labs & CTF** | 25% | 3pts par lab, max 25pts |
| 🛠️ **Compétences** | 15% | 2pts par skill, max 15pts |
| 🐙 **GitHub** | 20% | 5pts username + 5pts (>5 repos) + 5pts (>15 repos) + 5pts (>10 followers) |

```typescript
// Exemple : profil avec OSCP + 5 labs + 3 skills + GitHub actif → Score ≈ 66
```

### Analyse locale intelligente

Même sans connexion Gemini, le système génère automatiquement :
- **Résumé** adapté au niveau (débutant / intermédiaire / expert)
- **Points forts** concrets (certs vérifiées, labs difficiles, skills avancés)
- **Axes d'amélioration** personnalisés (certifications manquantes, labs à diversifier)
- **Questions d'interview** par domaine détecté (7 domaines supportés)

---

## 📁 Structure du projet

```
cybertalent-ai/
├── prisma/
│   └── schema.prisma          # 27 modèles, 11 enums
├── scripts/
│   ├── set-admin.ts           # Promouvoir un utilisateur en ADMIN
│   └── list-users.ts          # Lister les utilisateurs
├── src/
│   ├── proxy.ts               # Middleware Clerk
│   ├── app/
│   │   ├── page.tsx           # Landing page avec fond cyber animé
│   │   ├── layout.tsx         # Root layout (ClerkProvider)
│   │   ├── sign-in/           # Connexion Clerk (catch-all)
│   │   ├── sign-up/           # Inscription Clerk (catch-all)
│   │   ├── choose-role/       # Choix CANDIDATE / RECRUITER
│   │   ├── onboarding/        # Onboarding candidat
│   │   ├── onboarding/recruiter/ # Onboarding recruteur
│   │   ├── dashboard/         # PORTAL CANDIDAT
│   │   │   ├── page.tsx       # Accueil stats
│   │   │   ├── edit/          # Éditer profil
│   │   │   ├── score/         # CyberScore + analyse IA
│   │   │   ├── jobs/          # Offres d'emploi
│   │   │   ├── certifications/
│   │   │   ├── labs/
│   │   │   └── skills/
│   │   ├── recruiter/         # PORTAL RECRUTEUR
│   │   │   ├── dashboard/     # Recherche talents + filtres
│   │   │   ├── jobs/          # Gestion des offres
│   │   │   ├── candidate/[id]/ # Détail candidat
│   │   │   ├── saved/         # Candidats sauvegardés
│   │   │   └── search/        # Recherche avancée
│   │   ├── admin/             # PANEL ADMIN
│   │   └── api/               # Routes API REST
│   ├── components/
│   │   ├── cyber-background.tsx  # Canvas animé (particules, data streams)
│   │   ├── Navbar.tsx
│   │   ├── RecruiterNavbar.tsx
│   │   ├── CertificationUpload.tsx
│   │   ├── LabUpload.tsx
│   │   ├── SkillsManager.tsx
│   │   ├── JobRecommendations.tsx
│   │   ├── GithubSync.tsx
│   │   └── NotificationsBell.tsx
│   └── lib/
│       ├── prisma.ts          # Client Prisma singleton
│       ├── score.ts           # CyberScore + analyse IA (Gemini + fallback local)
│       ├── matching.ts        # Algorithme de matching job/candidat
│       ├── api-error.ts       # Handler d'erreurs API unifié
│       └── certificate-validation/
│           └── platform-detector.ts
```

---

## 🧪 Tests

```bash
# Exécuter tous les tests
npm test

# Mode watch
npm run test:watch
```

**38 tests unitaires** couvrant :
- `score.test.ts` — 14 tests : calcul du CyberScore (certs, labs, skills, GitHub)
- `matching.test.ts` — 16 tests : algorithme de matching (score, skills, mode, contrat, pays)
- `local-analysis.test.ts` — 8 tests : analyse locale (forces, améliorations, questions)

---

## 🛣️ Roadmap

- [x] Landing page avec fond cyber animé (Canvas + particules)
- [x] Authentification Clerk (Sign-in / Sign-up)
- [x] Dual-portal (Candidat / Recruteur / Admin)
- [x] CyberScore™ avec scoring algorithmique
- [x] Analyse IA (Gemini + fallback local intelligent)
- [x] Matching sémantique job/candidat
- [x] Gestion des certifications avec auto-vérification
- [x] Suivi des labs & CTF
- [x] Skills manager avec autocomplétion
- [x] Sync GitHub
- [x] Notifications en temps réel
- [x] Panel Admin
- [x] Tests unitaires (38 tests)
- [ ] Recherche full-text avancée (Elasticsearch / pg_search)
- [ ] Parsing automatique de CV
- [ ] Profils publics candidats
- [ ] Dashboard analytics recruteur
- [ ] Application mobile (React Native)

---

## 📊 API Routes

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/choose-role` | Définir le rôle utilisateur |
| POST | `/api/onboarding` | Créer profil candidat |
| POST | `/api/onboarding/recruiter` | Créer profil recruteur |
| GET/POST | `/api/certifications` | Lister/ajouter des certifications |
| GET/PATCH/DELETE | `/api/certifications/[id]` | Gérer une certification |
| POST | `/api/labs` | Ajouter un lab |
| POST | `/api/candidate/skills` | Ajouter/modifier une compétence |
| GET | `/api/candidate/profile` | Lire le profil candidat |
| PATCH | `/api/candidate/profile` | Modifier le profil candidat |
| GET | `/api/candidate/recommendations` | Recommandations d'emploi IA |
| POST | `/api/candidate/search` | Recherche sémantique de candidats |
| POST | `/api/score/recalculate` | Recalculer CyberScore + analyse IA |
| POST | `/api/applications` | Postuler à une offre |
| PATCH | `/api/applications/[id]` | Mettre à jour le statut |
| POST | `/api/github/sync` | Synchroniser GitHub |
| GET | `/api/notifications` | Notifications utilisateur |

---

## 🔐 Sécurité

- Authentification via Clerk (JWT, MFA supporté)
- Middleware de protection des routes
- Rôles (CANDIDATE / RECRUITER / ADMIN) avec guards
- Validation des URLs de certifications (détection de shorteners)
- Auto-vérification des liens valides
- Détection d'incohérences de profil par l'IA

---

## 👤 Auteur

<div align="center">

**Mouhamed Abdallah Dia** — *saotof-prog*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/mouhamed-abdallah-dia-302b743b2)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-7C3AED?style=for-the-badge&logo=githubpages&logoColor=white)](https://saotof-prog.github.io/portoflio/)
[![Email](https://img.shields.io/badge/Email-Contact-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:mouhamedabdallah.dia@uadb.edu.sn)

*Full-Stack Developer · AI Engineer · Cybersecurity Enthusiast*
*Dakar, Sénégal 🇸🇳*

</div>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:24243e,50:302b63,100:0f0c29&height=120&section=footer&animation=fadeIn" width="100%"/>

*Built with ❤️ from Dakar — CyberTalent AI © 2026*

</div>
