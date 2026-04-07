import { env } from 'cloudflare:workers';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMiddleware } from 'hono/factory';

const authUser = {
  id: 'usr_1',
  email: 'user1@example.com',
  name: 'John Doe',
  image: null,
};

vi.mock('../src/middleware/require-auth', () => ({
  requireAuth: createMiddleware(async (c, next) => {
    c.set('authUser', authUser);
    await next();
  }),
}));

describe('resources integration tests', () => {
  async function loadApp() {
    const { default: app } = await import('../src/index');
    return app;
  }

  function getBucket() {
    return (env as typeof env & { R2_BUCKET: R2Bucket }).R2_BUCKET;
  }

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();

    const bucket = getBucket();
    const existingObjects = await bucket.list();

    if (existingObjects.objects.length > 0) {
      await bucket.delete(existingObjects.objects.map((object: R2Object) => object.key));
    }

    await Promise.all([
      bucket.put('loose-file.txt', 'hello'),
      bucket.put('projects/proj_1/spec.md', 'hello'),
      bucket.put('users/usr_1/profile.json', 'hello'),
      bucket.put('users/usr_1/images/avatar.png', 'hello'),
      bucket.put('users/usr_1/notes/today.md', 'hello'),
      bucket.put('users/usr_2/profile.json', 'hello'),
    ]);
  });

  it('lists root directories from the bucket', async () => {
    const app = await loadApp();
    const response = await app.request('http://localhost:8787/api/resources', undefined, {
      R2_BUCKET: getBucket(),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      data: [
        {
          name: 'projects',
          prefix: 'projects/',
        },
        {
          name: 'users',
          prefix: 'users/',
        },
      ],
      meta: {
        truncated: false,
        cursor: null,
      },
    });
  });
});
