import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Folder,
  Layers3,
  ListTodo,
  Users,
} from 'lucide-react';

const STATS = [
  {
    label: 'Total issues',
    value: '128',
    change: '+12%',
    trend: 'up' as const,
    icon: ListTodo,
    color: '#818cf8',
  },
  {
    label: 'Completed',
    value: '87',
    change: '+8%',
    trend: 'up' as const,
    icon: CheckCircle2,
    color: '#34d399',
  },
  {
    label: 'Active projects',
    value: '6',
    change: '+2',
    trend: 'up' as const,
    icon: Folder,
    color: '#c084fc',
  },
  {
    label: 'Team members',
    value: '14',
    change: '0',
    trend: 'neutral' as const,
    icon: Users,
    color: '#f59e0b',
  },
];

const RECENT_ACTIVITY = [
  {
    id: 1,
    user: 'Sarah Chen',
    action: 'completed',
    target: 'Set up CI/CD pipeline',
    project: 'Infrastructure',
    time: '12 min ago',
  },
  {
    id: 2,
    user: 'Alex Rivera',
    action: 'created',
    target: 'Design token system',
    project: 'Design System',
    time: '34 min ago',
  },
  {
    id: 3,
    user: 'Jordan Lee',
    action: 'moved',
    target: 'API rate limiter',
    project: 'Backend',
    time: '1h ago',
  },
  {
    id: 4,
    user: 'Maya Patel',
    action: 'commented on',
    target: 'Dashboard redesign',
    project: 'Frontend',
    time: '2h ago',
  },
  {
    id: 5,
    user: 'Liam Nguyen',
    action: 'completed',
    target: 'Write E2E tests',
    project: 'QA',
    time: '3h ago',
  },
];

const ACTIVE_SPRINTS = [
  { name: 'Sprint 14', project: 'Frontend', progress: 72, total: 18, done: 13 },
  { name: 'Sprint 8', project: 'Backend', progress: 45, total: 22, done: 10 },
  { name: 'Sprint 3', project: 'Design System', progress: 88, total: 8, done: 7 },
];

const ACTION_COLORS: Record<string, string> = {
  completed: 'text-emerald-400',
  created: 'text-indigo-400',
  moved: 'text-amber-400',
  'commented on': 'text-white/50',
};

export function DashboardPage() {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="motion-safe:animate-fade-in grid grid-cols-4 gap-3 px-6 pt-3">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="group rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 transition-all duration-200 hover:border-white/10 hover:bg-white/[0.05]"
          >
            <div className="flex items-center justify-between">
              <div
                className="flex size-8 items-center justify-center rounded-lg"
                style={{ background: `${stat.color}15` }}
              >
                <stat.icon className="size-4" style={{ color: stat.color }} />
              </div>
              {stat.trend !== 'neutral' && (
                <span
                  className={`flex items-center gap-0.5 text-[11px] font-medium ${
                    stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="size-3" />
                  ) : (
                    <ArrowDownRight className="size-3" />
                  )}
                  {stat.change}
                </span>
              )}
            </div>
            <div className="mt-3">
              <span className="font-dm text-[22px] font-semibold tracking-[-0.5px] text-white/90">
                {stat.value}
              </span>
              <p className="font-dm mt-0.5 text-[11px] text-white/35">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="motion-safe:animate-fade-in grid grid-cols-5 gap-3 px-6 pt-4 motion-safe:[animation-delay:0.2s]">
        <div className="col-span-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-dm text-[13px] font-semibold text-white/70">Recent activity</h2>
            <button className="font-dm text-[11px] text-(--accent) transition-colors hover:text-(--accent)/80">
              View all
            </button>
          </div>
          <div className="space-y-0">
            {RECENT_ACTIVITY.map((activity) => (
              <div
                key={activity.id}
                className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-white/[0.03]"
              >
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-[10px] font-semibold text-white/50">
                  {activity.user
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-dm truncate text-[12px] text-white/60">
                    <span className="font-medium text-white/80">{activity.user}</span>
                    {' '}
                    <span className={ACTION_COLORS[activity.action]}>{activity.action}</span>
                    {' '}
                    <span className="text-white/70">{activity.target}</span>
                  </p>
                  <div className="mt-0.5 flex items-center gap-2 text-[10px] text-white/25">
                    <span>{activity.project}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-2.5" />
                      {activity.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2 rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-dm text-[13px] font-semibold text-white/70">Active sprints</h2>
            <Layers3 className="size-3.5 text-white/25" />
          </div>
          <div className="space-y-4">
            {ACTIVE_SPRINTS.map((sprint) => (
              <div key={sprint.name}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-dm text-[12px] font-medium text-white/80">
                      {sprint.name}
                    </span>
                    <span className="font-dm ml-2 text-[10px] text-white/25">{sprint.project}</span>
                  </div>
                  <span className="font-dm text-[11px] text-white/40">
                    {sprint.done}/{sprint.total}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${sprint.progress}%`,
                      background:
                        sprint.progress > 75
                          ? '#34d399'
                          : sprint.progress > 50
                            ? '#f59e0b'
                            : '#818cf8',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
