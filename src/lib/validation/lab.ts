// Validation schema for lab completion POST payload
import { z } from "zod";
import { LabPlatform, LabDifficulty } from "@prisma/client";

export const labSchema = z.object({
  platform: z.nativeEnum(LabPlatform),
  labName: z.string().min(1, "Le nom du lab est requis"),
  labId: z.string().optional(),
  difficulty: z.nativeEnum(LabDifficulty),
  category: z.string().optional(),
  completedAt: z.string().refine((v) => !isNaN(Date.parse(v)), { message: "Date de complétion invalide" }),
  proofUrl: z.string().url().optional(),
});
