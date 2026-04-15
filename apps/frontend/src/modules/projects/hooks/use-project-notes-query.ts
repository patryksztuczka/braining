import { useQuery } from '@tanstack/react-query';
import { fetchProjectNotes, type ProjectNote } from '@/data-access-layer/projects';

export type { ProjectNote };

export function useProjectNotesQuery(projectId: string | undefined) {
  return useQuery({
    queryKey: ['projects', projectId, 'notes'],
    enabled: !!projectId,
    queryFn: () => fetchProjectNotes(projectId!),
  });
}
