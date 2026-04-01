import { Button } from '@/components/ui/button';
import { Filter, MoreHorizontal, Plus, Search, Clock, User, Tag } from 'lucide-react';

/* ── Mock data ─────────────────────────────────────────── */

type Priority = 'low' | 'medium' | 'high' | 'urgent';
type TaskTag = 'feature' | 'bug' | 'improvement' | 'docs';

interface KanbanTask {
  id: string;
  title: string;
  assignee: string;
  priority: Priority;
  tag: TaskTag;
  dueDate?: string;
}

interface Column {
  id: string;
  title: string;
  color: string;
  tasks: KanbanTask[];
}

const COLUMNS: Column[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    color: '#6b7280',
    tasks: [
      {
        id: 'BRN-42',
        title: 'Implement graph-based note linking system',
        assignee: 'Maya Chen',
        priority: 'medium',
        tag: 'feature',
      },
      {
        id: 'BRN-38',
        title: 'Add export functionality for notebooks',
        assignee: 'James Park',
        priority: 'low',
        tag: 'feature',
      },
      {
        id: 'BRN-51',
        title: 'Design onboarding flow for new users',
        assignee: 'Lina Rossi',
        priority: 'medium',
        tag: 'improvement',
      },
      {
        id: 'BRN-55',
        title: 'Write API documentation for plugin system',
        assignee: 'Alex Rivera',
        priority: 'low',
        tag: 'docs',
      },
    ],
  },
  {
    id: 'todo',
    title: 'To Do',
    color: '#818cf8',
    tasks: [
      {
        id: 'BRN-33',
        title: 'Build collaborative editing with conflict resolution',
        assignee: 'Seb Müller',
        priority: 'high',
        tag: 'feature',
        dueDate: 'Apr 4',
      },
      {
        id: 'BRN-29',
        title: 'Create keyboard shortcuts modal and customization',
        assignee: 'Maya Chen',
        priority: 'medium',
        tag: 'improvement',
      },
      {
        id: 'BRN-44',
        title: 'Set up end-to-end encryption for shared notes',
        assignee: 'Alex Rivera',
        priority: 'urgent',
        tag: 'feature',
        dueDate: 'Apr 2',
      },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    color: '#f59e0b',
    tasks: [
      {
        id: 'BRN-21',
        title: 'Real-time sync engine for offline-first architecture',
        assignee: 'Seb Müller',
        priority: 'urgent',
        tag: 'feature',
        dueDate: 'Apr 1',
      },
      {
        id: 'BRN-27',
        title: 'Redesign tag management and filtering UI',
        assignee: 'Lina Rossi',
        priority: 'high',
        tag: 'improvement',
      },
      {
        id: 'BRN-36',
        title: 'Fix markdown parser edge cases with nested lists',
        assignee: 'James Park',
        priority: 'medium',
        tag: 'bug',
      },
    ],
  },
  {
    id: 'review',
    title: 'Review',
    color: '#c084fc',
    tasks: [
      {
        id: 'BRN-18',
        title: 'Add AI-powered smart suggestions for note connections',
        assignee: 'Maya Chen',
        priority: 'high',
        tag: 'feature',
        dueDate: 'Mar 31',
      },
      {
        id: 'BRN-24',
        title: 'Improve search with fuzzy matching and filters',
        assignee: 'Alex Rivera',
        priority: 'medium',
        tag: 'improvement',
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    color: '#34d399',
    tasks: [
      {
        id: 'BRN-15',
        title: 'Implement dark mode with system preference detection',
        assignee: 'Lina Rossi',
        priority: 'medium',
        tag: 'feature',
      },
      {
        id: 'BRN-12',
        title: 'Set up CI/CD pipeline with automated testing',
        assignee: 'Seb Müller',
        priority: 'high',
        tag: 'improvement',
      },
      {
        id: 'BRN-09',
        title: 'Fix authentication token refresh loop',
        assignee: 'James Park',
        priority: 'urgent',
        tag: 'bug',
      },
    ],
  },
];

const PRIORITY_STYLES: Record<Priority, { dot: string; label: string }> = {
  low: { dot: 'bg-emerald-400/60', label: 'Low' },
  medium: { dot: 'bg-amber-400/70', label: 'Med' },
  high: { dot: 'bg-orange-400/80', label: 'High' },
  urgent: { dot: 'bg-red-400/90', label: 'Urgent' },
};

const TAG_STYLES: Record<TaskTag, { bg: string; text: string; label: string }> = {
  feature: { bg: 'bg-indigo-500/15', text: 'text-indigo-300', label: 'Feature' },
  bug: { bg: 'bg-red-500/15', text: 'text-red-300', label: 'Bug' },
  improvement: { bg: 'bg-cyan-500/15', text: 'text-cyan-300', label: 'Improve' },
  docs: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', label: 'Docs' },
};

const TABS = ['Backlog', 'Roadmap', 'Active sprints', 'Releases', 'Reports', 'Tasks'];

/* ── Components ────────────────────────────────────────── */

function TaskCard({ task, index }: { task: KanbanTask; index: number }) {
  const priority = PRIORITY_STYLES[task.priority];
  const tag = TAG_STYLES[task.tag];

  return (
    <div
      className="group motion-safe:animate-stagger-in relative cursor-pointer rounded-xl border border-white/[0.07] bg-white/[0.04] p-3.5 backdrop-blur-sm transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.07] hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
      style={{ animationDelay: `${index * 60 + 200}ms` }}
    >
      {/* Top row: ID + priority + more */}
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[11px] tracking-wide text-white/30">{task.id}</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className={`size-1.5 rounded-full ${priority.dot}`} />
            <span className="text-[10px] text-white/35">{priority.label}</span>
          </div>
          <button className="flex size-5 items-center justify-center rounded opacity-0 transition-opacity group-hover:opacity-60 hover:!opacity-100">
            <MoreHorizontal className="size-3" />
          </button>
        </div>
      </div>

      {/* Title */}
      <p className="mb-3 text-[13px] leading-[1.45] font-medium text-white/85">{task.title}</p>

      {/* Bottom row: tag + due date */}
      <div className="flex items-center gap-1.5">
        <span
          className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium ${tag.bg} ${tag.text}`}
        >
          <Tag className="size-2.5" />
          {tag.label}
        </span>
        {task.dueDate && (
          <span className="inline-flex items-center gap-1 text-[10px] text-white/30">
            <Clock className="size-2.5" />
            {task.dueDate}
          </span>
        )}
      </div>
    </div>
  );
}

function KanbanColumn({ column, colIndex }: { column: Column; colIndex: number }) {
  return (
    <div
      className="motion-safe:animate-stagger-in flex w-[260px] min-w-[260px] flex-col"
      style={{ animationDelay: `${colIndex * 80 + 100}ms` }}
    >
      {/* Column header */}
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span
            className="size-2 rounded-full"
            style={{ background: column.color, boxShadow: `0 0 8px ${column.color}40` }}
          />
          <span className="text-[12px] font-semibold tracking-[1px] text-white/60 uppercase">
            {column.title}
          </span>
          <span className="ml-0.5 font-mono text-[11px] text-white/25">{column.tasks.length}</span>
        </div>
        <button className="flex size-5 items-center justify-center rounded text-white/25 transition-all hover:bg-white/[0.05] hover:text-white/60">
          <Plus className="size-3.5" />
        </button>
      </div>

      {/* Cards */}
      <div className="space-y-2.5 pb-4">
        {column.tasks.map((task, i) => (
          <TaskCard key={task.id} task={task} index={i + colIndex * 2} />
        ))}

        {/* Add card placeholder */}
        <button className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/[0.06] p-3 text-[12px] text-white/20 transition-all hover:border-white/[0.1] hover:bg-white/[0.02] hover:text-white/40">
          <Plus className="size-3" />
          Add task
        </button>
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────── */

export function DashboardPage() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Tabs */}
      <div className="motion-safe:animate-fade-in px-5 pt-1 pb-0">
        <div className="flex items-center gap-1">
          <div className="mr-auto flex items-center gap-0.5">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`font-dm rounded-lg px-3 py-1.5 text-[13px] font-medium transition-all ${
                  tab === 'Active sprints'
                    ? 'bg-white/[0.08] text-white/90'
                    : 'text-white/35 hover:bg-white/[0.03] hover:text-white/60'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <Button
            size="sm"
            className="gap-1.5 rounded-[10px] border-[var(--accent)]/20 bg-[var(--accent)]/15 text-[var(--accent)] hover:bg-[var(--accent)]/25"
          >
            <Plus className="size-3" />
            Create task
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="motion-safe:animate-fade-in flex items-center gap-3 px-5 py-3 motion-safe:[animation-delay:0.15s]">
        <div className="relative w-[220px]">
          <Search className="absolute top-1/2 left-2.5 size-3 -translate-y-1/2 text-white/25" />
          <input
            type="text"
            placeholder="Search tasks"
            className="font-dm text-heading h-7 w-full rounded-lg border border-white/[0.05] bg-white/[0.04] pr-3 pl-7 text-[12px] transition-all placeholder:text-white/25 focus:border-[var(--accent)]/20 focus:outline-none"
          />
        </div>
        <div className="ml-auto flex items-center gap-0.5">
          <button className="font-dm flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-[12px] text-white/35 transition-all hover:bg-white/[0.04] hover:text-white/60">
            <User className="size-3" />
            My tasks
          </button>
          <button className="font-dm flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-[12px] text-white/35 transition-all hover:bg-white/[0.04] hover:text-white/60">
            <Clock className="size-3" />
            Recent
          </button>
          <button className="font-dm flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-[12px] text-white/35 transition-all hover:bg-white/[0.04] hover:text-white/60">
            <Filter className="size-3" />
            All filters
          </button>
        </div>
      </div>

      {/* Sprint header */}
      <div className="motion-safe:animate-fade-in px-5 pb-3 motion-safe:[animation-delay:0.2s]">
        <div className="flex items-center gap-2">
          <span className="font-dm text-[13px] text-white/60">
            <span className="mr-1 text-white/25">~</span>
            BRN-Sprint 4
          </span>
          <span className="font-dm text-[11px] text-white/25">(15 tasks)</span>
          <span className="ml-2 inline-flex items-center rounded bg-cyan-500/15 px-1.5 py-0.5 text-[10px] font-medium tracking-wider text-cyan-300 uppercase">
            Active
          </span>
          <button className="ml-1 flex size-5 items-center justify-center rounded text-white/20 transition-colors hover:text-white/60">
            <MoreHorizontal className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Kanban board */}
      <div className="min-h-0 flex-1 overflow-auto px-5 pb-4">
        <div className="flex w-max gap-4">
          {COLUMNS.map((column, i) => (
            <KanbanColumn key={column.id} column={column} colIndex={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
