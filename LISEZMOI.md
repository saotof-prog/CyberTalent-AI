<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f0c29,50:302b63,100:24243e&height=200&section=header&text=CyberTalent%20AI&fontSize=52&fontColor=ffffff&fontAlignY=38&desc=La%20plateforme%20intelligente%20du%20recrutement%20cybersécurité&descSize=16&descAlignY=60&animation=fadeIn" width="100%"/>

<br/>

[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.dev/)

<br/>

> **CyberTalent AI** est une plateforme à double portail qui connecte les professionnels de la cybersécurité avec les meilleurs recruteurs — propulsée par un moteur de matching IA, un système de scoring de compétences et des analyses en temps réel.

<br/>

[![Démo Live](https://img.shields.io/badge/🚀_Démo_Live-Bientôt-ff4060?style=for-the-badge)](https://cybertalent.ai)
[![Licence MIT](https://img.shields.io/badge/Licence-MIT-00c896?style=for-the-badge)](LICENSE)
[![PRs Bienvenues](https://img.shields.io/badge/PRs-Bienvenues-00c896?style=for-the-badge)](CONTRIBUTING.md)

<br/>

> 🇬🇧 The English documentation is available in [README.md](README.md)

</div>

---

## 📸 Aperçu

<div align="center">

| 🔴 Tableau de bord Recruteur | 🟢 Tableau de bord Candidat |
|:---:|:---:|
| *Recherche de talents & pipeline IA* | *CyberScore & recommandations d'emploi* |

> Captures d'écran à venir — déploiement en cours.

</div>

---

## ✨ Fonctionnalités

### 🔴 Portail Recruteur (`/recruiter`)
- 🔍 **Filtrage avancé des talents** — recherche par compétence, certification, CyberScore et disponibilité
- 📊 **Gestion du pipeline** — suivi des candidats de la présélection à l'embauche
- 📋 **Gestion des offres d'emploi** — créer et gérer des annonces avec matching de compétences requis
- 📈 **Tableau de bord analytique** — taux de conversion, insights sur le vivier de talents

### 🟢 Portail Candidat (`/candidate`)
- 🧠 **CyberScore™** — score dynamique calculé à partir des certifications, labs, activité GitHub et niveaux de compétences
- 💼 **Recommandations d'emploi IA** — postes matchés selon ton profil, ton score et tes préférences
- 🛠️ **Gestionnaire de compétences** — ajoute tes compétences avec niveau de maîtrise, années d'expérience et autocomplétion
- 👤 **Constructeur de profil** — mets en valeur tes certifications, outils et projets

### 🤖 Moteur IA
- Matching sémantique des compétences entre offres et profils candidats
- Algorithme de recommandation pondéré par le CyberScore
- Matching par mode de travail (remote / hybride / présentiel)

---

## 🏗️ Stack Technique

| Couche | Technologie |
|--------|-------------|
| **Framework** | Next.js 15 (App Router) |
| **Langage** | TypeScript |
| **Styles** | Tailwind CSS |
| **Authentification** | Clerk |
| **ORM** | Prisma |
| **Base de données** | PostgreSQL |
| **IA** | OpenAI API / Moteur de matching custom |
| **Déploiement** | Vercel |

---

## 🚀 Démarrage rapide

### Prérequis

- Node.js `>= 18.x`
- Base de données PostgreSQL
- Compte Clerk
- Clé API OpenAI

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/saotof-prog/cybertalent-ai.git
cd cybertalent-ai

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
```

### Variables d'environnement

```env
# Base de données
DATABASE_URL="postgresql://..."

# Authentification Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# OpenAI
OPENAI_API_KEY=sk-...
```

### Lancer en local

```bash
# Pousser le schéma de base de données
npx prisma db push

# Démarrer le serveur de développement
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000) 🚀

---

## 📁 Structure du Projet

```
cybertalent-ai/
├── app/
│   ├── (recruiter)/          # Portail recruteur (accent rouge #ff4060)
│   │   ├── dashboard/
│   │   ├── candidates/
│   │   └── jobs/
│   ├── (candidate)/          # Portail candidat (accent vert #00c896)
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
│   ├── cyberScore.ts         # Algorithme CyberScore™
│   └── matching.ts           # Moteur de matching IA
└── prisma/
    └── schema.prisma
```

---

## 🧮 Algorithme CyberScore™

Le **CyberScore** est un indicateur dynamique de 0 à 100 calculé à partir de :

| Facteur | Poids |
|---------|-------|
| 🏆 Certifications internationales | 35% |
| 🧪 Labs & CTF complétés | 25% |
| 🛠️ Niveaux de compétences & expérience | 25% |
| 🐙 Activité GitHub & projets | 15% |

```typescript
// Logique de scoring simplifiée
export function computeCyberScore(profile: CandidateProfile): number {
  const certScore   = scoreCertifications(profile.certifications) * 0.35;
  const labScore    = scoreLabs(profile.labs)                     * 0.25;
  const skillScore  = scoreSkills(profile.skills)                 * 0.25;
  const githubScore = scoreGitHub(profile.githubUrl)              * 0.15;

  return Math.round(certScore + labScore + skillScore + githubScore);
}
```

---

## 🛣️ Feuille de Route

- [x] Tableau de bord recruteur avec filtrage par URL
- [x] Page de profil candidat
- [x] Moteur de calcul CyberScore™
- [x] Gestionnaire de compétences avec autocomplétion
- [ ] Recommandations d'emploi IA
- [ ] Tableau de bord analytique recruteur
- [ ] Notifications en temps réel
- [ ] Parsing de CV & remplissage automatique
- [ ] Profils candidats publics
- [ ] Application mobile (React Native)

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! Merci de lire le [Guide de contribution](CONTRIBUTING.md) avant de commencer.

```bash
# Créer une branche feature
git checkout -b feature/ma-fonctionnalite

# Committer les changements
git commit -m "feat: ajouter ma fonctionnalité"

# Pousser et ouvrir une PR
git push origin feature/ma-fonctionnalite
```

---

## 👤 Auteur

<div align="center">

**Mouhamed Abdallah Dia** — *saotof-prog*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connecter-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/mouhamed-abdallah-dia-302b743b2)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visiter-7C3AED?style=for-the-badge&logo=githubpages&logoColor=white)](https://saotof-prog.github.io/portoflio/)
[![Email](https://img.shields.io/badge/Email-Contacter-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:mouhamedabdallah.dia@uadb.edu.sn)

*Développeur Full-Stack · Ingénieur IA · Passionné de Cybersécurité*
*Dakar, Sénégal 🇸🇳*

</div>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:24243e,50:302b63,100:0f0c29&height=120&section=footer&animation=fadeIn" width="100%"/>

*Construit avec ❤️ depuis Dakar — CyberTalent AI © 2026*

</div>