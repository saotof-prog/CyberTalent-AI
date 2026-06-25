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
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)

<br/>

> **CyberTalent AI** connects cybersecurity talents with recruiters — powered by AI scoring, intelligent matching, real-time analytics, and enterprise-grade security.

<br/>

[![Tests](https://img.shields.io/badge/✅_60_tests_passing-22c55e?style=for-the-badge)](https://github.com/saotof-prog/cybertalent-ai)
[![TypeScript](https://img.shields.io/badge/✅_TypeScript_strict-3178C6?style=for-the-badge)](https://www.typescriptlang.org/tsconfig/#strict)
[![Security](https://img.shields.io/badge/🛡️_CSP%20|%20Rate%20Limit%20|%20XSS%20protected-7c3aed?style=for-the-badge)](SECURITY.md)
[![MIT License](https://img.shields.io/badge/License-MIT-00c896?style=for-the-badge)](LICENSE)

</div>

---

## ✨ Features

### 🧠 CyberScore™ — AI-Powered Scoring
- **Dynamic 0-100 score** computed from verifiable evidence: certifications, labs, skills, GitHub activity
- **Hybrid AI analysis**: Gemini 2.0 Flash for deep profiling + intelligent local fallback (no API key required)
- **Domain-specific interview questions** generated from detected skill areas (7 domains)
- **Score history tracking** with delta and breakdown per update

### 👨‍💻 Candidate Portal (`/dashboard`)
- 📜 **Certification Management** — upload with auto platform detection (Credly, Coursera, GitHub, .edu) + AI verification
- 🧪 **Lab & CTF Tracking** — HackTheBox, TryHackMe, VulnHub, PwnedLabs with difficulty levels
- 🛠️ **Skills Manager** — add/remove skills with proficiency levels, years of experience, and autocomplete
- 🐙 **GitHub Sync** — automatic repo import with language detection, stars, forks, topics
- 🎯 **Job Recommendations** — personalized matching via semantic algorithm (skills, location, contract, score)
- 📝 **Profile Editor** — bio, headline, social links, salary expectations, availability

### 🔴 Recruiter Portal (`/recruiter/dashboard`)
- 🔍 **Smart Search** — filter by score, country, skills, certifications + semantic keyword matching
- 👁️ **Detailed Candidate Profiles** — verified certifications, completed labs, skill levels, GitHub repos
- 📋 **Job Management** — create/activate/deactivate postings with skill requirements and min score
- 💾 **Saved Candidates** — bookmark promising profiles with notes
- 📈 **Analytics Dashboard** — job stats, application funnel, candidate pool trends, top skills

### 🛡️ Admin Panel (`/admin`)
- 📊 **Platform-wide dashboard** — users, candidates, recruiters, active jobs
- 👥 **User Management** — ban/unban, role change (CANDIDATE ↔ RECRUITER), profile auto-migration
- 🏢 **Company Management** — verify/unverify companies
- 🎓 **Certification & Lab Moderation** — approve/reject with notifications and score recalculation

### 🎮 CyberMenu — Immersive Profile Hub
- ⬡ **CyberScore Ring** — animated SVG ring with counter animation and level colors
- 🎯 **Daily Missions** — role-specific quests (sync GitHub, add cert, publish job, search)
- 🔊 **Ambient Sound** — cyber drone, rain, lofi via Web Audio API (zero audio files)

### 🧘 Focus Mode — "Cyber Chamber"
- ◉ Vignette overlay, CRT scanlines, matrix rain animated background
- ⏱️ Floating focus timer (`Ctrl+Shift+F` toggle, `Esc` to exit)
- 🔊 Auto-ambiance drone on enter

### 🌙 CyberScreensaver
- 🌧️ Full-screen Matrix rain canvas with katakana
- 🎵 3 ambient modes: CYBER_DRONE, NUMB_RAIN, LOFI_PAD

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16.2.6 (App Router + Turbopack) |
| **Language** | TypeScript 5.x (strict mode) |
| **Styling** | Tailwind CSS v4 |
| **Auth** | Clerk (`@clerk/nextjs`) — JWT, MFA, session management |
| **ORM** | Prisma 6 (`@prisma/client` + `@prisma/adapter-neon`) |
| **Database** | PostgreSQL on Neon.tech (serverless) |
| **AI** | Google Gemini 2.0 Flash (`@google/generative-ai`) |
| **Testing** | Vitest — 60 tests (unit + integration) |
| **Rate Limiting** | PostgreSQL-backed (production), in-memory fallback (dev) |
| **Validation** | Zod — all API inputs validated with max-length constraints |
| **Security** | CSP headers, XSS sanitization, rate limiting, role guards |
| **Deployment** | Vercel (serverless) |

---

## 🚀 Quick Start

### Prerequisites

- Node.js `>= 18.x`
- PostgreSQL database ([Neon.tech](https://neon.tech) recommended)
- [Clerk](https://dashboard.clerk.com) account (free tier)
- [Google Gemini API key](https://aistudio.google.com/apikey) (free)
- [GitHub token](https://github.com/settings/tokens) (for GitHub Sync)

### Installation

```bash
git clone https://github.com/saotof-prog/cybertalent-ai.git
cd cybertalent-ai
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your secrets:

```bash
cp .env.example .env.local
```

```env
# PostgreSQL Database (Neon)
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"
DIRECT_URL="postgresql://user:password@host/db?sslmode=require"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/choose-role

# Google Gemini AI (free: https://aistudio.google.com/)
GEMINI_API_KEY=AIza...

# GitHub (for GitHub Sync — https://github.com/settings/tokens)
GITHUB_TOKEN=github_pat_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=CyberTalent AI
```

> ⚠️ **Security:** Never commit `.env.local`. Rotate compromised keys immediately — see [SECURITY.md](SECURITY.md).

### Database setup

```bash
npx prisma db push
npx prisma generate
```

### Run in development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🧮 CyberScore™ Algorithm

Dynamic 0-100 score based on **verifiable evidence**:

| Factor | Weight | Detail |
|--------|--------|--------|
| 🏆 **Certifications** | 40% | TOP (OSCP, CISSP, CISM, GREM, GXPN, GWAPT) = 15pts, MID (CEH, SECURITY+, CYSA+, EJPT, CCNA) = 10pts, Other = 5pts |
| 🧪 **Labs & CTF** | 25% | 3pts per lab (max 25pts) |
| 🛠️ **Skills** | 15% | 2pts per skill (max 15pts) |
| 🐙 **GitHub** | 20% | Username 5pts + >5 repos 5pts + >15 repos 5pts + >10 followers 5pts |

### Smart Local Analysis

Even without Gemini API, the system generates:
- **Summary** adapted to the profile level (beginner / intermediate / expert)
- **Strengths** — verified certs, hard labs, advanced skills, GitHub presence
- **Improvements** — missing certs, lab diversification, GitHub connection, skill breadth
- **Interview questions** by detected domain (7 domains: network, web, pentest, cloud, SOC, RE, crypto)

---

## 🔐 Security

| Protection | Implementation |
|-----------|---------------|
| **Authentication** | Clerk JWT with session management, MFA support |
| **Authorization** | 3-tier roles (CANDIDATE / RECRUITER / ADMIN) with server-side guards |
| **Route Protection** | Clerk middleware — public routes whitelisted, all others require auth |
| **Admin Guard** | DB-level role check in `admin/layout.tsx` — server-side redirect |
| **Ban System** | `rejectIfBanned()` utility — 403 response for banned accounts |
| **Rate Limiting** | PostgreSQL-backed sliding window (production) / in-memory (dev) — per-route configurable |
| **Input Validation** | Zod schemas on all API inputs — type checks, max-length constraints, enum validation |
| **XSS Prevention** | Strip `<>` characters from all user-controlled text before storage |
| **CSP Headers** | Content-Security-Policy with restricted script/style/connect sources |
| **Security Headers** | `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin` |
| **Certificate Validation** | URL shortener blocking, platform detection (Credly, Coursera, GitHub, .edu), AI verification |
| **Inconsistency Detection** | AI cross-referencing of certs, labs, and skills — flags fake skills |
| **Audit Trail** | `AuditLog` model — tracks all critical actions with IP and user agent |
| **Secrets Management** | `.env*` in `.gitignore`, `.env.example` with placeholders, [rotation guide](SECURITY.md) |

> 📖 Full security documentation: [SECURITY.md](SECURITY.md)

---

## 📁 Project Structure

```
cybertalent-ai/
├── prisma/
│   └── schema.prisma          # 28 models, 11 enums (incl. RateLimit)
├── scripts/
│   ├── set-admin.ts           # Promote user to ADMIN
│   └── list-users.ts          # List users
├── src/
│   ├── proxy.ts               # Clerk middleware + security headers + CSP
│   ├── app/
│   │   ├── layout.tsx         # Root: ClerkProvider, BannedGuard, FocusTimer, Toast
│   │   ├── page.tsx           # Landing page with animated cyber background
│   │   ├── sign-in/           # Clerk sign-in (catch-all [[...rest]])
│   │   ├── sign-up/           # Clerk sign-up (catch-all [[...rest]])
│   │   ├── choose-role/       # Role selection (CANDIDATE / RECRUITER)
│   │   ├── onboarding/        # Candidate & Recruiter onboarding
│   │   ├── dashboard/         # CANDIDATE PORTAL
│   │   │   ├── edit/          # Profile editor
│   │   │   ├── score/         # CyberScore + AI analysis
│   │   │   ├── jobs/          # Job listings + recommendations
│   │   │   ├── certifications/
│   │   │   ├── labs/
│   │   │   └── skills/
│   │   ├── recruiter/         # RECRUITER PORTAL
│   │   │   ├── dashboard/     # Analytics + talent search
│   │   │   ├── jobs/          # Job management
│   │   │   ├── candidate/[id]/
│   │   │   ├── saved/
│   │   │   └── search/
│   │   ├── admin/             # ADMIN PANEL
│   │   │   ├── users/
│   │   │   ├── companies/
│   │   │   ├── jobs/
│   │   │   ├── certifications/
│   │   │   └── labs/
│   │   └── api/               # 27 REST API route files
│   ├── components/            # 20 React components
│   └── lib/                   # Shared libraries
│       ├── rate-limit.ts      # DB-backed rate limiter (production) / in-memory (dev)
│       ├── score.ts           # CyberScore + AI analysis (Gemini + local fallback)
│       ├── matching.ts        # Job/candidate semantic matching
│       ├── api-error.ts       # Unified API error handling
│       ├── validation/        # Zod schemas (6 files)
│       └── certificate-validation/
```

---

## 🧪 Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch
```

**60 tests — all passing** across 9 test files:

| File | Tests | Coverage |
|------|-------|----------|
| `matching.test.ts` | 16 | Semantic matching algorithm (score, skills, mode, country) |
| `score.test.ts` | 14 | CyberScore calculation (certs, labs, skills, GitHub, caps) |
| `local-analysis.test.ts` | 8 | Profile analysis (strengths, improvements, questions) |
| `api-error.test.ts` | 6 | Unified error handler |
| `score-tracker.test.ts` | 2 | Score recalculation + history |
| `api-me.test.ts` | 2 | User ban status endpoint |
| `api-admin-users.test.ts` | 5 | Admin user management (ban, role change) |
| `api-jobs.test.ts` | 4 | Job creation (auth, validation, business logic) |
| `api-certifications.test.ts` | 3 | Certification creation (auth, validation, score impact) |

---

## 📊 API Routes

### Authentication & Onboarding
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/choose-role` | Set user role (CANDIDATE / RECRUITER only — admin elevation blocked) |
| POST | `/api/onboarding` | Create candidate profile (Zod validated) |
| POST | `/api/onboarding/recruiter` | Create recruiter profile (Zod validated, rate limited) |

### Certifications
| Method | Route | Description |
|--------|-------|-------------|
| GET/POST | `/api/certifications` | List/add certifications (auto platform detection + AI verify) |
| DELETE | `/api/certifications/[id]` | Delete a certification |
| POST | `/api/certifications/[id]/verify` | Request AI verification |

### Candidate
| Method | Route | Description |
|--------|-------|-------------|
| GET/PATCH | `/api/candidate/profile` | Read/update profile (sanitized, allowed-fields whitelist) |
| POST | `/api/candidate/skills` | Add/update a skill (Zod validated) |
| GET | `/api/candidate/skills` | List skills |
| DELETE | `/api/candidate/skills/[skillId]` | Remove a skill |
| GET | `/api/candidate/recommendations` | AI job recommendations |
| POST | `/api/candidate/search` | Semantic candidate search (recruiter) |

### Jobs & Applications
| Method | Route | Description |
|--------|-------|-------------|
| GET/POST | `/api/jobs` | List/create jobs (Zod validated, rate limited) |
| GET/PATCH/DELETE | `/api/jobs/[id]` | Manage a job (ownership check) |
| POST | `/api/applications` | Apply to a job |
| PATCH | `/api/applications/[id]` | Update application status (ownership check) |

### AI & Scoring
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/score/recalculate` | Recalculate CyberScore + AI analysis (rate limited: 5/min) |

### GitHub
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/github/sync` | Sync GitHub repos (rate limited: 5/min) |

### Notifications
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/notifications` | User notifications |
| PATCH | `/api/notifications` | Mark notification as read |

### Recruiter
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/recruiter/analytics` | Recruiter analytics dashboard |

### Admin (all rate limited: 30/min)
| Method | Route | Description |
|--------|-------|-------------|
| PATCH | `/api/admin/users` | Update user (ban, role change — Zod validated) |
| PATCH | `/api/admin/companies` | Verify/unverify company |
| PATCH | `/api/admin/jobs` | Activate/deactivate job |
| POST | `/api/admin/certifications/[id]/verify` | Approve/reject certification |
| POST | `/api/admin/labs/[id]/verify` | Approve/reject lab completion |

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
- [x] Unit tests (60 tests)
- [x] CyberMenu with gamified daily missions
- [x] Focus Mode "Cyber Chamber" + CyberScreensaver
- [x] Web Audio API ambient sound engine
- [x] **Enterprise security**: CSP headers, rate limiting, input sanitization, Zod validation
- [ ] Advanced full-text search (Elasticsearch / pg_search)
- [ ] Automatic CV parsing
- [ ] Public candidate profiles
- [ ] Recruiter analytics dashboard (advanced)
- [ ] Mobile app (React Native)

---

## 👤 Author

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

[🇫🇷 LISEZMOI.md](LISEZMOI.md) · [📖 SECURITY.md](SECURITY.md) · [📧 Contact](mailto:mouhamedabdallah.dia@uadb.edu.sn)

</div>
