import { NOISE_BG } from '@/lib/constants';
import { Outlet } from 'react-router';
import { DashboardHeader } from './dashboard-header';
import { DashboardSidebar } from './dashboard-sidebar';

export function DashboardLayout() {
  return (
    <div className="font-dm ml-[calc(50%-50vw)] flex h-svh w-screen gap-2 overflow-hidden border-none p-3 text-left">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="bg-surface absolute inset-0" />
        <div className="absolute top-[-300px] right-[-200px] h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle,var(--accent)_0%,transparent_65%)] opacity-[0.12]" />
        <div className="absolute bottom-[-200px] left-[100px] h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle,var(--accent)_0%,transparent_65%)] opacity-[0.06]" />
        <div className="absolute top-[30%] left-[40%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,var(--accent)_0%,transparent_65%)] opacity-[0.04]" />
        <div
          className="absolute inset-0 bg-size-[128px_128px] opacity-[0.025] mix-blend-overlay"
          style={{ backgroundImage: NOISE_BG }}
        />
      </div>

      <div className="relative z-10">
        <DashboardSidebar />
      </div>

      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex flex-1 flex-col overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
