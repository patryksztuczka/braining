import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createProjectsFromNotes,
  type CreateProjectFromNotesItem,
} from '@/data-access-layer/projects';

export function useCreateProjectsFromNotesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: CreateProjectFromNotesItem[]) => createProjectsFromNotes(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
