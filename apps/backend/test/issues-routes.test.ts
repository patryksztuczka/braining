import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMiddleware } from 'hono/factory';
import { db } from '../src/db/client';
import { issues, users } from '../src/db/schema';

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

describe('issues integration tests', () => {
  async function loadApp() {
    const { default: app } = await import('../src/index');
    return app;
  }

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();

    await db.delete(issues);
    await db.delete(users);

    await db.insert(users).values([
      {
        id: 'usr_1',
        email: 'user1@example.com',
        name: 'John Doe',
        emailVerified: true,
        image: null,
      },
      {
        id: 'usr_2',
        email: 'user2@example.com',
        name: 'Jane Doe',
        emailVerified: true,
        image: null,
      },
    ]);

    await db.insert(issues).values([
      {
        id: 'issue_1',
        name: 'Issue 1',
        status: 'todo',
        userId: 'usr_1',
      },
      {
        id: 'issue_2',
        name: 'Issue 2',
        status: 'in_progress',
        userId: 'usr_1',
      },
      {
        id: 'issue_3',
        name: 'Issue 3',
        status: 'done',
        userId: 'usr_2',
      },
    ]);
  });

  describe('list issues', () => {
    it('returns given user issues', async () => {
      const app = await loadApp();
      const response = await app.request('http://localhost:8787/api/issues');

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({
        data: [
          {
            id: 'issue_1',
            name: 'Issue 1',
            status: 'todo',
            userId: 'usr_1',
            createdAt: expect.any(String),
            user: {
              id: 'usr_1',
              email: 'user1@example.com',
              image: null,
              name: 'John Doe',
              createdAt: expect.any(String),
            },
          },
          {
            id: 'issue_2',
            name: 'Issue 2',
            status: 'in_progress',
            userId: 'usr_1',
            createdAt: expect.any(String),
            user: {
              id: 'usr_1',
              email: 'user1@example.com',
              image: null,
              name: 'John Doe',
              createdAt: expect.any(String),
            },
          },
        ],
      });
    });

    it('returns given user issues filtered by status', async () => {
      const app = await loadApp();
      const response = await app.request('http://localhost:8787/api/issues?status=todo');

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({
        data: [
          {
            id: 'issue_1',
            name: 'Issue 1',
            status: 'todo',
            userId: 'usr_1',
            createdAt: expect.any(String),
            user: {
              id: 'usr_1',
              email: 'user1@example.com',
              image: null,
              name: 'John Doe',
              createdAt: expect.any(String),
            },
          },
        ],
      });
    });

    it('returns 400 for invalid list status filter', async () => {
      const app = await loadApp();
      const response = await app.request('http://localhost:8787/api/issues?status=blocked');

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        error: 'Invalid option: expected one of "todo"|"in_progress"|"done"',
      });
    });
  });

  describe('get issue', () => {
    it('returns owned issue by id', async () => {
      const app = await loadApp();
      const response = await app.request('http://localhost:8787/api/issues/issue_1');

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({
        data: {
          id: 'issue_1',
          name: 'Issue 1',
          status: 'todo',
          userId: 'usr_1',
          createdAt: expect.any(String),
          user: {
            id: 'usr_1',
            email: 'user1@example.com',
            image: null,
            name: 'John Doe',
            createdAt: expect.any(String),
          },
        },
      });
    });

    it('returns 404 for issue owned by different user', async () => {
      const app = await loadApp();
      const response = await app.request('http://localhost:8787/api/issues/issue_3');

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({
        error: 'Issue not found: issue_3',
      });
    });
  });

  describe('create issue', () => {
    it('creates a new issue for the authenticated user', async () => {
      const app = await loadApp();
      const response = await app.request('http://localhost:8787/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'New Issue',
          status: 'done',
        }),
      });

      expect(response.status).toBe(201);
      expect(await response.json()).toEqual({
        data: {
          id: expect.any(String),
          name: 'New Issue',
          status: 'done',
          userId: 'usr_1',
          createdAt: expect.any(String),
          user: {
            id: 'usr_1',
            email: 'user1@example.com',
            image: null,
            name: 'John Doe',
            createdAt: expect.any(String),
          },
        },
      });

      const createdIssues = await db.select().from(issues);
      expect(createdIssues).toHaveLength(4);
      expect(
        createdIssues.some((issue) => issue.name === 'New Issue' && issue.userId === 'usr_1'),
      ).toBe(true);
    });

    it('returns 400 for invalid create payload', async () => {
      const app = await loadApp();
      const response = await app.request('http://localhost:8787/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: '',
          status: 'todo',
        }),
      });

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        error: 'Issue name is required',
      });
    });

    it('returns 400 for invalid create body json', async () => {
      const app = await loadApp();
      const response = await app.request('http://localhost:8787/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'not-json',
      });

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        error: 'Invalid JSON body',
      });
    });
  });

  describe('update issue', () => {
    it('updates an owned issue', async () => {
      const app = await loadApp();
      const response = await app.request('http://localhost:8787/api/issues/issue_2', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Updated Issue 2',
          status: 'done',
        }),
      });

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({
        data: {
          id: 'issue_2',
          name: 'Updated Issue 2',
          status: 'done',
          userId: 'usr_1',
          createdAt: expect.any(String),
          user: {
            id: 'usr_1',
            email: 'user1@example.com',
            image: null,
            name: 'John Doe',
            createdAt: expect.any(String),
          },
        },
      });
    });

    it('returns 404 when updating issue owned by different user', async () => {
      const app = await loadApp();
      const response = await app.request('http://localhost:8787/api/issues/issue_3', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'todo',
        }),
      });

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({
        error: 'Issue not found: issue_3',
      });
    });

    it('returns 400 when update payload is empty', async () => {
      const app = await loadApp();
      const response = await app.request('http://localhost:8787/api/issues/issue_1', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        error: 'At least one field is required',
      });
    });
  });

  describe('delete issue', () => {
    it('deletes an owned issue', async () => {
      const app = await loadApp();
      const response = await app.request('http://localhost:8787/api/issues/issue_2', {
        method: 'DELETE',
      });

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({
        data: {
          id: 'issue_2',
          name: 'Issue 2',
          status: 'in_progress',
          userId: 'usr_1',
          createdAt: expect.any(String),
          user: {
            id: 'usr_1',
            email: 'user1@example.com',
            image: null,
            name: 'John Doe',
            createdAt: expect.any(String),
          },
        },
      });

      const remainingIssues = await db.select().from(issues);
      expect(remainingIssues.map((issue) => issue.id)).toEqual(['issue_1', 'issue_3']);
    });

    it('returns 404 when deleting issue owned by different user', async () => {
      const app = await loadApp();
      const response = await app.request('http://localhost:8787/api/issues/issue_3', {
        method: 'DELETE',
      });

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({
        error: 'Issue not found: issue_3',
      });
    });
  });
});
