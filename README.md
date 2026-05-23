<div align="center">

# 🛡️ CyberTalent AI

**La plateforme de recrutement cybersécurité propulsée par l'IA**

*Vérifie les vraies compétences · Score les profils · Connecte les talents*

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-6.x-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=flat-square&logo=postgresql)](https://neon.tech)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?style=flat-square)](https://clerk.com)
[![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?style=flat-square&logo=google)](https://ai.google.dev)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[🚀 Demo Live](https://cyber-talent-fmufnb9yq-saotof-progs-projects.vercel.app) · [🐛 Signaler un bug](https://github.com/saotof-prog/CyberTech-AI/issues) · [💡 Demander une feature](https://github.com/saotof-prog/CyberTech-AI/issues)

</div>

---

## 📋 Table des matières

- [À propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Démarrage rapide](#-démarrage-rapide)
- [Variables d'environnement](#-variables-denvironnement)
- [Structure du projet](#-structure-du-projet)
- [Base de données](#-base-de-données)
- [API Reference](#-api-reference)
- [Déploiement](#-déploiement)
- [Auteur](#-auteur)

---

## 🎯 À propos

**CyberTalent AI** est une plateforme SaaS spécialisée dans le recrutement en cybersécurité. Contrairement aux plateformes traditionnelles basées sur des mots-clés, CyberTalent AI utilise l'intelligence artificielle pour **vérifier les vraies compétences** des candidats et connecter les meilleurs talents aux entreprises.

### Le problème résolu

Le recrutement en cybersécurité souffre d'un problème majeur : les candidats surévaluent leurs compétences sur leur CV sans preuves concrètes. CyberTalent AI impose une approche **proof-of-work** — chaque compétence doit être prouvée par des certifications vérifiées, des labs complétés ou du code GitHub réel.

### Comment ça marche

```
Candidat s'inscrit → Choisit son rôle → Renseigne ses compétences
      ↓
L'IA (Gemini) analyse la cohérence du profil
      ↓
CyberScore généré (0–100) avec résumé + points forts
      ↓
Recruteur recherche via IA → Trouve les meilleurs matchs
```

---

## ✨ Fonctionnalités

### 👨‍💻 Espace Candidat

| Fonctionnalité | Description |
|---|---|
| **Profil tech complet** | Headline, bio, localisation, GitHub, disponibilité |
| **Certifications** | Upload OSCP, CEH, CISSP, eJPT, etc. avec lien de vérification |
| **Labs complétés** | HackTheBox, TryHackMe, VulnHub, PortSwigger, etc. |
| **Skills techniques** | Compétences avec niveaux (Beginner → Expert) |
| **CyberScore IA** | Score 0-100 calculé par Google Gemini + algorithme |
| **Historique de score** | Traçabilité complète de chaque évolution |
| **Dashboard temps réel** | Vue d'ensemble de toutes ses données |
| **Offres d'emploi** | Consultation des offres adaptées à son niveau |

### 🎯 Espace Recruteur

| Fonctionnalité | Description |
|---|---|
| **Dashboard candidats** | Liste classée par CyberScore avec filtres avancés |
| **Recherche IA naturelle** | "Pentester senior OSCP avec expérience cloud" |
| **Filtres avancés** | Score minimum, certification, pays, disponibilité |
| **Page profil candidat** | Vue détaillée avec toutes les preuves de compétences |
| **Candidats sauvegardés** | Bookmarks avec notes personnelles |
| **Offres d'emploi** | Publication, gestion et désactivation des offres |
| **Recalcul des scores** | Mise à jour en masse des CyberScores |

### 🤖 Intelligence Artificielle

| Fonctionnalité | Description |
|---|---|
| **Scoring hybride** | Algorithme déterministe + analyse sémantique Gemini |
| **Résumé automatique** | Profil résumé en langage naturel pour les recruteurs |
| **Points forts** | Top 3 des forces identifiées par l'IA |
| **Axes d'amélioration** | Recommandations personnalisées |
| **Détection fake skills** | Analyse de cohérence entre certifications et labs |
| **Questions d'interview** | Générées selon le profil exact du candidat |

---

## 🛠 Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org)** — App Router, Server Components, Turbopack
- **[TypeScript](https://www.typescriptlang.org)** — Typage strict end-to-end
- **[Tailwind CSS](https://tailwindcss.com)** — Styling utilitaire
- **[Clerk](https://clerk.com)** — Authentification complète avec gestion des rôles

### Backend
- **[Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)** — API REST serverless
- **[Prisma ORM 6](https://www.prisma.io)** — Type-safe database client
- **[PostgreSQL via Neon](https://neon.tech)** — Base de données serverless

### Intelligence Artificielle
- **[Google Gemini 1.5 Flash](https://ai.google.dev)** — Analyse de profil, scoring, génération de contenu (1500 req/jour gratuites)
- **Algorithme propriétaire** — Scoring déterministe basé sur les certifications et labs

### Infrastructure
- **[Vercel](https://vercel.com)** — Déploiement edge global, CI/CD automatique
- **[Neon](https://neon.tech)** — PostgreSQL serverless, branching, auto-scaling
- **[UploadThing](https://uploadthing.com)** — Upload sécurisé de certifications et CVs

---

## 🏗 Architecture

```
cybertalent-ai/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API Routes serverless
│   │   │   ├── certifications/       # CRUD certifications
│   │   │   ├── labs/                 # CRUD labs
│   │   │   ├── jobs/                 # CRUD offres d'emploi
│   │   │   ├── score/recalculate/    # Scoring IA (Gemini)
│   │   │   ├── onboarding/           # Création de profil
│   │   │   ├── choose-role/          # Sélection candidat/recruteur
│   │   │   ├── candidates/search/    # Recherche IA recruteur
│   │   │   └── uploadthing/          # Upload fichiers
│   │   ├── choose-role/              # Page sélection de rôle
│   │   ├── onboarding/               # Setup profil candidat
│   │   ├── dashboard/                # Espace candidat
│   │   │   ├── layout.tsx            # Layout avec Navbar
│   │   │   ├── page.tsx              # Dashboard principal
│   │   │   ├── certifications/
│   │   │   ├── labs/
│   │   │   ├── skills/
│   │   │   ├── score/
│   │   │   └── jobs/
│   │   ├── recruiter/                # Espace recruteur
│   │   │   ├── layout.tsx            # Layout avec RecruiterNavbar
│   │   │   ├── dashboard/
│   │   │   ├── candidate/[id]/
│   │   │   ├── jobs/create/
│   │   │   ├── search/
│   │   │   └── saved/
│   │   ├── sign-in/ & sign-up/       # Pages auth Clerk
│   │   └── page.tsx                  # Landing page publique
│   ├── components/
│   │   ├── Navbar.tsx                # Navigation candidat
│   │   ├── RecruiterNavbar.tsx       # Navigation recruteur
│   │   ├── CertificationUpload.tsx   # Formulaire certification
│   │   └── LabUpload.tsx             # Formulaire lab
│   └── lib/
│       ├── score.ts                  # Scoring algorithme + Gemini
│       ├── prisma.ts                 # Client Prisma singleton
│       └── uploadthing.ts            # Helpers UploadThing
├── prisma/
│   ├── schema.prisma                 # 18 modèles de données
│   └── seed.ts                       # Données de démonstration
└── prisma.config.ts                  # Configuration Prisma 6
```

---

## 🚀 Démarrage rapide

### Prérequis

- **Node.js** 18+
- Compte [Neon](https://neon.tech) (PostgreSQL gratuit)
- Compte [Clerk](https://clerk.com) (Auth gratuit)
- Clé API [Google AI Studio](https://aistudio.google.com) (Gemini gratuit)

### Installation

```bash
# 1. Cloner le repo
git clone https://github.com/saotof-prog/CyberTech-AI.git
cd CyberTech-AI

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Remplis les variables (voir section suivante)

# 4. Générer le client Prisma
npx prisma generate

# 5. Créer les tables en base de données
npx prisma db push

# 6. (Optionnel) Charger les données de test
npx prisma db seed

# 7. Lancer le serveur de développement
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000) dans ton navigateur 🎉

---

## 🔐 Variables d'environnement

Crée un fichier `.env.local` à la racine du projet :

```env
# Base de données PostgreSQL (Neon)
DATABASE_URL="postgresql://user:password@host/neondb?sslmode=require"
DIRECT_URL="postgresql://user:password@host/neondb?sslmode=require"

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/choose-role

# Google Gemini AI (gratuit - 1500 req/jour)
GEMINI_API_KEY="AIzaSy..."

# UploadThing (upload certifications/CV)
UPLOADTHING_TOKEN="eyJhcGlL..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="CyberTalent AI"
```

### Obtenir les clés API

| Service | Lien | Tier gratuit |
|---------|------|-------------|
| Neon (PostgreSQL) | [neon.tech](https://neon.tech) | 0.5 GB storage |
| Clerk (Auth) | [clerk.com](https://clerk.com) | 10,000 MAU |
| Google Gemini | [aistudio.google.com](https://aistudio.google.com) | 1500 req/jour |
| UploadThing | [uploadthing.com](https://uploadthing.com) | 2 GB storage |

---

## 🗄 Base de données

Le schéma Prisma contient **18 modèles** couvrant l'ensemble de la plateforme :

```
User                → Compte utilisateur (lié à Clerk)
CandidateProfile    → Profil complet candidat + CyberScore
RecruiterProfile    → Profil recruteur
Company             → Entreprises vérifiées
Certification       → Certifications avec vérification IA
Skill               → Catalogue de compétences
CandidateSkill      → Compétences du candidat avec niveaux
LabCompletion       → Labs HackTheBox, TryHackMe, etc.
CTFResult           → Résultats de compétitions CTF
GithubRepo          → Repos analysés automatiquement
Project             → Projets personnels
WorkExperience      → Expériences professionnelles
Education           → Formations et diplômes
ScoreHistory        → Historique complet du CyberScore
Job                 → Offres d'emploi
JobSkill            → Compétences requises par offre
Application         → Candidatures avec matching IA
SavedCandidate      → Bookmarks recruteur
InterviewQuestion   → Questions d'interview générées par IA
Notification        → Système de notifications
AuditLog            → Logs de toutes les actions
UserSession         → Sessions utilisateurs
```

### Commandes utiles Prisma

```bash
npx prisma studio          # Interface graphique des données
npx prisma db push         # Pousser le schéma sans migration
npx prisma migrate dev     # Créer une migration
npx prisma generate        # Régénérer le client TypeScript
npx prisma db seed         # Charger les données de test
```

---

## 📡 API Reference

Toutes les routes nécessitent une authentification Clerk via `auth()`.

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/api/onboarding` | Créer/mettre à jour le profil candidat |
| `POST` | `/api/certifications` | Ajouter une certification |
| `GET` | `/api/certifications` | Lister ses certifications |
| `POST` | `/api/labs` | Ajouter un lab complété |
| `POST` | `/api/score/recalculate` | Recalculer le CyberScore avec Gemini |
| `POST` | `/api/jobs` | Publier une offre d'emploi |
| `PATCH` | `/api/jobs/[id]` | Activer/désactiver une offre |
| `DELETE` | `/api/jobs/[id]` | Supprimer une offre |
| `POST` | `/api/candidates/search` | Recherche IA de candidats |
| `POST` | `/api/recruiter/save` | Sauvegarder/désauvegarder un candidat |
| `POST` | `/api/choose-role` | Définir le rôle utilisateur |

### Exemple — Recalcul du CyberScore

```typescript
const response = await fetch('/api/score/recalculate', {
  method: 'POST',
});

const data = await response.json();
// {
//   success: true,
//   score: 87,
//   summary: "Profil offensif solide avec preuves vérifiables...",
//   strengths: ["OSCP obtenu", "34 labs complétés", "GitHub actif"],
//   improvements: ["Ajouter des certs cloud", "Contribuer à l'open source"],
//   interviewQuestions: ["Explique une attaque Buffer Overflow...", ...]
// }
```

---

## 🚢 Déploiement

### Déploiement sur Vercel (recommandé)

```bash
# 1. Push sur GitHub
git add .
git commit -m "feat: initial deploy"
git push origin main

# 2. Importer sur Vercel
# → vercel.com → New Project → Import depuis GitHub

# 3. Ajouter les variables d'environnement
# → Project Settings → Environment Variables
# → Coller toutes les variables de .env.local

# 4. Deploy !
# Vercel redéploie automatiquement à chaque git push
```

> **Note :** Assure-toi que toutes les variables d'environnement sont bien configurées dans Vercel avant de déployer.

---

## 📄 License

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👨‍💻 Auteur

<div align="center">

### Mouhamed Abdallah Dia

**Développeur Full-Stack · Étudiant en Informatique**

*Université Alioune Diop de Bambey · Dakar, Sénégal* 🇸🇳

[![GitHub](https://img.shields.io/badge/GitHub-saotof--prog-181717?style=for-the-badge&logo=github)](https://github.com/saotof-prog)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Mouhamed%20Abdallah%20Dia-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/mouhamed-abdallah-dia-302b743b2)
[![Email](https://img.shields.io/badge/Email-mouhamedabdallah.dia%40uadb.edu.sn-D14836?style=for-the-badge&logo=gmail)](mailto:mouhamedabdallah.dia@uadb.edu.sn)

</div>

---

<div align="center">

**CyberTalent AI** — Construit avec passion à Dakar, Sénégal 🇸🇳

*Propulsé par Next.js · Google Gemini · Prisma · Clerk · Vercel*

⭐ **Si ce projet t'a aidé ou inspiré, n'oublie pas de mettre une étoile !**

</div>
