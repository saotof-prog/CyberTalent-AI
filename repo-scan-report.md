# Repo Scan Pre-Scan Report

- **Target**: `C:\Users\My-PC\cybertech-ai`
- **Scan Time**: 2026-06-22 15:17:35

## 1. Overall Statistics

| Metric | Value |
|--------|-------|
| Total Files | 60517 |
| Total Size (raw) | 2.46 GB |
| **Project Source Files** | **154** |
| **Project Source Size** | **1.15 MB** |
| Third-Party Files | 0 |
| Third-Party Size | 0 B |
| Noise Files (build artifacts) | 60363 |
| Noise Size (build artifacts) | 2.46 GB |
| Project Code Ratio | 0.0% |
| Oldest Source File | 2026-05-27 |
| Newest Source File | 2026-06-21 |

## 2. Top-Level Directory Breakdown

| Directory | Project Files | Project Size | Total Size | Build Systems | Notes |
|-----------|--------------|-------------|------------|---------------|-------|
| `node_modules` | 0 | 0 B | 1021.42 MB | - | build artifact |
| `prisma` | 1 | 22.12 KB | 22.12 KB | - |  |
| `scripts` | 2 | 1.34 KB | 1.34 KB | - |  |
| `src` | 127 | 403.28 KB | 403.28 KB | - |  |

## 3. Source File Statistics by Tech Stack (project files only)

| Tech Stack | File Count | Total Size |
|------------|------------|------------|
| C/C++ | 0 | 0 B |
| Java/Android | 0 | 0 B |
| iOS (OC/Swift) | 0 | 0 B |
| C#/.NET | 0 | 0 B |
| Web/JS/TS | 131 | 374.49 KB |
| CSS/Style | 1 | 5.77 KB |

## 4. Third-Party Dependencies Detected

| Library | Version | Locations | Files | Size |
|---------|---------|-----------|------:|-----:|
| sqlite | unknown | `node_modules\kysely\dist\cjs\dialect\sqlite`, `node_modules\kysely\dist\esm\dialect\sqlite` | 24 | 41.63 KB |

**Third-party container directories** (may contain multiple libraries):

- `node_modules\@babel\core\lib\vendor/` (2 files, 147.98 KB)
- `node_modules\@clerk\nextjs\dist\cjs\vendor/` (1 files, 15.43 KB)
- `node_modules\@clerk\nextjs\dist\esm\vendor/` (1 files, 14.96 KB)
- `node_modules\@clerk\nextjs\dist\types\vendor/` (2 files, 367 B)
- `node_modules\@neondatabase\neon-js\src\vendor/` (2 files, 16.28 KB)
- `node_modules\confbox\dist\_chunks\libs/` (6 files, 101.64 KB)
- `node_modules\nypm\node_modules\citty\dist\_chunks\libs/` (1 files, 1.91 KB)

## 5. Suspected Code Duplication (directories appearing 3+ times)

### `jobs/` (5 occurrences)
- `src\app\admin\jobs`
- `src\app\api\admin\jobs`
- `src\app\api\jobs`
- `src\app\dashboard\jobs`
- `src\app\recruiter\jobs`

### `[id]/` (5 occurrences)
- `src\app\api\applications\[id]`
- `src\app\api\certifications\[id]`
- `src\app\api\jobs\[id]`
- `src\app\recruiter\candidate\[id]`
- `src\app\recruiter\jobs\[id]`

### `recruiter/` (4 occurrences)
- `src\app\api\onboarding\recruiter`
- `src\app\api\recruiter`
- `src\app\onboarding\recruiter`
- `src\app\recruiter`

### `certifications/` (3 occurrences)
- `src\app\admin\certifications`
- `src\app\api\certifications`
- `src\app\dashboard\certifications`

### `skills/` (3 occurrences)
- `src\app\api\candidate\skills`
- `src\app\api\skills`
- `src\app\dashboard\skills`

### `search/` (3 occurrences)
- `src\app\api\candidate\search`
- `src\app\api\skills\search`
- `src\app\recruiter\search`


## 6. Directory Tree (noise filtered, third-party marked)

```text
cybertech-ai/
├── .claude/
├── .vercel/
├── prisma/
├── scripts/
└── src/
    ├── __tests__/
    ├── app/
    │   ├── admin/
    │   ├── api/
    │   ├── choose-role/
    │   ├── dashboard/
    │   ├── onboarding/
    │   ├── recruiter/
    │   ├── sign-in/
    │   └── sign-up/
    ├── components/
    └── lib/
        ├── __tests__/
        └── certificate-validation/
```

## 7. Git Repositories & Activity

Found **1** git repositories.

| Repository | Total Commits | Recent (1yr) | Last Commit |
|-----------|---------------|-------------|-------------|
| `(root)` | 53 | 53 | 2026-06-21 |

## 8. Noise Directory Summary

| Type | Occurrences (files) | Total Size |
|------|--------------------:|------------|
| `.next/` | 3995 | 1.46 GB |
| `node_modules/` | 69315 | 1.28 GB |
| `dist/` | 30348 | 340.81 MB |
| `build/` | 2672 | 60.54 MB |
| `generated/` | 47 | 1.69 MB |
| `.git/` | 428 | 1.18 MB |
| `bin/` | 26 | 95.53 KB |
| `packages/` | 4 | 1.84 KB |