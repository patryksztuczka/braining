import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut, useSession } from '@/lib/auth-client';
import { Bell, LogOut, Settings } from 'lucide-react';

import { Avatar } from './avatar';

export function DashboardHeader() {
  const { data: session } = useSession();
  const userName = session?.user?.name || session?.user?.email || 'User';
  const userEmail = session?.user?.email || '';
  const userImage = session?.user?.image;

  return (
    <div className="flex h-14 shrink-0 items-center justify-end px-5">
      <div className="flex items-center gap-1">
        <button className="text-foreground/50 hover:bg-foreground/8 hover:text-foreground/80 flex size-8 items-center justify-center rounded-lg transition-all">
          <Bell className="size-4" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="hover:ring-foreground/15 ml-1 cursor-pointer rounded-full transition-all outline-none hover:ring-2">
            <Avatar name={userName} image={userImage} size={30} />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="bg-popover/95 border-foreground/10 min-w-40 rounded-xl p-1 shadow-[0_16px_48px_rgba(0,0,0,0.4)] backdrop-blur-xl"
          >
            <div className="mb-0.5 px-2.5 py-2">
              <p className="text-heading font-dm text-[13px] font-medium">{userName}</p>
              {userEmail ? (
                <p className="text-foreground/60 font-dm text-[11px]">{userEmail}</p>
              ) : null}
            </div>
            <DropdownMenuSeparator className="bg-foreground/8" />
            <DropdownMenuItem className="font-dm text-foreground/70 hover:bg-foreground/8 hover:text-heading focus:bg-foreground/8 focus:text-heading flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px]">
              <Settings className="size-3.5" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              className="font-dm text-foreground/70 hover:bg-foreground/8 hover:text-heading focus:bg-foreground/8 focus:text-heading flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px]"
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
