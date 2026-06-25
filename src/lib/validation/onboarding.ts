// Validation schema for candidate onboarding POST payload
import { z } from "zod";

export const onboardingSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis").max(100),
  lastName: z.string().min(1, "Le nom de famille est requis").max(100),
  headline: z.string().max(200).optional(),
  location: z.string().max(200).optional(),
  country: z.string().max(100).optional(),
  githubUsername: z
    .string()
    .max(100)
    .regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/, "GitHub username invalide")
    .optional()
    .or(z.literal("")),
  bio: z.string().max(2000).optional(),
});
