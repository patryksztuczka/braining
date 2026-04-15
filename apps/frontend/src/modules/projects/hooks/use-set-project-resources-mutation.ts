import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setProjectResources } from '@/data-access-layer/projects';

export function useSetProjectResourcesMutation(projectId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (prefixes: string[]) => {
      if (!projectId) throw new Error('Project id is required');
      return setProjectResources(projectId, prefixes);
    },
    onSuccess: () => {
      if (!projectId) return;
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'resources'] });
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'notes'] });
    },
  });
}
