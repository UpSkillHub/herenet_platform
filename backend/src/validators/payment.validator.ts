// backend/src/validators/payment.validator.ts
import { z } from 'zod';

export const paymentSchema = z.object({
  adId: z.string().min(1),
  amount: z.number().positive(),
  days: z.number().min(1),
  isFeatured: z.boolean().default(false),
  paymentMethod: z.string().optional(),
});