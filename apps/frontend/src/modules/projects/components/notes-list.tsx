import { FileText, MoreHorizontal } from 'lucide-react';
import { formatRelative } from '../lib/format-date';
import type { ProjectNote } from '../hooks/use-project-notes-query';

export function NotesList({ notes }: { notes: ProjectNote[] }) {
  return (
    <div>
      {notes.map((note, index) => (
        <div
          key={note.id}
          className="motion-safe:animate-stagger-in group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-white/[0.03] px-2 py-2.5 transition-colors last:border-0 hover:bg-white/[0.03]"
          style={{ animationDelay: `${index * 40 + 80}ms` }}
        >
          <FileText className="size-3.5 text-white/30" />

          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="font-dm truncate text-[13px] font-medium text-white/85">
                {note.title}
              </span>
              <span className="shrink-0 font-mono text-[10px] text-white/25">{note.path}</span>
            </div>
            <p className="font-dm mt-0.5 truncate text-[11px] text-white/35">{note.excerpt}</p>
          </div>

          <div className="flex shrink-0 items-center gap-4">
            <span className="font-mono text-[10px] text-white/25">
              {note.wordCount.toLocaleString()} w
            </span>
            <span className="font-dm text-[11px] text-white/30">
              {formatRelative(note.updatedAt)}
            </span>
            <button className="flex size-6 items-center justify-center rounded-lg text-white/20 opacity-0 transition-all group-hover:opacity-100 hover:bg-white/[0.06] hover:text-white/50">
              <MoreHorizontal className="size-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
