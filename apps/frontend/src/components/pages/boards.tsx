import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { CreateIssueDialog } from './boards/create-issue-dialog';
import { STATUS_CONFIG, STATUS_ORDER } from './boards/boards-constants';
import { BoardsKanbanColumn } from './boards/boards-kanban-column';
import type { DashboardColumn } from './boards/boards-types';
import { useCreateIssueMutation } from './boards/use-create-issue-mutation';
import { useIssuesQuery } from './boards/use-issues-query';

export function BoardsPage() {
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const { data: issues = [], isLoading, error } = useIssuesQuery();
  const createIssue = useCreateIssueMutation();

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
      <div className="motion-safe:animate-fade-in flex items-center gap-3 px-5 pt-3 pb-3">
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
        <Button
          size="sm"
          className="ml-auto gap-1.5 rounded-[10px] border-(--accent)/20 bg-(--accent)/15 text-(--accent) hover:bg-(--accent)/25"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="size-3" />
          Create issue
        </Button>
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
              <BoardsKanbanColumn key={column.id} column={column} colIndex={i} />
            ))}
          </div>
        )}
      </div>

      <CreateIssueDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={async (data) => { await createIssue.mutateAsync(data); }}
      />
    </div>
  );
}
