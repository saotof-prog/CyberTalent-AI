# Sécurité — CyberTalent AI

## Rotation des secrets

Les secrets dans `.env.local` sont **propres à votre environnement local** et ne sont *pas* commités (`.env*` est dans `.gitignore`).

### Quand régénérer ?

| Secret | Pourquoi | Où le régénérer |
|--------|----------|----------------|
| `DATABASE_URL` / `DIRECT_URL` | Fuite ou rotation périodique | [Neon Dashboard](https://console.neon.tech) → Settings → Reset password |
| `CLERK_SECRET_KEY` | Fuite ou rotation périodique | [Clerk Dashboard](https://dashboard.clerk.com) → API Keys → Rotate |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Fuite | [Clerk Dashboard](https://dashboard.clerk.com) → API Keys → Rotate |
| `GEMINI_API_KEY` | Fuite ou quota anormal | [Google AI Studio](https://aistudio.google.com/apikey) → Create new key |
| `GITHUB_TOKEN` | Fuite | [GitHub Tokens](https://github.com/settings/tokens) → Regenerate |

### Procédure

```bash
# 1. Générer les nouvelles clés depuis chaque tableau de bord
# 2. Mettre à jour .env.local
# 3. Redéployer sur Vercel
npx vercel env pull
# 4. Purger l'historique git si un secret a fuité
npm run security:purge
```

## Mesures de sécurité implémentées

### Headers HTTP (middleware `src/proxy.ts`)
- `Strict-Transport-Security` — HSTS 2 ans, préchargement
- `Content-Security-Policy` — CSP restrictif (Clerk, GitHub, Gemini)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — caméra, micro, géolocalisation désactivés
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Resource-Policy: same-origin`

### Authentification & Autorisation
- Clerk JWT avec sessions
- Contrôle d'accès 3 rôles (CANDIDATE, RECRUITER, ADMIN) côté serveur
- Vérification de bannissement sur chaque route sensible (`rejectIfBanned`)
- Protection CSRF via header `X-CSRF-Token` pour les mutations API
- API routes non authentifiées : 401 JSON (pas de redirect)

### Validation des entrées
- Schémas Zod pour toutes les entrées API
- Nettoyage XSS : `<>` supprimés, patterns `javascript:`, `on*=`, `<script>`, etc. bloqués
- Validation des URLs : HTTP/HTTPS uniquement, bloque les raccourcisseurs
- Protection injection SQL : patterns détectés et rejetés dans les entrées utilisateur

### Rate Limiting
- Fenêtre glissante (base de données en production, mémoire en dev)
- Burst limit : 10 requêtes en 5 secondes max
- Limites différenciées par endpoint (5/min scoring, 10/min candidatures, 30/min admin)

### Audit & Logging
- Toutes les actions admin sont journalisées dans `AuditLog`
- Événements de sécurité : tentatives d'accès non autorisé, bannis, CSRF, uploads suspects
- Logs console avec niveau `[SECURITY]` ou `[ADMIN]`

### Base de données
- ORM Prisma (requêtes paramétrées, pas d'injection SQL)
- SSL requis (`sslmode=require`)
- Index sur les colonnes sensibles

### Détection des fraudes
- Vérification IA des certifications (Gemini)
- Détection de plateforme (Credly, Coursera, GitHub, .edu)
- Flags IA sur les incohérences de profil

## Prévention

- Les secrets sont configurés via variables d'environnement Vercel pour les déploiements
- `.env*` est dans `.gitignore` — ne pas forcer l'ajout avec `git add -f`
- Le fichier `.env.example` sert de modèle, sans vraies clés
- Un script de validation (`src/lib/env-check.ts`) détecte les clés de test en production
