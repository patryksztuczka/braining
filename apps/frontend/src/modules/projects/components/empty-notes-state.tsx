import { FileText, FolderSync } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EmptyNotesState({
  hasQuery,
  onImport,
}: {
  hasQuery: boolean;
  onImport: () => void;
}) {
  if (hasQuery) {
    return (
      <div className="py-12 text-center">
        <p className="font-dm text-[13px] text-white/40">No matches.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <div className="flex size-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03]">
        <FileText className="size-4 text-white/30" />
      </div>
      <div>
        <p className="font-dm text-[14px] font-medium text-white/80">No notes yet</p>
        <p className="font-dm mt-1 max-w-[380px] text-[12px] leading-[1.55] text-white/35">
          Pull markdown from your storage to start mining the ideas inside.
        </p>
      </div>
      <Button
        size="sm"
        onClick={onImport}
        className="font-dm mt-1 gap-1.5 rounded-[10px] border-(--accent)/20 bg-(--accent)/15 text-[12px] text-(--accent) hover:bg-(--accent)/25"
      >
        <FolderSync className="size-3" />
        Import from Notes
      </Button>
    </div>
  );
}
