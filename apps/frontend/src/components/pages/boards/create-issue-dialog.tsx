import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { STATUS_CONFIG, STATUS_ORDER } from './boards-constants';

const createIssueSchema = z.object({
  name: z.string().trim().min(1, 'Issue name is required'),
  status: z.enum(['todo', 'in_progress', 'done']),
});

type CreateIssueFormData = z.infer<typeof createIssueSchema>;

type CreateIssueDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateIssueFormData) => Promise<void>;
};

export function CreateIssueDialog({ open, onOpenChange, onSubmit }: CreateIssueDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateIssueFormData>({
    resolver: zodResolver(createIssueSchema),
    defaultValues: { name: '', status: 'todo' },
  });

  const status = watch('status');

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  async function onFormSubmit(data: CreateIssueFormData) {
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch {
      /* keep dialog open on error */
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden border border-white/[0.07] bg-[#161619]/95 p-0 shadow-[0_24px_80px_rgba(0,0,0,0.6)] ring-0 backdrop-blur-xl sm:max-w-[420px]"
      >
        <DialogHeader className="px-5 pt-5 pb-4">
          <DialogTitle className="font-dm text-[14px] font-semibold tracking-[-0.2px] text-white/90">
            New issue
          </DialogTitle>
          <DialogDescription className="font-dm text-[12px] text-white/35">
            Create an issue to track in your sprint board.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="space-y-4 px-5 pb-5">
            <div className="space-y-1.5">
              <label className="font-dm text-[11px] font-medium tracking-wide text-white/40 uppercase">
                Issue name
              </label>
              <input
                {...register('name')}
                type="text"
                placeholder="e.g. Fix sidebar navigation bug"
                autoComplete="off"
                data-1p-ignore
                disabled={isSubmitting}
                className="font-dm h-8 w-full rounded-lg border border-white/[0.07] bg-white/[0.04] px-3 text-[13px] text-white/90 transition-all placeholder:text-white/20 focus:border-(--accent)/25 focus:bg-white/[0.06] focus:outline-none disabled:opacity-50"
                autoFocus
              />
              {errors.name && (
                <p className="font-dm text-[11px] text-red-400/80">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="font-dm text-[11px] font-medium tracking-wide text-white/40 uppercase">
                Status
              </label>
              <div className="flex gap-1.5">
                {STATUS_ORDER.map((s) => {
                  const config = STATUS_CONFIG[s];
                  const isActive = status === s;

                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setValue('status', s)}
                      className={`font-dm flex h-8 flex-1 items-center justify-center gap-2 rounded-lg border text-[12px] font-medium transition-all disabled:opacity-50 ${
                        isActive
                          ? 'border-white/10 bg-white/[0.08] text-white/80'
                          : 'border-white/[0.04] bg-white/[0.02] text-white/30 hover:border-white/[0.07] hover:bg-white/[0.04] hover:text-white/50'
                      }`}
                    >
                      <span
                        className="size-2 rounded-full transition-shadow"
                        style={{
                          background: config.color,
                          boxShadow: isActive ? `0 0 8px ${config.color}50` : 'none',
                        }}
                      />
                      {config.title}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-white/[0.05] bg-white/[0.02] px-5 py-3.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
              className="font-dm text-[12px] text-white/40 hover:bg-white/[0.04] hover:text-white/60"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="font-dm gap-1.5 rounded-[10px] border-(--accent)/20 bg-(--accent)/15 text-[12px] text-(--accent) hover:bg-(--accent)/25 disabled:opacity-40"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create issue'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
