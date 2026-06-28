import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/onboarding(.*)",
  "/choose-role(.*)",
  "/",
]);

const isApiRoute = createRouteMatcher(["/api(.*)"]);

const CSP_HEADER = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.clerk.accounts.dev https://*.clerk.com https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline' https://*.clerk.accounts.dev",
  "img-src 'self' data: blob: https://*.clerk.com https://*.clerk.accounts.dev https://img.clerk.com https://avatars.githubusercontent.com https://*.githubusercontent.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.clerk.com https://*.clerk.accounts.dev https://api.github.com https://generativelanguage.googleapis.com",
  "frame-src 'self' https://*.clerk.com https://*.clerk.accounts.dev https://accounts.dev",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

function applySecurityHeaders(response: NextResponse): void {
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "0");
  response.headers.set("Content-Security-Policy", CSP_HEADER);
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
}

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();
  const response = NextResponse.next();

  if (isPublicRoute(request)) {
    applySecurityHeaders(response);
    return response;
  }

  if (!userId) {
    if (isApiRoute(request)) {
      return NextResponse.json({ error: "Non autorisé", code: "UNAUTHORIZED" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  applySecurityHeaders(response);
  return response;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
