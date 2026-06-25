# Sécurité — Rotation des secrets

## ⚠️ Les secrets suivants doivent être **immédiatement régénérés**

Les clés ci-dessous étaient commitées dans `.env.local` et sont considérées **compromises** :

| Secret | Pourquoi | Où le régénérer |
|--------|----------|----------------|
| `DATABASE_URL` / `DIRECT_URL` | Chaîne PostgreSQL exposée | [Neon Dashboard](https://console.neon.tech) → Settings → Reset password |
| `CLERK_SECRET_KEY` | Accès complet à l'API Clerk | [Clerk Dashboard](https://dashboard.clerk.com) → API Keys → Rotate |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clé publique exposée | [Clerk Dashboard](https://dashboard.clerk.com) → API Keys → Rotate |
| `GEMINI_API_KEY` | Quota Gemini épuisable | [Google AI Studio](https://aistudio.google.com/apikey) → Create new key |
| `GITHUB_TOKEN` | Accès aux repos GitHub | [GitHub Tokens](https://github.com/settings/tokens) → Regenerate |

## Procédure

1. Générer de nouvelles clés depuis chaque tableau de bord
2. Mettre à jour `.env.local` avec les nouvelles valeurs
3. Redéployer l'application sur Vercel
4. Supprimer l'ancien `.env.local` de l'historique git :
   ```bash
   git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch .env.local' --prune-empty --tag-name-filter cat -- --all
   ```
5. Pusher vers GitHub avec `git push --force --all`

## Prévention

- `.env*` est déjà dans `.gitignore` — ne pas forcer l'ajout avec `git add -f`
- Utiliser `.env.example` comme modèle, jamais de vraies clés
- Configurer les secrets via Vercel Dashboard (Environment Variables) pour les déploiements
