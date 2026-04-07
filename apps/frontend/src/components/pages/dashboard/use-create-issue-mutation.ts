import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AUTH_BASE_URL } from '@/lib/auth-client';
import type { IssueStatus } from './dashboard-types';

type CreateIssueInput = {
  name: string;
  status: IssueStatus;
};

async function createIssue(input: CreateIssueInput) {
  const response = await fetch(`${AUTH_BASE_URL}/api/issues`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(input),
  });

  const payload = (await response.json().catch(() => null)) as
    | { data?: unknown; error?: string }
    | null;

  if (!response.ok) {
    throw new Error(payload?.error || 'Failed to create issue');
  }

  return payload?.data;
}

export function useCreateIssueMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
    },
  });
}
