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
import { signOut } from '@/lib/auth-client';

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
      className="font-dm flex shrink-0 items-center justify-center rounded-full font-medium text-white"
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
    <aside className="motion-safe:animate-slide-in-left z-30 flex w-[220px] shrink-0 flex-col pt-1">
      {/* Logo */}
      <div className="flex h-[56px] shrink-0 items-center gap-2.5 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-border)]">
          <Brain className="size-[18px] text-white" />
        </div>
        <span className="text-heading font-dm text-[15px] font-semibold tracking-[-0.3px]">
          braining
        </span>
      </div>

      {/* Navigation */}
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

        {/* Teams section */}
        <div className="mt-7">
          <span className="text-foreground/40 px-2.5 text-[10px] font-semibold tracking-[1.5px] uppercase">
            Teams
          </span>
          <div className="mt-2 space-y-0.5">
            {TEAMS.map((team) => (
              <button
                key={team.name}
                className="font-dm text-foreground/60 hover:bg-foreground/[0.06] hover:text-foreground flex h-8 w-full items-center gap-2.5 rounded-lg px-2.5 text-[13px] transition-all duration-150"
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

function Header() {
  return (
    <div className="flex h-[56px] shrink-0 items-center justify-end px-5">
      <div className="flex items-center gap-1">
        <button className="text-foreground/50 hover:bg-foreground/[0.08] hover:text-foreground/80 flex size-8 items-center justify-center rounded-lg transition-all">
          <Bell className="size-[16px]" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="hover:ring-foreground/15 ml-1 cursor-pointer rounded-full transition-all outline-none hover:ring-2">
            <Avatar name="Patryk Sztuczka" size={30} />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="bg-popover/95 border-foreground/[0.1] min-w-[180px] rounded-xl p-1 shadow-[0_16px_48px_rgba(0,0,0,0.4)] backdrop-blur-xl"
          >
            <div className="mb-0.5 px-2.5 py-2">
              <p className="text-heading font-dm text-[13px] font-medium">Patryk Sztuczka</p>
              <p className="text-foreground/60 font-dm text-[11px]">patryk@braining.app</p>
            </div>
            <DropdownMenuSeparator className="bg-foreground/[0.08]" />
            <DropdownMenuItem className="font-dm text-foreground/70 hover:bg-foreground/[0.08] hover:text-heading focus:bg-foreground/[0.08] focus:text-heading flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px]">
              <Settings className="size-3.5" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              className="font-dm text-foreground/70 hover:bg-foreground/[0.08] hover:text-heading focus:bg-foreground/[0.08] focus:text-heading flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px]"
              onClick={async () => await signOut()}
            >
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
    <div className="font-dm ml-[calc(50%_-_50vw)] flex h-svh w-screen gap-2 overflow-hidden border-none p-3 text-left">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="bg-surface absolute inset-0" />
        <div className="absolute top-[-300px] right-[-200px] h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle,var(--accent)_0%,transparent_65%)] opacity-[0.12]" />
        <div className="absolute bottom-[-200px] left-[100px] h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle,var(--accent)_0%,transparent_65%)] opacity-[0.06]" />
        <div className="absolute top-[30%] left-[40%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,var(--accent)_0%,transparent_65%)] opacity-[0.04]" />
        <div
          className="absolute inset-0 bg-[length:128px_128px] opacity-[0.025] mix-blend-overlay"
          style={{ backgroundImage: NOISE_BG }}
        />
      </div>

      <div className="relative z-10">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex flex-1 flex-col overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export { Avatar };
