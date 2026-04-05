import { z } from "zod";

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
  cpf: z.string().regex(/^\d{11}$/),
  phone: z.string().optional(),
});

export const updateClientSchema = z.object({
  fullName: z.string().min(2).optional(),
  cpf: z.string().regex(/^\d{11}$/).optional(),
  phone: z.string().optional(),
});

export const updateClientStatusSchema = z.object({
  isActive: z.boolean(),
});
