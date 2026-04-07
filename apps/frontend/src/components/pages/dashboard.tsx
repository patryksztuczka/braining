import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Filter, MoreHorizontal, Plus, Search, User } from 'lucide-react';
import { STATUS_CONFIG, STATUS_ORDER, TABS } from './dashboard/dashboard-constants';
import { DashboardKanbanColumn } from './dashboard/dashboard-kanban-column';
import type { DashboardColumn } from './dashboard/dashboard-types';
import { useIssuesQuery } from './dashboard/use-issues-query';

export function DashboardPage() {
  const [search, setSearch] = useState('');
  const { data: issues = [], isLoading, error } = useIssuesQuery();

  const normalizedSearch = search.trim().toLowerCase();
  const visibleIssues = normalizedSearch
    ? issues.filter((issue) => {
        const userText = `${issue.user.name} ${issue.user.email}`.toLowerCase();
        return (
          issue.name.toLowerCase().includes(normalizedSearch) ||
          issue.id.toLowerCase().includes(normalizedSearch) ||
          userText.includes(normalizedSearch)
        );
      })
    : issues;

  const columns: DashboardColumn[] = STATUS_ORDER.map((status) => ({
    ...STATUS_CONFIG[status],
    issues: visibleIssues.filter((issue) => issue.status === status),
  }));

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="motion-safe:animate-fade-in px-5 pt-1 pb-0">
        <div className="flex items-center gap-1">
          <div className="mr-auto flex items-center gap-0.5">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`font-dm rounded-lg px-3 py-1.5 text-[13px] font-medium transition-all ${
                  tab === 'Active sprints'
                    ? 'bg-white/8 text-white/90'
                    : 'text-white/35 hover:bg-white/3 hover:text-white/60'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <Button
            size="sm"
            className="gap-1.5 rounded-[10px] border-(--accent)/20 bg-(--accent)/15 text-(--accent) hover:bg-(--accent)/25"
          >
            <Plus className="size-3" />
            Create issue
          </Button>
        </div>
      </div>

      <div className="motion-safe:animate-fade-in flex items-center gap-3 px-5 py-3 motion-safe:[animation-delay:0.15s]">
        <div className="relative w-55">
          <Search className="absolute top-1/2 left-2.5 size-3 -translate-y-1/2 text-white/25" />
          <input
            type="text"
            placeholder="Search issues"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="font-dm text-heading h-7 w-full rounded-lg border border-white/5 bg-white/4 pr-3 pl-7 text-[12px] transition-all placeholder:text-white/25 focus:border-(--accent)/20 focus:outline-none"
          />
        </div>
        <div className="ml-auto flex items-center gap-0.5">
          <button className="font-dm flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-[12px] text-white/35 transition-all hover:bg-white/4 hover:text-white/60">
            <User className="size-3" />
            My tasks
          </button>
          <button className="font-dm flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-[12px] text-white/35 transition-all hover:bg-white/4 hover:text-white/60">
            <Clock className="size-3" />
            Recent
          </button>
          <button className="font-dm flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-[12px] text-white/35 transition-all hover:bg-white/4 hover:text-white/60">
            <Filter className="size-3" />
            All filters
          </button>
        </div>
      </div>

      <div className="motion-safe:animate-fade-in px-5 pb-3 motion-safe:[animation-delay:0.2s]">
        <div className="flex items-center gap-2">
          <span className="font-dm text-[13px] text-white/60">
            <span className="mr-1 text-white/25">~</span>
            BRN-Issues
          </span>
          <span className="font-dm text-[11px] text-white/25">({visibleIssues.length} issues)</span>
          <span className="ml-2 inline-flex items-center rounded bg-cyan-500/15 px-1.5 py-0.5 text-[10px] font-medium tracking-wider text-cyan-300 uppercase">
            Live
          </span>
          <button className="ml-1 flex size-5 items-center justify-center rounded text-white/20 transition-colors hover:text-white/60">
            <MoreHorizontal className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-5 pb-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-[13px] text-white/35">
            Loading issues...
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center text-[13px] text-red-300/80">
            {error.message}
          </div>
        ) : (
          <div className="flex w-max gap-4">
            {columns.map((column, i) => (
              <DashboardKanbanColumn key={column.id} column={column} colIndex={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
