import { Hono } from 'hono';
import { users } from './db/schema';
import { db } from './db/client';
import { auth } from './lib/auth';
import { cors } from 'hono/cors';
import { IssuesRoutes } from './modules/issues/issues-routes';
import { ResourcesRoutes } from './modules/resources/resources-routes';

const app = new Hono<{
  Bindings: {
    R2_BUCKET: R2Bucket;
  };
}>();

app.use(
  '/api/*',
  cors({
    origin: 'http://localhost:5173',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'PATCH', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  }),
);

app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw));

app.route('/api/issues', new IssuesRoutes().build());
app.route('/api/resources', new ResourcesRoutes().build());

app.get('/', async (c) => {
  const u = await db.select().from(users);
  console.log(u);
  return c.text(`Hello Hono!`);
});

export default app;
