// URL sanitisation utilities

const shortenerPatterns = [/bit\.ly/i, /tinyurl\.com/i, /short\.link/i, /cutt\.ly/i, /rb\.gy/i];

export function isShortener(url: string): boolean {
  return shortenerPatterns.some((p) => p.test(url));
}

export function isValidHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Returns true if the URL passes validation (http/https, not a shortener).
 */
export function sanitizeUrl(url: string | null): boolean {
  if (!url) return true; // allow empty
  if (!isValidHttpUrl(url)) return false;
  if (isShortener(url)) return false;
  return true;
}
