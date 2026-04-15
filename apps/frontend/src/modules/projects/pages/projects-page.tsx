import { useState } from 'react';
import { Link } from 'react-router';
import { FolderSync, MoreHorizontal, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreateProjectDialog } from '../components/create-project-dialog';
import { CreateProjectsFromNotesDialog } from '../components/create-projects-from-notes-dialog';
import { useProjectsQuery } from '../hooks/use-projects-query';

export function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [createFromNotesOpen, setCreateFromNotesOpen] = useState(false);

  const { data: projects = [], isLoading, isError, error } = useProjectsQuery();

  const normalizedSearch = search.trim().toLowerCase();
  const visibleProjects = normalizedSearch
    ? projects.filter(
        (p) =>
          p.name.toLowerCase().includes(normalizedSearch) ||
          p.key.toLowerCase().includes(normalizedSearch),
      )
    : projects;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="motion-safe:animate-fade-in flex items-center gap-3 px-6 pt-3 pb-4">
        <div className="relative w-60">
          <Search className="absolute top-1/2 left-2.5 size-3 -translate-y-1/2 text-white/25" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="font-dm text-heading h-8 w-full rounded-lg border border-white/5 bg-white/4 pr-3 pl-8 text-[12px] transition-all placeholder:text-white/25 focus:border-(--accent)/20 focus:outline-none"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="gap-1.5 rounded-[10px] text-white/40 hover:bg-white/[0.04] hover:text-white/60"
            onClick={() => setCreateFromNotesOpen(true)}
          >
            <FolderSync className="size-3" />
            Create from Notes
          </Button>
          <Button
            size="sm"
            className="gap-1.5 rounded-[10px] border-(--accent)/20 bg-(--accent)/15 text-(--accent) hover:bg-(--accent)/25"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="size-3" />
            New project
          </Button>
        </div>
      </div>

      <div className="motion-safe:animate-fade-in min-h-0 flex-1 overflow-auto px-6 motion-safe:[animation-delay:0.15s]">
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02]">
          {isLoading ? (
            <div className="py-12 text-center">
              <p className="font-dm text-[13px] text-white/30">Loading projects...</p>
            </div>
          ) : isError ? (
            <div className="py-12 text-center">
              <p className="font-dm text-[13px] text-red-400/70">
                {error instanceof Error ? error.message : 'Failed to load projects'}
              </p>
            </div>
          ) : visibleProjects.length > 0 ? (
            visibleProjects.map((project, index) => (
              <Link
                to={`/projects/${project.id}`}
                key={project.id}
                className="motion-safe:animate-stagger-in group flex h-8 items-center border-b border-white/[0.03] px-3 transition-colors last:border-0 hover:bg-white/[0.03]"
                style={{ animationDelay: `${index * 50 + 100}ms` }}
              >
                <span className="mr-2.5 inline-block w-10 shrink-0 font-mono text-[10px] tracking-wider text-white/25 uppercase">
                  {project.key}
                </span>
                <span className="font-dm truncate text-[13px] font-medium text-white/85">
                  {project.name}
                </span>
                <div className="ml-auto flex shrink-0 justify-end">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                    className="flex size-6 items-center justify-center rounded-lg text-white/20 opacity-0 transition-all group-hover:opacity-100 hover:bg-white/[0.06] hover:text-white/50"
                  >
                    <MoreHorizontal className="size-3.5" />
                  </button>
                </div>
              </Link>
            ))
          ) : (
            <div className="py-12 text-center">
              <p className="font-dm text-[13px] text-white/30">No projects found</p>
            </div>
          )}
        </div>
      </div>

      <CreateProjectDialog open={createOpen} onOpenChange={setCreateOpen} />
      <CreateProjectsFromNotesDialog
        open={createFromNotesOpen}
        onOpenChange={setCreateFromNotesOpen}
      />
    </div>
  );
}
