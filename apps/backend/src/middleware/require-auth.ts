import { createMiddleware } from 'hono/factory';
import { auth } from '../lib/auth';

export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
  image: string | null;
};

export const requireAuth = createMiddleware<{
  Variables: {
    authUser: AuthenticatedUser;
  };
}>(async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
    asResponse: false,
  });

  if (!session?.user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  c.set('authUser', {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    image: session.user.image ?? null,
  });

  await next();
});
