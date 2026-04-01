export function AuthGuardSkeleton() {
  return (
    <div className="bg-surface flex min-h-svh items-center justify-center">
      <div className="text-foreground/60 font-dm text-sm">Checking session...</div>
    </div>
  );
}
