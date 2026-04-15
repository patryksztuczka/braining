import { Hono, type Context } from 'hono';
import { ZodError } from 'zod';
import { ProjectsRepository } from './projects-repository';
import { ProjectsService, ProjectsServiceError } from './projects-service';
import { UsersRepository } from '../users/users-repository';
import { requireAuth, type AuthenticatedUser } from '../../middleware/require-auth';
import { createProjectSchema } from './projects-schemas';

export class ProjectsRoutes {
  private readonly projectsService = new ProjectsService(
    new ProjectsRepository(),
    new UsersRepository(),
  );

  public build() {
    const router = new Hono<{
      Variables: {
        authUser: AuthenticatedUser;
      };
    }>();

    router.use('*', requireAuth);

    router.get('/', async (c) => {
      try {
        const projects = await this.projectsService.list(c.get('authUser').id);
        return c.json({ data: projects });
      } catch (error) {
        return this.handleError(c, error);
      }
    });

    router.post('/', async (c) => {
      try {
        const body = createProjectSchema.parse(await this.readJsonBody(c));
        const project = await this.projectsService.create(c.get('authUser').id, body);

        return c.json({ data: project }, 201);
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
      throw new ProjectsServiceError('Invalid JSON body', 400);
    }

    return body;
  }

  private handleError(c: Context, error: unknown) {
    if (error instanceof ZodError) {
      return c.json({ error: error.issues[0]?.message ?? 'Validation error' }, 400);
    }

    if (error instanceof ProjectsServiceError) {
      return c.json({ error: error.message }, error.statusCode);
    }

    console.error(error);
    return c.json({ error: 'Internal server error' }, 500);
  }
}
