// Validation schema for job posting POST payload
import { z } from "zod";
import { JobType, JobMode } from "@prisma/client";

export const jobSchema = z.object({
  title: z.string().min(1, "Le titre du poste est requis"),
  description: z.string().min(1, "La description du poste est requise"),
  type: z.nativeEnum(JobType),
  mode: z.nativeEnum(JobMode),
  country: z.string().optional(),
  minScore: z.number().int().nonnegative().optional(),
  salaryMin: z.number().int().nonnegative().optional(),
  salaryMax: z.number().int().nonnegative().optional(),
  isUrgent: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  // requirements, responsibilities etc. can be added as needed
});
