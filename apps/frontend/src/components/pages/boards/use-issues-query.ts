import { useQuery } from '@tanstack/react-query';
import { AUTH_BASE_URL } from '@/lib/auth-client';
import type { Issue, IssuesResponse } from './boards-types';

async function fetchIssues(): Promise<Issue[]> {
  const response = await fetch(`${AUTH_BASE_URL}/api/issues`, {
    credentials: 'include',
  });

  const payload = (await response.json().catch(() => null)) as
    | IssuesResponse
    | { error?: string }
    | null;

  if (!response.ok) {
    throw new Error(
      payload && 'error' in payload
        ? payload.error || 'Failed to fetch issues'
        : 'Failed to fetch issues',
    );
  }

  return payload && 'data' in payload && Array.isArray(payload.data) ? payload.data : [];
}

export function useIssuesQuery() {
  return useQuery({
    queryKey: ['issues'],
    queryFn: fetchIssues,
  });
}
