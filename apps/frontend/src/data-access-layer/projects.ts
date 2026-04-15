import { AUTH_BASE_URL } from '@/lib/auth-client';
import { z } from 'zod';

const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  key: z.string(),
  description: z.string(),
  createdAt: z.string(),
  userId: z.string(),
});

const projectsResponseSchema = z.object({
  data: z.array(projectSchema).default([]),
});

const projectResponseSchema = z.object({
  data: projectSchema,
});

export type Project = z.infer<typeof projectSchema>;

export type CreateProjectInput = {
  name: string;
  key: string;
  description: string;
};

export async function fetchProjects(): Promise<Project[]> {
  const response = await fetch(`${AUTH_BASE_URL}/api/projects`, {
    credentials: 'include',
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const errorPayload = z.object({ error: z.string().optional() }).nullable().safeParse(payload);
    throw new Error(
      (errorPayload.success && errorPayload.data?.error) || 'Failed to fetch projects',
    );
  }

  return projectsResponseSchema.parse(payload).data;
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  const response = await fetch(`${AUTH_BASE_URL}/api/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(input),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const errorPayload = z.object({ error: z.string().optional() }).nullable().safeParse(payload);
    throw new Error(
      (errorPayload.success && errorPayload.data?.error) || 'Failed to create project',
    );
  }

  return projectResponseSchema.parse(payload).data;
}
