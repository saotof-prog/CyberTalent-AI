import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ADMIN_ID = "user_3EAT5iB7v76L1L4QQ2uldeubkpW";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/onboarding(.*)",
  "/choose-role(.*)",
  "/",
]);

const isCandidateRoute = createRouteMatcher(["/dashboard(.*)"]);
const isRecruiterRoute = createRouteMatcher(["/recruiter(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  // Routes publiques
  if (isPublicRoute(request)) return NextResponse.next();

  // Non connecté
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Admin — accès total sauf /admin qui est réservé
  if (userId === ADMIN_ID) {
    if (isAdminRoute(request)) return NextResponse.next();
    return NextResponse.next();
  }

  // Non-admin qui essaie d'accéder à /admin
  if (isAdminRoute(request)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Récupérer le rôle depuis la DB
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  const role = user?.role;

  // Pas encore de rôle → choose-role
  if (!role && !isPublicRoute(request)) {
    return NextResponse.redirect(new URL("/choose-role", request.url));
  }

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