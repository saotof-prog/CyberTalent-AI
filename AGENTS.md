<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- SESSION 29/05/2026: Corrections build & runtime
- Gemini: gemini-1.5-flash déprécié → gemini-2.0-flash (src/lib/score.ts)
- Clerk: /sign-in transformé en catch-all [[...rest]] pour éliminer warning
- PrismaNeonHttp nécessite 2e argument {} (src/lib/prisma.ts, scripts/)
- Google Fonts inaccessible en build → remplacé par polices système dans globals.css
- Turbopack warning: package-lock.json dans le dossier parent supprimé
-->
