import { z } from 'zod';

export const detectionTextSchema = z.object({
  title: z.string().max(140).optional(),
  language: z.string().max(16).optional(),
  text: z.string().min(60, 'Provide at least 60 characters for reliable analysis.').max(25000),
});

export const humanizeTextSchema = z.object({
  text: z.string().min(60, 'Provide at least 60 characters to humanize effectively.').max(25000),
  language: z.string().max(16).optional(),
  intensity: z.number().int().min(1).max(3),
  style: z.enum(['balanced', 'casual', 'professional']),
});

export type DetectionTextValues = z.infer<typeof detectionTextSchema>;
export type HumanizeTextValues = z.infer<typeof humanizeTextSchema>;
