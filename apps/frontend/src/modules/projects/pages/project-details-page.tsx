import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, ChevronRight, FileText, FolderSync, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyNotesState } from '../components/empty-notes-state';
import { ImportNotesDialog } from '../components/import-notes-dialog';
import { NotesList } from '../components/notes-list';
import { ResourceTab } from '../components/resource-tab';
import { useProjectNotesQuery } from '../hooks/use-project-notes-query';
import { useProjectQuery } from '../hooks/use-project-query';
import { formatDate } from '../lib/format-date';

export function ProjectDetailsPage() {
  const { projectId } = useParams();
  const { data: project, isLoading, isError, error } = useProjectQuery(projectId);
  const { data: notes = [], isLoading: notesLoading } = useProjectNotesQuery(projectId);

  const [importOpen, setImportOpen] = useState(false);
  const [query] = useState('');
  const [activeResource, setActiveResource] = useState<'notes'>('notes');

  const normalized = query.trim().toLowerCase();
  const visibleNotes = useMemo(
    () =>
      normalized
        ? notes.filter(
            (note) =>
              note.title.toLowerCase().includes(normalized) ||
              note.path.toLowerCase().includes(normalized) ||
              note.excerpt.toLowerCase().includes(normalized),
          )
        : notes,
    [normalized, notes],
  );

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center px-6">
        <p className="font-dm text-[13px] text-white/30">Loading project...</p>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-6">
        <p className="font-dm text-[15px] font-medium text-white/80">Project not found.</p>
        <p className="font-dm text-[12px] text-white/35">
          {error instanceof Error ? error.message : 'The project you are looking for is missing.'}
        </p>
        <Link
          to="/projects"
          className="font-dm mt-2 inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[12px] text-white/70 transition-all hover:border-white/[0.15] hover:bg-white/[0.07] hover:text-white/90"
        >
          <ArrowLeft className="size-3" />
          Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <div className="motion-safe:animate-fade-in flex shrink-0 items-center gap-1.5 px-6 pt-3 pb-3">
        <Link
          to="/projects"
          className="font-dm group inline-flex items-center gap-1 text-[11px] text-white/30 transition-colors hover:text-white/60"
        >
          <ArrowLeft className="size-2.5 transition-transform group-hover:-translate-x-0.5" />
          All projects
        </Link>
        <ChevronRight className="size-2.5 text-white/15" />
        <span className="font-dm text-[11px] text-white/50">
          {`${project.key} - ${project.name}`}
        </span>
      </div>

      <div className="motion-safe:animate-fade-in min-h-0 flex-1 overflow-y-auto px-6 pb-6 motion-safe:[animation-delay:0.08s]">
        <section className="flex items-start justify-between gap-4 pt-1 pb-4">
          <div className="min-w-0 flex-1">
            <span className="font-mono text-[10px] text-white/25">
              Created {formatDate(project.createdAt)}
            </span>
            <h1 className="font-dm mt-1.5 mb-2.5 text-[22px] font-semibold tracking-[-0.4px] text-white/95">
              {project.name}
            </h1>
            {project.description.length > 0 ? (
              <p className="font-dm max-w-[640px] text-[13px] leading-[1.55] text-white/50">
                {project.description}
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <Button
              size="sm"
              className="font-dm gap-1.5 rounded-[10px] border-(--accent)/20 bg-(--accent)/15 text-(--accent) hover:bg-(--accent)/25"
              onClick={() => setImportOpen(true)}
            >
              <FolderSync className="size-3" />
              Import notes
            </Button>
            <button className="flex size-7 items-center justify-center rounded-lg text-white/25 transition-all hover:bg-white/[0.05] hover:text-white/60">
              <MoreHorizontal className="size-3.5" />
            </button>
          </div>
        </section>

        <section className="motion-safe:animate-fade-in mt-2 motion-safe:[animation-delay:0.15s]">
          <div className="flex items-center justify-between pb-3">
            <ResourceTab
              active={activeResource === 'notes'}
              onClick={() => setActiveResource('notes')}
              label="Notes"
              count={notes.length}
              icon={<FileText className="size-3" />}
            />
            <span className="font-dm text-[11px] text-white/30">
              {notesLoading
                ? 'Syncing...'
                : `${visibleNotes.length} ${visibleNotes.length === 1 ? 'note' : 'notes'}`}
            </span>
          </div>

          {notesLoading ? (
            <div className="py-10 text-center">
              <p className="font-dm text-[13px] text-white/25">Loading notes...</p>
            </div>
          ) : visibleNotes.length === 0 ? (
            <EmptyNotesState hasQuery={!!normalized} onImport={() => setImportOpen(true)} />
          ) : (
            <NotesList notes={visibleNotes} />
          )}
        </section>
      </div>

      <ImportNotesDialog open={importOpen} onOpenChange={setImportOpen} projectId={projectId} />
    </div>
  );
}
