import { useQuery } from '@tanstack/react-query';
import { fetchProjectResources } from '@/data-access-layer/projects';

export function useProjectResourcesQuery(projectId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['projects', projectId, 'resources'],
    enabled: !!projectId && enabled,
    queryFn: () => fetchProjectResources(projectId!),
  });
}
