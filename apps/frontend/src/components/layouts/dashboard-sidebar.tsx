import { NavLink } from 'react-router';
import { Brain, Folder, Home, Layers3 } from 'lucide-react';

const NAV_ITEMS = [
  { icon: Home, label: 'Dashboard', to: '/' },
  { icon: Folder, label: 'Projects', to: '/projects' },
  { icon: Layers3, label: 'Boards', to: '/boards' },
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
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `font-dm flex h-8 w-full items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[var(--accent)]/15 text-[var(--accent)]'
                    : 'text-foreground/60 hover:bg-foreground/[0.06] hover:text-foreground'
                }`
              }
            >
              <item.icon className="size-[16px]" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
}
