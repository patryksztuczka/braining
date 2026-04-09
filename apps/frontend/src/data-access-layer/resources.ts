import { AUTH_BASE_URL } from '@/lib/auth-client';
import { z } from 'zod';

const resourceDirectorySchema = z.object({
  name: z.string(),
  prefix: z.string(),
});

const resourcesResponseSchema = z.object({
  data: z.array(resourceDirectorySchema).default([]),
});

export type ResourceDirectory = z.infer<typeof resourceDirectorySchema>;

export async function fetchResources() {
  const response = await fetch(`${AUTH_BASE_URL}/api/resources`, {
    credentials: 'include',
  });

  const payload = await response.json();

  if (!response.ok) {
    const errorPayload = z.object({ error: z.string().optional() }).nullable().safeParse(payload);
    throw new Error(errorPayload.success ? errorPayload.data?.error : 'Failed to fetch resources');
  }

  return resourcesResponseSchema.parse(payload).data;
}
