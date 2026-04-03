import { Brain, Calendar, ChevronDown, Folder, Home, Layers3, BarChart3 } from 'lucide-react';

const NAV_ITEMS = [
  { icon: Home, label: 'Dashboard', active: false },
  { icon: Folder, label: 'Projects', active: true },
  { icon: Layers3, label: 'Boards', active: false },
  { icon: Calendar, label: 'Calendar', active: false },
  { icon: BarChart3, label: 'Reports', active: false },
];

const TEAMS = [
  { name: 'Engineering', color: '#818cf8' },
  { name: 'Design', color: '#f472b6' },
  { name: 'Marketing', color: '#34d399' },
  { name: 'Product', color: '#fbbf24' },
];

export function DashboardSidebar() {
  return (
    <aside className="motion-safe:animate-slide-in-left z-30 flex w-[220px] shrink-0 flex-col pt-1">
      <div className="flex h-[56px] shrink-0 items-center gap-2.5 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-(--accent) to-(--accent-border)">
          <Brain className="size-4 text-white" />
        </div>
        <span className="text-heading font-dm text-[15px] font-semibold tracking-[-0.3px]">
          braining
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pt-3">
        <div className="space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              className={`font-dm flex h-8 w-full items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium transition-all duration-150 ${
                item.active
                  ? 'bg-[var(--accent)]/15 text-[var(--accent)]'
                  : 'text-foreground/60 hover:bg-foreground/[0.06] hover:text-foreground'
              }`}
            >
              <item.icon className="size-[16px]" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-7">
          <span className="text-foreground/40 px-2.5 text-[10px] font-semibold tracking-[1.5px] uppercase">
            Teams
          </span>
          <div className="mt-2 space-y-0.5">
            {TEAMS.map((team) => (
              <button
                key={team.name}
                className="font-dm text-foreground/60 hover:bg-foreground/6 hover:text-foreground flex h-8 w-full items-center gap-2.5 rounded-lg px-2.5 text-[13px] transition-all duration-150"
              >
                <span className="size-2 shrink-0 rounded-full" style={{ background: team.color }} />
                {team.name}
                <ChevronDown className="ml-auto size-3 opacity-40" />
              </button>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
}
