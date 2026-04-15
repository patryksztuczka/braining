import { useQuery } from '@tanstack/react-query';

export type ProjectNote = {
  id: string;
  title: string;
  path: string;
  excerpt: string;
  wordCount: number;
  updatedAt: string;
};

export function useProjectNotesQuery(projectId: string | undefined) {
  return useQuery({
    queryKey: ['projects', projectId, 'notes'],
    enabled: !!projectId,
    queryFn: async (): Promise<ProjectNote[]> => {
      return [];
    },
  });
}
