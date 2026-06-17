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

> **CyberTalent AI** is a dual-portal platform that connects cybersecurity talents with recruiters — powered by AI scoring, intelligent matching, and real-time analytics.

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-ff4060?style=for-the-badge)](https://cybertalent.ai)
[![MIT License](https://img.shields.io/badge/License-MIT-00c896?style=for-the-badge)](LICENSE)

</div>

---

## ✨ Features

### 🎮 CyberMenu — Immersive Profile Hub
- ⬡ **CyberScore Ring** — animated SVG ring with counter animation and level colors (Débutant → Expert)
- 🎯 **Daily Missions** — role-specific quests (candidate: sync GitHub, add cert; recruiter: publish job, search)
- 📊 **Quick Stats** — certs, labs, score / jobs, searches, score at a glance
- ⚡ **Quick Actions** — one-click access to profile, dashboard, certifications, skills
- 🔊 **Ambient Sound** — cyber drone, rain, lofi generated via Web Audio API (0 files needed)

### 👨‍💻 Candidate Portal (`/dashboard`)
- 🧠 **CyberScore™** — dynamic 0-100 score computed from certifications, labs, skills, and GitHub activity
- 📜 **Certification Management** — upload with auto platform detection (Credly, Coursera, GitHub, .edu) and auto-verification
- 🧪 **Lab & CTF Tracking** — HackTheBox, TryHackMe, VulnHub, etc. with difficulty levels
- 🛠️ **Skills Manager** — add/remove skills with proficiency levels, years of experience, and autocomplete
- 🐙 **GitHub Sync** — automatic repo and contribution analysis
- 🤖 **AI Profile Analysis** — summary, strengths, improvements, and interview questions from Gemini + local fallback
- 🎯 **Job Recommendations** — personalized matching with compatibility score
- 📊 **Detailed AI Score** — score history, intelligent local analysis (even without Gemini)
- 📝 **Profile Editor** — bio, headline, social links, salary expectations, availability

### 🔴 Recruiter Portal (`/recruiter/dashboard`)
- 🔍 **Smart Search** — filters by keywords, score, certifications, country + semantic AI matching
- 👁️ **Detailed Candidate Profiles** — verified certifications, completed labs, skills
- 📋 **Job Management** — create, activate/deactivate, track applications
- 💾 **Saved Candidates** — bookmark promising profiles
- 📈 **Stats** — candidate count, pages, scores

### 🛡️ Admin Panel (`/admin`)
- 📊 **Dashboard** — platform-wide stats (users, candidates, recruiters, jobs)
- 👥 **User Management**
- 🏢 **Company Management**
- 📋 **Job Management**
- 🎓 **Certification Management**

### 🧘 Focus Mode — "Cyber Chamber"
- ◉ **Deep Work** — vignette, CRT scanlines, matrix rain background, navigation hidden
- 💫 **Content Spotlight** — halo pulsé autour de la zone active
- ⏱️ **Focus Timer** — `FOCUS 05:23 ⎋ EXIT` flottant en bas d'écran
- 🔊 **Auto-ambiance** — le drone cyber se lance en entrant
- ⌨️ **Shortcut** — `Ctrl+Shift+F` pour basculer, `Échap` pour sortir

### 🌙 CyberScreensaver
- 🌧️ **Matrix Rain** — canvas katakana en temps réel
- 🎵 **3 Sound Modes** — CYBER_DRONE, NUMB_RAIN, LOFI_PAD (volume adjustable)
- 💚 **Full-screen** — fond semi-transparent, logo CYBERTALENT_AI central
- ⎋ **Any key or click** to exit

### 🤖 AI Engine
- **CyberScore™** — 4 weighted factors (certs 40%, labs 25%, skills 15%, GitHub 20%)
- **Local Intelligent Analysis** — generates summary, strengths, improvements, and interview questions without Gemini
- **Gemini AI Analysis** — deep profile analysis when API is available
- **Semantic Matching** — skill-to-job matching with weighted scores
- **Inconsistency Detection** — fake skills detection by cross-referencing certs/labs/skills
- **Interview Question Generation** — domain-specific (network, web, pentest, cloud, SOC)

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16.2.6 (App Router + Turbopack) |
| **Language** | TypeScript 5.x |
| **Styling** | Tailwind CSS v4 |
| **Auth** | Clerk (`@clerk/nextjs`) |
| **ORM** | Prisma 6 (`@prisma/client` + `@prisma/adapter-neon`) |
| **Database** | PostgreSQL (Neon.tech) |
| **AI** | Google Gemini 2.0 Flash (`@google/generative-ai`) |
| **Upload** | UploadThing |
| **Real-time** | WebSockets (`ws`) |
| **Testing** | Vitest |
| **Deployment** | Vercel |

---

## 🚀 Quick Start

### Prerequisites

- Node.js `>= 18.x`
- PostgreSQL (Neon.tech or local)
- Clerk account
- Google Gemini API key (free at aistudio.google.com)

### Installation

```bash
git clone https://github.com/saotof-prog/cybertalent-ai.git
cd cybertalent-ai
npm install
```

### Environment Variables

```env
# PostgreSQL Database (Neon)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/choose-role

# Google Gemini AI (free: https://aistudio.google.com/)
GEMINI_API_KEY=AIza...

# GitHub (pour GitHub Sync — https://github.com/settings/tokens)
GITHUB_TOKEN=github_pat_...

# UploadThing
UPLOADTHING_TOKEN=...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=CyberTalent AI
```

### Run in development

```bash
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🧮 CyberScore™ Algorithm

Dynamic 0-100 score based on **verifiable evidence**:

| Factor | Weight | Detail |
|--------|--------|--------|
| 🏆 **Certifications** | 40% | TOP (OSCP, CISSP, etc.) = 15pts, MID (CEH, SECURITY+) = 10pts, Other = 5pts |
| 🧪 **Labs & CTF** | 25% | 3pts per lab, max 25pts |
| 🛠️ **Skills** | 15% | 2pts per skill, max 15pts |
| 🐙 **GitHub** | 20% | Username 5pts + (>5 repos) 5pts + (>15 repos) 5pts + (>10 followers) 5pts |

### Smart Local Analysis

Even without Gemini API access, the system automatically generates:
- **Summary** adapted to the level (beginner / intermediate / expert)
- **Strengths** — verified certs, hard labs, advanced skills
- **Improvements** — missing certs, lab diversification, GitHub connection
- **Interview questions** by detected domain (7 domains supported)

---

## 📁 Project Structure

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
│   │   ├── CyberMenu.tsx          # Immersive profile dropdown (missions, score ring, focus, sound)
│   │   ├── CyberScreensaver.tsx   # Matrix rain fullscreen with ambient sound
│   │   ├── FocusTimer.tsx         # Global focus mode timer with keyboard shortcuts
│   │   ├── cyber-background.tsx   # Canvas animé (particules, data streams)
│   │   ├── Navbar.tsx             # Candidate navbar (uses CyberMenu)
│   │   ├── RecruiterNavbar.tsx    # Recruiter navbar (uses CyberMenu)
│   │   ├── admin-shell.tsx        # Admin shell (uses CyberMenu)
│   │   ├── CertificationUpload.tsx
│   │   ├── LabUpload.tsx
│   │   ├── SkillsManager.tsx
│   │   ├── JobRecommendations.tsx
│   │   ├── GithubSync.tsx
│   │   └── NotificationsBell.tsx
│   └── lib/
│       ├── ambient-sound.ts    # Web Audio API ambient generator (drone, rain, lofi)
│       ├── prisma.ts           # Prisma client singleton
│       ├── score.ts            # CyberScore + AI analysis (Gemini + local fallback)
│       ├── matching.ts         # Job/candidate matching algorithm
│       ├── api-error.ts        # Unified API error handler
│       └── certificate-validation/
│           └── platform-detector.ts
```

> 🇫🇷 Une version française est disponible dans [LISEZMOI.md](LISEZMOI.md)

---

## 🧪 Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch
```

**38 unit tests** covering:
- `score.test.ts` — 14 tests: CyberScore calculation (certs, labs, skills, GitHub)
- `matching.test.ts` — 16 tests: matching algorithm (score, skills, mode, contract, country)
- `local-analysis.test.ts` — 8 tests: local analysis (strengths, improvements, questions)

---

## 🛣️ Roadmap

- [x] Landing page with animated cyber background (Canvas + particles)
- [x] Clerk authentication (Sign-in / Sign-up)
- [x] Dual-portal (Candidate / Recruiter / Admin)
- [x] CyberScore™ with algorithmic scoring
- [x] AI analysis (Gemini + intelligent local fallback)
- [x] Semantic job/candidate matching
- [x] Certification management with auto-verification
- [x] Lab & CTF tracking
- [x] Skills manager with autocomplete
- [x] GitHub sync
- [x] Real-time notifications
- [x] Admin panel
- [x] Unit tests (38 tests)
- [x] CyberMenu with gamified daily missions (role-specific)
- [x] Focus Mode "Cyber Chamber" (CRT scanlines, matrix rain, timer)
- [x] CyberScreensaver (canvas matrix rain + 3 ambient sound modes)
- [x] Web Audio API ambient sound engine (drone, rain, lofi)
- [ ] Advanced full-text search (Elasticsearch / pg_search)
- [ ] Automatic CV parsing
- [ ] Public candidate profiles
- [ ] Recruiter analytics dashboard
- [ ] Mobile app (React Native)

---

## 📊 API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/choose-role` | Set user role |
| POST | `/api/onboarding` | Create candidate profile |
| POST | `/api/onboarding/recruiter` | Create recruiter profile |
| GET/POST | `/api/certifications` | List/add certifications |
| GET/PATCH/DELETE | `/api/certifications/[id]` | Manage a certification |
| POST | `/api/labs` | Add a lab completion |
| POST | `/api/candidate/skills` | Add/update a skill |
| GET | `/api/candidate/profile` | Read candidate profile |
| PATCH | `/api/candidate/profile` | Update candidate profile |
| GET | `/api/candidate/recommendations` | AI job recommendations |
| POST | `/api/candidate/search` | Semantic candidate search |
| POST | `/api/score/recalculate` | Recalculate CyberScore + AI analysis |
| POST | `/api/applications` | Apply to a job |
| PATCH | `/api/applications/[id]` | Update application status |
| POST | `/api/github/sync` | Sync GitHub repos |
| GET | `/api/notifications` | User notifications |

---

## 🔐 Security

- Authentication via Clerk (JWT, MFA supported)
- Route protection middleware
- Roles (CANDIDATE / RECRUITER / ADMIN) with guards
- Certification URL validation (shortener detection)
- Auto-verification of valid links
- AI-powered profile inconsistency detection

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
