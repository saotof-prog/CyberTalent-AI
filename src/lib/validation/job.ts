// Validation schema for job posting POST payload
import { z } from "zod";
import { JobType, JobMode } from "@prisma/client";

export const jobSchema = z.object({
  title: z.string().min(1, "Le titre du poste est requis").max(200),
  description: z.string().min(1, "La description du poste est requise").max(5000),
  requirements: z.string().max(5000).optional(),
  location: z.string().max(200).optional(),
  country: z.string().max(100).optional(),
  type: z.nativeEnum(JobType),
  mode: z.nativeEnum(JobMode),
  salaryMin: z.number().int().nonnegative().max(1000000).optional(),
  salaryMax: z.number().int().nonnegative().max(1000000).optional(),
  minScore: z.number().int().nonnegative().max(100).optional(),
  isUrgent: z.boolean().optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
});
