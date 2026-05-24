import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const ADMIN_ID = "user_3DzGZHTqCcaF4yvqP27rrB2RWBj";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/onboarding(.*)",
  "/choose-role(.*)",
  "/",
]);

const isCandidateRoute = createRouteMatcher([
  "/dashboard(.*)",
]);

const isRecruiterRoute = createRouteMatcher([
  "/recruiter(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  // Routes publiques — tout le monde peut accéder
  if (isPublicRoute(request)) return NextResponse.next();

  // Non connecté → sign-in
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Admin → accès total
  if (userId === ADMIN_ID) return NextResponse.next();

  // Récupérer le rôle depuis les metadata Clerk
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as any)?.role as string | undefined;

  // Candidat essaie d'accéder à l'espace recruteur
  if (isRecruiterRoute(request) && role === "CANDIDATE") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Recruteur essaie d'accéder à l'espace candidat
  if (isCandidateRoute(request) && role === "RECRUITER") {
    return NextResponse.redirect(new URL("/recruiter/dashboard", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};