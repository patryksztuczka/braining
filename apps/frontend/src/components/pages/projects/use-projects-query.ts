import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '@/data-access-layer/projects';

export function useProjectsQuery() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });
}
