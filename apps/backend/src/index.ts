import { Hono } from 'hono';
import { users } from './db/schema';
import { db } from './db/client';
import { auth } from './lib/auth';
import { cors } from 'hono/cors';

const app = new Hono();

app.use(
  '/api/auth/*', // or replace with "*" to enable cors for all routes
  cors({
    origin: 'http://localhost:5173', // replace with your origin
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  }),
);

app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw));

app.get('/', async (c) => {
  const u = await db.select().from(users);
  console.log(u);
  return c.text(`Hello Hono!`);
});

export default app;
