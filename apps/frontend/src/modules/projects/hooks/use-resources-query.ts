import { useQuery } from '@tanstack/react-query';
import { fetchResources } from '@/data-access-layer/resources';

export function useResourcesQuery(enabled: boolean) {
  return useQuery({
    queryKey: ['resources'],
    queryFn: fetchResources,
    enabled,
  });
}
