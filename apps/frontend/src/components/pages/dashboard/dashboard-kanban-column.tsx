import type { DashboardColumn } from './dashboard-types';
import { DashboardTaskCard } from './dashboard-task-card';

type DashboardKanbanColumnProps = {
  column: DashboardColumn;
  colIndex: number;
};

export function DashboardKanbanColumn({ column, colIndex }: DashboardKanbanColumnProps) {
  return (
    <div
      className="motion-safe:animate-stagger-in flex w-[260px] min-w-[260px] flex-col"
      style={{ animationDelay: `${colIndex * 80 + 100}ms` }}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span
            className="size-2 rounded-full"
            style={{ background: column.color, boxShadow: `0 0 8px ${column.color}40` }}
          />
          <span className="text-[12px] font-semibold tracking-[1px] text-white/60 uppercase">
            {column.title}
          </span>
          <span className="ml-0.5 font-mono text-[11px] text-white/25">{column.issues.length}</span>
        </div>
      </div>

      <div className="space-y-2.5 pb-4">
        {column.issues.length > 0 ? (
          column.issues.map((issue, index) => (
            <DashboardTaskCard key={issue.id} issue={issue} index={index + colIndex * 2} />
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-white/6 p-4 text-center text-[12px] text-white/25">
            No issues
          </div>
        )}
      </div>
    </div>
  );
}
