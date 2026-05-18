// backend/src/validators/ad.validator.ts
import { z } from 'zod';

export const createAdSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  price: z.number().positive('Price must be greater than 0'),
  categoryId: z.string().min(1, 'Category is required'),
  location: z.string().min(2, 'Location is required'),
  days: z.number().min(1).max(30).default(7),
  isFeatured: z.boolean().default(false),
});