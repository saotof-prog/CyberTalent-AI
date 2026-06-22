// Validation schema for recruiter onboarding POST payload
import { z } from "zod";

export const onboardingRecruiterSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom de famille est requis"),
  jobTitle: z.string().optional(),
  companyName: z.string().min(1, "Le nom de l'entreprise est requis"),
  companySize: z.string().optional(),
  companyIndustry: z.string().optional(),
  phoneNumber: z.string().optional(),
  linkedinUrl: z.string().url().optional(),
});
