// Validation schema for certification POST payload
import { z } from "zod";

export const certificationSchema = z.object({
  name: z.string().min(1, "Le nom de la certification est requis"),
  fullName: z.string().optional(),
  issuer: z.string().min(1, "L'organisme émetteur est requis"),
  issuedAt: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Date d'émission invalide" }),
  expiresAt: z
    .string()
    .optional()
    .refine((val) => (val ? !isNaN(Date.parse(val)) : true), { message: "Date d'expiration invalide" }),
  credentialUrl: z.string().url().optional(),
});
