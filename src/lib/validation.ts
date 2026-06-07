import { z } from 'zod';

export const waitlistSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  name: z
    .string()
    .max(100, 'Name must be under 100 characters')
    .optional()
    .or(z.literal('')),
  company: z
    .string()
    .max(100, 'Company must be under 100 characters')
    .optional()
    .or(z.literal('')),
  useCase: z
    .string()
    .max(500, 'Use case must be under 500 characters')
    .optional()
    .or(z.literal('')),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;
