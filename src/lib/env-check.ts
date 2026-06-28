const REQUIRED_ENV_VARS = [
  "DATABASE_URL",
  "DIRECT_URL",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "GEMINI_API_KEY",
  "GITHUB_TOKEN",
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_CLERK_SIGN_IN_URL",
  "NEXT_PUBLIC_CLERK_SIGN_UP_URL",
  "NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL",
  "NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL",
];

const SUSPICIOUS_PATTERNS = [
  /^pk_test_/,
  /^sk_test_/,
  /^ghp_/,
  /^github_pat_/,
  /^gho_/,
  /^ghu_/,
  /^ghs_/,
];

export function validateEnvironment(): string[] {
  const warnings: string[] = [];

  for (const varName of REQUIRED_ENV_VARS) {
    const value = process.env[varName];
    if (!value) {
      warnings.push(`⚠️  ${varName} n'est pas défini`);
    }
  }

  for (const varName of Object.keys(process.env)) {
    const value = process.env[varName] ?? "";
    for (const pattern of SUSPICIOUS_PATTERNS) {
      if (pattern.test(value)) {
        if (varName.includes("PUBLIC")) continue;
        warnings.push(`🚨 ${varName} semble contenir une clé de TEST/échantillon — remplacer par une clé de production`);
      }
    }
  }

  return warnings;
}
