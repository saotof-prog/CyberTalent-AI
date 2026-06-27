import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/onboarding(.*)",
  "/choose-role(.*)",
  "/",
]);

const CSP_HEADER = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.clerk.accounts.dev https://*.clerk.com https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline' https://*.clerk.accounts.dev",
  "img-src 'self' data: blob: https://*.clerk.com https://*.clerk.accounts.dev https://img.clerk.com https://avatars.githubusercontent.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.clerk.com https://*.clerk.accounts.dev https://api.github.com https://generativelanguage.googleapis.com",
  "frame-src 'self' https://*.clerk.com https://*.clerk.accounts.dev https://accounts.dev",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  if (isPublicRoute(request)) {
    const response = NextResponse.next();
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("X-XSS-Protection", "0");
    response.headers.set("Content-Security-Policy", CSP_HEADER);
    return response;
  }

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const response = NextResponse.next();
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "0");
  response.headers.set("Content-Security-Policy", CSP_HEADER);
  return response;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
