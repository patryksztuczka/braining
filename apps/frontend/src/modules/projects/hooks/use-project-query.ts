import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProjects, type Project } from '@/data-access-layer/projects';

export function useProjectQuery(id: string | undefined) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['projects', id],
    enabled: !!id,
    queryFn: async () => {
      const cached = queryClient.getQueryData<Project[]>(['projects']);
      const hit = cached?.find((project) => project.id === id);
      if (hit) return hit;

      const fresh = await fetchProjects();
      queryClient.setQueryData(['projects'], fresh);
      const match = fresh.find((project) => project.id === id);
      if (!match) throw new Error('Project not found');
      return match;
    },
  });
}
