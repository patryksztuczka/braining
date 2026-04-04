import { Hono, type Context } from 'hono';
import { ZodError } from 'zod';
import { IssuesRepository } from './issues-repository';
import { IssuesService, IssuesServiceError } from './issues-service';
import { UsersRepository } from '../users/users-repository';
import { requireAuth, type AuthenticatedUser } from '../../middleware/require-auth';
import {
  createIssueSchema,
  issueIdParamsSchema,
  listIssuesQuerySchema,
  updateIssueSchema,
} from './issues-schemas';

export class IssuesRoutes {
  private readonly issuesService = new IssuesService(new IssuesRepository(), new UsersRepository());

  public build() {
    const router = new Hono<{
      Variables: {
        authUser: AuthenticatedUser;
      };
    }>();

    router.use('*', requireAuth);

    router.get('/', async (c) => {
      try {
        const query = listIssuesQuerySchema.parse({
          status: c.req.query('status') ?? undefined,
        });

        const issues = await this.issuesService.list(c.get('authUser').id, query);

        return c.json({ data: issues });
      } catch (error) {
        return this.handleError(c, error);
      }
    });

    router.get('/:id', async (c) => {
      try {
        const params = issueIdParamsSchema.parse(c.req.param());
        const issue = await this.issuesService.getById(c.get('authUser').id, params.id);
        return c.json({ data: issue });
      } catch (error) {
        return this.handleError(c, error);
      }
    });

    router.post('/', async (c) => {
      try {
        const body = createIssueSchema.parse(await this.readJsonBody(c));
        const issue = await this.issuesService.create(c.get('authUser').id, body);

        return c.json({ data: issue }, 201);
      } catch (error) {
        return this.handleError(c, error);
      }
    });

    router.patch('/:id', async (c) => {
      try {
        const params = issueIdParamsSchema.parse(c.req.param());
        const body = updateIssueSchema.parse(await this.readJsonBody(c));
        const issue = await this.issuesService.update(c.get('authUser').id, params.id, body);

        return c.json({ data: issue });
      } catch (error) {
        return this.handleError(c, error);
      }
    });

    router.delete('/:id', async (c) => {
      try {
        const params = issueIdParamsSchema.parse(c.req.param());
        const issue = await this.issuesService.delete(c.get('authUser').id, params.id);
        return c.json({ data: issue });
      } catch (error) {
        return this.handleError(c, error);
      }
    });

    return router;
  }

  private isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private async readJsonBody(c: Context) {
    const body = await c.req.json().catch(() => null);

    if (!this.isObject(body)) {
      throw new IssuesServiceError('Invalid JSON body', 400);
    }

    return body;
  }

  private handleError(c: Context, error: unknown) {
    if (error instanceof ZodError) {
      return c.json({ error: error.issues[0]?.message ?? 'Validation error' }, 400);
    }

    if (error instanceof IssuesServiceError) {
      return c.json({ error: error.message }, error.statusCode);
    }

    console.error(error);
    return c.json({ error: 'Internal server error' }, 500);
  }
}
