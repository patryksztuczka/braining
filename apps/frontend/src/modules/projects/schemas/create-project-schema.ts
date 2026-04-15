import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, 'Project name is required'),
  key: z
    .string()
    .trim()
    .min(1, 'Key is required')
    .max(5, 'Key must be 5 characters or less')
    .regex(/^[A-Z]+$/, 'Key must be uppercase letters only'),
  description: z.string().trim(),
});

export type CreateProjectFormData = z.infer<typeof createProjectSchema>;
