import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, 'Project name is required'),
  key: z
    .string()
    .trim()
    .min(1, 'Key is required')
    .max(5, 'Key must be 5 characters or less')
    .regex(/^[A-Z]+$/, 'Key must be uppercase letters only'),
  description: z.string().trim().default(''),
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;

export const setProjectResourcesSchema = z.object({
  prefixes: z.array(z.string().trim().min(1)).default([]),
});

export type SetProjectResourcesSchema = z.infer<typeof setProjectResourcesSchema>;

export const createProjectsFromNotesSchema = z.object({
  items: z
    .array(
      z.object({
        name: z.string().trim().min(1, 'Project name is required'),
        key: z
          .string()
          .trim()
          .min(1, 'Key is required')
          .max(5, 'Key must be 5 characters or less')
          .regex(/^[A-Z]+$/, 'Key must be uppercase letters only'),
        description: z.string().trim().default(''),
        prefix: z.string().trim().min(1, 'Prefix is required'),
      }),
    )
    .min(1, 'Select at least one directory'),
});

export type CreateProjectsFromNotesSchema = z.infer<typeof createProjectsFromNotesSchema>;
