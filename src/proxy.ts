import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/onboarding(.*)",
  "/choose-role(.*)",
  "/",
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  // Routes publiques
  if (isPublicRoute(request)) return NextResponse.next();

  // Non connecté
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // La vérification du rôle admin est gérée dans admin/layout.tsx côté DB
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
