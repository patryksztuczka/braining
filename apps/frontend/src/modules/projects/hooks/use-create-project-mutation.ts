import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProject } from '@/data-access-layer/projects';

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
