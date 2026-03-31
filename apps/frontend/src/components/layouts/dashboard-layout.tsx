import { NOISE_BG } from '@/lib/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Brain,
  Calendar,
  ChevronDown,
  Folder,
  Home,
  Layers3,
  LogOut,
  Settings,
  Bell,
  BarChart3,
} from 'lucide-react';
import { Outlet } from 'react-router';

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

function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const colors = ['#818cf8', '#f472b6', '#34d399', '#fbbf24', '#fb923c', '#a78bfa'];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-medium font-dm shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `linear-gradient(135deg, ${colors[idx]}, ${colors[(idx + 2) % colors.length]})`,
      }}
    >
      {name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)}
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="w-[220px] shrink-0 flex flex-col pt-1 z-30 motion-safe:animate-slide-in-left">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-[56px] shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-border)] flex items-center justify-center">
          <Brain className="size-[18px] text-white" />
        </div>
        <span className="text-[15px] font-semibold tracking-[-0.3px] text-heading font-dm">
          braining
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-3 overflow-y-auto">
        <div className="space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-2.5 px-2.5 h-8 rounded-lg text-[13px] font-medium font-dm transition-all duration-150 ${
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

        {/* Teams section */}
        <div className="mt-7">
          <span className="px-2.5 text-[10px] font-semibold uppercase tracking-[1.5px] text-foreground/40">
            Teams
          </span>
          <div className="mt-2 space-y-0.5">
            {TEAMS.map((team) => (
              <button
                key={team.name}
                className="w-full flex items-center gap-2.5 px-2.5 h-8 rounded-lg text-[13px] font-dm text-foreground/60 hover:bg-foreground/[0.06] hover:text-foreground transition-all duration-150"
              >
                <span
                  className="size-2 rounded-full shrink-0"
                  style={{ background: team.color }}
                />
                {team.name}
                <ChevronDown className="size-3 ml-auto opacity-40" />
              </button>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
}

function Header() {
  return (
    <div className="h-[56px] shrink-0 flex items-center justify-end px-5">
      <div className="flex items-center gap-1">
        <button className="size-8 rounded-lg flex items-center justify-center text-foreground/50 hover:bg-foreground/[0.08] hover:text-foreground/80 transition-all">
          <Bell className="size-[16px]" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="ml-1 rounded-full outline-none cursor-pointer hover:ring-2 hover:ring-foreground/15 transition-all">
            <Avatar name="Patryk Sztuczka" size={30} />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="min-w-[180px] bg-popover/95 backdrop-blur-xl border-foreground/[0.1] rounded-xl p-1 shadow-[0_16px_48px_rgba(0,0,0,0.4)]"
          >
            <div className="px-2.5 py-2 mb-0.5">
              <p className="text-[13px] font-medium text-heading font-dm">Patryk Sztuczka</p>
              <p className="text-[11px] text-foreground/60 font-dm">patryk@braining.app</p>
            </div>
            <DropdownMenuSeparator className="bg-foreground/[0.08]" />
            <DropdownMenuItem className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[13px] font-dm text-foreground/70 cursor-pointer hover:bg-foreground/[0.08] hover:text-heading focus:bg-foreground/[0.08] focus:text-heading">
              <Settings className="size-3.5" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[13px] font-dm text-foreground/70 cursor-pointer hover:bg-foreground/[0.08] hover:text-heading focus:bg-foreground/[0.08] focus:text-heading">
              <LogOut className="size-3.5" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export function DashboardLayout() {
  return (
    <div className="flex h-svh w-screen ml-[calc(50%_-_50vw)] font-dm text-left border-none overflow-hidden p-3 gap-2">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-surface" />
        <div className="absolute w-[1000px] h-[1000px] top-[-300px] right-[-200px] rounded-full bg-[radial-gradient(circle,var(--accent)_0%,transparent_65%)] opacity-[0.12]" />
        <div className="absolute w-[800px] h-[800px] bottom-[-200px] left-[100px] rounded-full bg-[radial-gradient(circle,var(--accent)_0%,transparent_65%)] opacity-[0.06]" />
        <div className="absolute w-[600px] h-[600px] top-[30%] left-[40%] rounded-full bg-[radial-gradient(circle,var(--accent)_0%,transparent_65%)] opacity-[0.04]" />
        <div
          className="absolute inset-0 opacity-[0.025] mix-blend-overlay bg-[length:128px_128px]"
          style={{ backgroundImage: NOISE_BG }}
        />
      </div>

      <div className="relative z-10">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-hidden flex flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export { Avatar };
