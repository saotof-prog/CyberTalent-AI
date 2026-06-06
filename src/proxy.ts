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

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  // Routes publiques
  if (isPublicRoute(request)) return NextResponse.next();

  // Non connecté
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Admin
  if (userId === ADMIN_ID) {
    if (isAdminRoute(request)) return NextResponse.next();
    return NextResponse.next();
  }

  // Non-admin qui essaie d'accéder à /admin
  if (isAdminRoute(request)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};