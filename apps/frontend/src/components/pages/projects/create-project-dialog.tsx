import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCreateProjectMutation } from './use-create-project-mutation';
import { createProjectSchema, type CreateProjectFormData } from './create-project-schema';

export function CreateProjectDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { name: '', key: '', description: '' },
  });

  const createMutation = useCreateProjectMutation();

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  function onFormSubmit(data: CreateProjectFormData) {
    createMutation.mutate(data, {
      onSuccess: () => {
        onOpenChange(false);
      },
      onError: (error) => {
        setError('root', { message: error.message });
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden border border-white/[0.07] bg-[#161619]/95 p-0 shadow-[0_24px_80px_rgba(0,0,0,0.6)] ring-0 backdrop-blur-xl sm:max-w-[420px]"
      >
        <DialogHeader className="px-5 pt-5 pb-4">
          <DialogTitle className="font-dm text-[14px] font-semibold tracking-[-0.2px] text-white/90">
            New project
          </DialogTitle>
          <DialogDescription className="font-dm text-[12px] text-white/35">
            Create a project to organize your team's work.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="space-y-4 px-5 pb-5">
            <div className="space-y-1.5">
              <label className="font-dm text-[11px] font-medium tracking-wide text-white/40 uppercase">
                Project name
              </label>
              <input
                {...register('name')}
                type="text"
                placeholder="e.g. Frontend Application"
                autoComplete="off"
                data-1p-ignore
                className="font-dm h-8 w-full rounded-lg border border-white/[0.07] bg-white/[0.04] px-3 text-[13px] text-white/90 transition-all placeholder:text-white/20 focus:border-(--accent)/25 focus:bg-white/[0.06] focus:outline-none"
                autoFocus
              />
              {errors.name && (
                <p className="font-dm text-[11px] text-red-400/80">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="font-dm block text-[11px] font-medium tracking-wide text-white/40 uppercase">
                Identifier
              </label>
              <input
                {...register('key')}
                type="text"
                placeholder="e.g. FE"
                autoComplete="off"
                data-1p-ignore
                className="font-dm h-8 w-24 rounded-lg border border-white/[0.07] bg-white/[0.04] px-3 text-[13px] text-white/90 uppercase transition-all placeholder:text-white/20 placeholder:normal-case focus:border-(--accent)/25 focus:bg-white/[0.06] focus:outline-none"
              />
              {errors.key && (
                <p className="font-dm text-[11px] text-red-400/80">{errors.key.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="font-dm text-[11px] font-medium tracking-wide text-white/40 uppercase">
                Description
              </label>
              <textarea
                {...register('description')}
                placeholder="What is this project about?"
                rows={2}
                className="font-dm w-full resize-none rounded-lg border border-white/[0.07] bg-white/[0.04] px-3 py-2 text-[13px] text-white/90 transition-all placeholder:text-white/20 focus:border-(--accent)/25 focus:bg-white/[0.06] focus:outline-none"
              />
            </div>
          </div>

          {errors.root && (
            <p className="font-dm px-5 pb-3 text-[11px] text-red-400/80">{errors.root.message}</p>
          )}

          <div className="flex items-center justify-end gap-2 border-t border-white/[0.05] bg-white/[0.02] px-5 py-3.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
              className="font-dm text-[12px] text-white/40 hover:bg-white/[0.04] hover:text-white/60"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={createMutation.isPending}
              className="font-dm gap-1.5 rounded-[10px] border-(--accent)/20 bg-(--accent)/15 text-[12px] text-(--accent) hover:bg-(--accent)/25"
            >
              {createMutation.isPending ? 'Creating...' : 'Create project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
