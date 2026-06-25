// Validation schema for recruiter onboarding POST payload
import { z } from "zod";

export const onboardingRecruiterSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis").max(100),
  lastName: z.string().min(1, "Le nom de famille est requis").max(100),
  jobTitle: z.string().max(200).optional(),
  companyName: z.string().min(1, "Le nom de l'entreprise est requis").max(200),
  companySize: z.string().max(50).optional(),
  companyIndustry: z.string().max(100).optional(),
  phoneNumber: z.string().max(50).optional(),
  linkedinUrl: z.string().url().max(500).optional(),
});
