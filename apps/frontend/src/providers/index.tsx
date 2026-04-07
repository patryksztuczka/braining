import { QueryProvider } from './query-provider';
import { Router } from './router';

export function Providers() {
  return (
    <QueryProvider>
      <Router />
    </QueryProvider>
  );
}
