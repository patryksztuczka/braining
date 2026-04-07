import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FolderSync, MoreHorizontal, Plus, Search } from 'lucide-react';
import { ImportNotesDialog } from './projects/import-notes-dialog';

type Project = {
  id: string;
  name: string;
  key: string;
  description: string;
  team: string;
  teamColor: string;
  issueCount: number;
  memberCount: number;
  updatedAt: string;
};

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Frontend Application',
    key: 'FE',
    description: 'Main web application built with React and TypeScript',
    team: 'Engineering',
    teamColor: '#818cf8',
    issueCount: 42,
    memberCount: 5,
    updatedAt: 'Apr 6, 2026',
  },
  {
    id: '2',
    name: 'Backend Services',
    key: 'BE',
    description: 'API services and worker infrastructure',
    team: 'Engineering',
    teamColor: '#818cf8',
    issueCount: 31,
    memberCount: 4,
    updatedAt: 'Apr 5, 2026',
  },
  {
    id: '3',
    name: 'Design System',
    key: 'DS',
    description: 'Shared component library and design tokens',
    team: 'Design',
    teamColor: '#f472b6',
    issueCount: 18,
    memberCount: 3,
    updatedAt: 'Apr 4, 2026',
  },
  {
    id: '4',
    name: 'Marketing Website',
    key: 'MW',
    description: 'Public-facing marketing and landing pages',
    team: 'Marketing',
    teamColor: '#34d399',
    issueCount: 12,
    memberCount: 2,
    updatedAt: 'Apr 3, 2026',
  },
  {
    id: '5',
    name: 'Mobile App',
    key: 'MA',
    description: 'Cross-platform mobile application',
    team: 'Product',
    teamColor: '#fbbf24',
    issueCount: 25,
    memberCount: 4,
    updatedAt: 'Apr 2, 2026',
  },
];

const createProjectSchema = z.object({
  name: z.string().trim().min(1, 'Project name is required'),
  key: z
    .string()
    .trim()
    .min(1, 'Key is required')
    .max(5, 'Key must be 5 characters or less')
    .regex(/^[A-Z]+$/, 'Key must be uppercase letters only'),
  description: z.string().trim(),
});

type CreateProjectFormData = z.infer<typeof createProjectSchema>;

function CreateProjectDialog({
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
    formState: { errors },
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { name: '', key: '', description: '' },
  });

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  function onFormSubmit(_data: CreateProjectFormData) {
    onOpenChange(false);
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

          <div className="flex items-center justify-end gap-2 border-t border-white/[0.05] bg-white/[0.02] px-5 py-3.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="font-dm text-[12px] text-white/40 hover:bg-white/[0.04] hover:text-white/60"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="font-dm gap-1.5 rounded-[10px] border-(--accent)/20 bg-(--accent)/15 text-[12px] text-(--accent) hover:bg-(--accent)/25"
            >
              Create project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const normalizedSearch = search.trim().toLowerCase();
  const visibleProjects = normalizedSearch
    ? MOCK_PROJECTS.filter(
        (p) =>
          p.name.toLowerCase().includes(normalizedSearch) ||
          p.key.toLowerCase().includes(normalizedSearch) ||
          p.team.toLowerCase().includes(normalizedSearch),
      )
    : MOCK_PROJECTS;

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
            onClick={() => setImportOpen(true)}
          >
            <FolderSync className="size-3" />
            Import from Notes
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
          {visibleProjects.length > 0 ? (
            visibleProjects.map((project, index) => (
              <div
                key={project.id}
                className="motion-safe:animate-stagger-in group flex h-8 items-center border-b border-white/[0.03] px-3 transition-colors last:border-0 hover:bg-white/[0.03]"
                style={{ animationDelay: `${index * 50 + 100}ms` }}
              >
                <span className="font-mono text-[10px] text-white/25 mr-2.5">{project.key}</span>
                <span className="font-dm text-[13px] font-medium text-white/85 truncate">
                  {project.name}
                </span>
                <div className="ml-auto flex shrink-0 justify-end">
                  <button className="flex size-6 items-center justify-center rounded-lg text-white/20 opacity-0 transition-all group-hover:opacity-100 hover:bg-white/[0.06] hover:text-white/50">
                    <MoreHorizontal className="size-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <p className="font-dm text-[13px] text-white/30">No projects found</p>
            </div>
          )}
        </div>
      </div>

      <CreateProjectDialog open={createOpen} onOpenChange={setCreateOpen} />
      <ImportNotesDialog open={importOpen} onOpenChange={setImportOpen} />
    </div>
  );
}
