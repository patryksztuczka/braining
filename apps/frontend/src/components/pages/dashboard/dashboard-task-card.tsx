import { Clock, MoreHorizontal, User } from 'lucide-react';
import type { Issue } from './dashboard-types';
import { formatIssueDate } from './dashboard-utils';

type DashboardTaskCardProps = {
  issue: Issue;
  index: number;
};

export function DashboardTaskCard({ issue, index }: DashboardTaskCardProps) {
  const createdAtLabel = formatIssueDate(issue.createdAt);

  return (
    <div
      className="group motion-safe:animate-stagger-in relative cursor-pointer rounded-xl border border-white/[0.07] bg-white/4 p-3.5 backdrop-blur-sm transition-all duration-200 hover:border-white/12 hover:bg-white/[0.07] hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
      style={{ animationDelay: `${index * 60 + 200}ms` }}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[11px] tracking-wide text-white/30">{issue.id}</span>
        <div className="flex items-center gap-2">
          <button className="flex size-5 items-center justify-center rounded opacity-0 transition-opacity group-hover:opacity-60 hover:opacity-100!">
            <MoreHorizontal className="size-3" />
          </button>
        </div>
      </div>

      <p className="mb-3 text-[13px] leading-[1.45] font-medium text-white/85">{issue.name}</p>

      <div className="flex items-center justify-between gap-3 text-[10px] text-white/30">
        <span className="inline-flex items-center gap-1">
          <User className="size-2.5" />
          {issue.user.name}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="size-2.5" />
          {createdAtLabel}
        </span>
      </div>
    </div>
  );
}
