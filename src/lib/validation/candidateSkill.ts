// Validation schema for candidate skill POST payload
import { z } from "zod";
import { SkillLevel } from "@prisma/client";

export const candidateSkillSchema = z.object({
  skillName: z.string().min(1, "Le nom du skill est requis").max(100),
  category: z.string().max(100).optional(),
  level: z.nativeEnum(SkillLevel).optional(),
  yearsExp: z.number().nonnegative().max(100).nullish(),
});
