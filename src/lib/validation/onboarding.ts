// Validation schema for candidate onboarding POST payload
import { z } from "zod";

export const onboardingSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom de famille est requis"),
  headline: z.string().optional(),
  location: z.string().optional(),
  country: z.string().optional(),
  githubUsername: z.string().optional(),
  bio: z.string().optional(),
});
