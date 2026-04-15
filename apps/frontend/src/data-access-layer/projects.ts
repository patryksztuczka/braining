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

export async function fetchProjects() {
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

const projectResourceSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  userId: z.string(),
  prefix: z.string(),
  createdAt: z.union([z.string(), z.number()]),
});

const projectResourcesResponseSchema = z.object({
  data: z.array(projectResourceSchema).default([]),
});

const projectNoteSchema = z.object({
  id: z.string(),
  title: z.string(),
  path: z.string(),
  excerpt: z.string(),
  wordCount: z.number(),
  updatedAt: z.string(),
});

const projectNotesResponseSchema = z.object({
  data: z.array(projectNoteSchema).default([]),
});

export type ProjectResource = z.infer<typeof projectResourceSchema>;
export type ProjectNote = z.infer<typeof projectNoteSchema>;

export async function fetchProjectResources(projectId: string) {
  const response = await fetch(`${AUTH_BASE_URL}/api/projects/${projectId}/resources`, {
    credentials: 'include',
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const errorPayload = z.object({ error: z.string().optional() }).nullable().safeParse(payload);
    throw new Error(
      (errorPayload.success && errorPayload.data?.error) || 'Failed to fetch project resources',
    );
  }

  return projectResourcesResponseSchema.parse(payload).data;
}

export async function setProjectResources(projectId: string, prefixes: string[]) {
  const response = await fetch(`${AUTH_BASE_URL}/api/projects/${projectId}/resources`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ prefixes }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const errorPayload = z.object({ error: z.string().optional() }).nullable().safeParse(payload);
    throw new Error(
      (errorPayload.success && errorPayload.data?.error) || 'Failed to update project resources',
    );
  }

  return projectResourcesResponseSchema.parse(payload).data;
}

export async function fetchProjectNotes(projectId: string) {
  const response = await fetch(`${AUTH_BASE_URL}/api/projects/${projectId}/notes`, {
    credentials: 'include',
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const errorPayload = z.object({ error: z.string().optional() }).nullable().safeParse(payload);
    throw new Error(
      (errorPayload.success && errorPayload.data?.error) || 'Failed to fetch project notes',
    );
  }

  return projectNotesResponseSchema.parse(payload).data;
}

export type CreateProjectFromNotesItem = {
  name: string;
  key: string;
  description: string;
  prefix: string;
};

export async function createProjectsFromNotes(items: CreateProjectFromNotesItem[]) {
  const response = await fetch(`${AUTH_BASE_URL}/api/projects/from-notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ items }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const errorPayload = z.object({ error: z.string().optional() }).nullable().safeParse(payload);
    throw new Error(
      (errorPayload.success && errorPayload.data?.error) || 'Failed to create projects from notes',
    );
  }

  return projectsResponseSchema.parse(payload).data;
}

export async function createProject(input: CreateProjectInput) {
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
