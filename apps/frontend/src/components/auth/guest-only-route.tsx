import { useSession } from '@/lib/auth-client';
import { Navigate, Outlet } from 'react-router';
import { AuthGuardSkeleton } from './auth-guard-skeleton';

export function GuestOnlyRoute() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <AuthGuardSkeleton />;
  }

  if (session) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
