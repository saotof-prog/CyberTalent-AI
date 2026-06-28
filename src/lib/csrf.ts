import { NextResponse } from "next/server";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

const CSRF_HEADER = "x-csrf-token";

export function validateCsrf(request: Request): boolean {
  if (SAFE_METHODS.has(request.method)) return true;

  const csrfToken = request.headers.get(CSRF_HEADER);
  if (!csrfToken) return false;

  if (csrfToken.length < 16 || csrfToken.length > 256) return false;

  if (!/^[A-Za-z0-9_\-+/=]+$/.test(csrfToken)) return false;

  return true;
}

export function csrfProtect(handler: (req: Request, ...args: unknown[]) => Promise<Response>) {
  return async (req: Request, ...args: unknown[]): Promise<Response> => {
    if (!validateCsrf(req)) {
      return NextResponse.json(
        { error: "CSRF token manquant ou invalide", code: "CSRF_VIOLATION" },
        { status: 403 }
      );
    }
    return handler(req, ...args);
  };
}
