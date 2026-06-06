<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f0c29,50:302b63,100:24243e&height=200&section=header&text=CyberTalent%20AI&fontSize=52&fontColor=ffffff&fontAlignY=38&desc=The%20Intelligence%20Layer%20for%20Cybersecurity%20Hiring&descSize=18&descAlignY=60&animation=fadeIn" width="100%"/>

<br/>

[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.dev/)

<br/>

> **CyberTalent AI** is a dual-portal platform that connects cybersecurity professionals with top recruiters — powered by AI-driven job matching, skill scoring, and real-time analytics.

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Coming_Soon-ff4060?style=for-the-badge)](https://cybertalent.ai)
[![MIT License](https://img.shields.io/badge/License-MIT-00c896?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-00c896?style=for-the-badge)](CONTRIBUTING.md)

</div>

---

## 📸 Preview

<div align="center">

| 🔴 Recruiter Dashboard | 🟢 Candidate Dashboard |
|:---:|:---:|
| *AI-powered talent search & pipeline* | *CyberScore & job recommendations* |

> Screenshots coming soon — deployment in progress.

</div>

---

## ✨ Features

### 🔴 Recruiter Portal (`/recruiter`)
- 🔍 **Advanced talent filtering** — search by skill, certification, CyberScore, and availability
- 📊 **Pipeline management** — track candidates from shortlist to hire
- 📋 **Job posting workflow** — create and manage listings with required skill matching
- 📈 **Analytics dashboard** — conversion rates, talent pool insights

### 🟢 Candidate Portal (`/candidate`)
- 🧠 **CyberScore™** — dynamic score computed from certifications, labs, GitHub activity, and skill levels
- 💼 **AI Job Recommendations** — matched positions based on your profile, score, and preferences
- 🛠️ **Skills Manager** — add skills with proficiency level, years of experience, and autocomplete
- 👤 **Profile builder** — showcase your certs, tools, and projects

### 🤖 AI Engine
- Semantic skill matching between job requirements and candidate profiles
- Score-weighted recommendation algorithm
- Mode-based matching (remote / hybrid / on-site)

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Auth** | Clerk |
| **ORM** | Prisma |
| **Database** | PostgreSQL |
| **AI** | OpenAI API / Custom matching engine |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 18.x`
- PostgreSQL database
- Clerk account
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/saotof-prog/cybertalent-ai.git
cd cybertalent-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# OpenAI
OPENAI_API_KEY=sk-...
```

### Run locally

```bash
# Push database schema
npx prisma db push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🚀

---

## 📁 Project Structure

```
cybertalent-ai/
├── app/
│   ├── (recruiter)/          # Recruiter portal (red accent #ff4060)
│   │   ├── dashboard/
│   │   ├── candidates/
│   │   └── jobs/
│   ├── (candidate)/          # Candidate portal (green accent #00c896)
│   │   ├── dashboard/
│   │   ├── profile/
│   │   └── recommendations/
│   └── api/
│       ├── jobs/
│       ├── candidates/
│       └── recommendations/
├── components/
│   ├── recruiter/
│   └── candidate/
├── lib/
│   ├── prisma.ts
│   ├── cyberScore.ts         # CyberScore™ algorithm
│   └── matching.ts           # AI matching engine
└── prisma/
    └── schema.prisma
```

---

## 🧮 CyberScore™ Algorithm

The **CyberScore** is a dynamic 0–100 metric computed from:

| Factor | Weight |
|--------|--------|
| 🏆 International Certifications | 35% |
| 🧪 Labs & CTF completions | 25% |
| 🛠️ Skill levels & experience | 25% |
| 🐙 GitHub activity & projects | 15% |

```typescript
// Simplified scoring logic
export function computeCyberScore(profile: CandidateProfile): number {
  const certScore   = scoreCertifications(profile.certifications) * 0.35;
  const labScore    = scoreLabs(profile.labs)                     * 0.25;
  const skillScore  = scoreSkills(profile.skills)                 * 0.25;
  const githubScore = scoreGitHub(profile.githubUrl)              * 0.15;

  return Math.round(certScore + labScore + skillScore + githubScore);
}
```

---

## 🛣️ Roadmap

- [x] Recruiter dashboard with URL-based filtering
- [x] Candidate profile page
- [x] CyberScore™ calculation engine
- [x] Skills manager with autocomplete
- [ ] AI-powered job recommendations
- [ ] Recruiter analytics dashboard
- [ ] Real-time notifications
- [ ] Resume parsing & auto-fill
- [ ] Public candidate profiles
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! Please read the [Contributing Guide](CONTRIBUTING.md) first.

```bash
# Create a feature branch
git checkout -b feature/your-feature

# Commit your changes
git commit -m "feat: add your feature"

# Push and open a PR
git push origin feature/your-feature
```

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

> 🇫🇷 Une documentation en français est disponible dans [LISEZMOI.md](LISEZMOI.md)

</div>
