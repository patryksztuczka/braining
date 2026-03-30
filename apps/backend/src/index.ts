import { drizzle } from 'drizzle-orm/d1';
import { Hono } from 'hono';
import { users } from './db/schema';

const app = new Hono<{
  Bindings: {
    DB_PROD: D1Database;
  };
}>();

app.get('/', async (c) => {
  const db = drizzle(c.env.DB_PROD);
  const u = await db.select().from(users);
  console.log(u);
  return c.text(`Hello Hono!`);
});

export default app;
