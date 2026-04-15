import { Hono, type Context } from 'hono';
import { ZodError } from 'zod';
import { ProjectsRepository } from './projects-repository';
import { ProjectResourcesRepository } from './project-resources-repository';
import { ProjectsService, ProjectsServiceError } from './projects-service';
import { UsersRepository } from '../users/users-repository';
import { requireAuth, type AuthenticatedUser } from '../../middleware/require-auth';
import {
  createProjectSchema,
  createProjectsFromNotesSchema,
  setProjectResourcesSchema,
} from './projects-schemas';
import { env, waitUntil } from 'cloudflare:workers';
import { Project, ProjectResource } from '../../db/schema';
import type { ProjectNote } from './projects-service';

type ProjectsEnv = {
  Bindings: {
    R2_BUCKET: R2Bucket;
  };
  Variables: {
    authUser: AuthenticatedUser;
  };
};

const PROJECTS_CACHE_TTL_SECONDS = 60;
const PROJECT_RESOURCES_CACHE_TTL_SECONDS = 60;
const PROJECT_NOTES_CACHE_TTL_SECONDS = 60;

const projectsCacheKey = (userId: string) => `projects:${userId}`;
const projectResourcesCacheKey = (projectId: string) => `project-resources:${projectId}`;
const projectNotesCacheKey = (projectId: string) => `project-notes:${projectId}`;

export class ProjectsRoutes {
  private readonly projectsService = new ProjectsService(
    new ProjectsRepository(),
    new UsersRepository(),
    new ProjectResourcesRepository(),
  );

  public build() {
    const router = new Hono<ProjectsEnv>();

    router.use('*', requireAuth);

    router.get('/', async (c) => {
      try {
        const userId = c.get('authUser').id;
        const cacheKey = projectsCacheKey(userId);
        const cached = await env.BRAINING_KV.get(cacheKey);

        if (cached) {
          const projects = JSON.parse(cached) as Project[];
          return c.json({ data: projects });
        }

        const projects = await this.projectsService.list(userId);
        waitUntil(
          env.BRAINING_KV.put(cacheKey, JSON.stringify(projects), {
            expirationTtl: PROJECTS_CACHE_TTL_SECONDS,
          }),
        );
        return c.json({ data: projects });
      } catch (error) {
        return this.handleError(c, error);
      }
    });

    router.post('/', async (c) => {
      try {
        const userId = c.get('authUser').id;
        const body = createProjectSchema.parse(await this.readJsonBody(c));
        const project = await this.projectsService.create(userId, body);

        waitUntil(env.BRAINING_KV.delete(projectsCacheKey(userId)));

        return c.json({ data: project }, 201);
      } catch (error) {
        return this.handleError(c, error);
      }
    });

    router.post('/from-notes', async (c) => {
      try {
        const userId = c.get('authUser').id;
        const body = createProjectsFromNotesSchema.parse(await this.readJsonBody(c));
        const created = await this.projectsService.createFromNotes(userId, body);

        waitUntil(env.BRAINING_KV.delete(projectsCacheKey(userId)));

        return c.json({ data: created }, 201);
      } catch (error) {
        return this.handleError(c, error);
      }
    });

    router.get('/:id/resources', async (c) => {
      try {
        const projectId = c.req.param('id');
        const cacheKey = projectResourcesCacheKey(projectId);
        const cached = await env.BRAINING_KV.get(cacheKey);

        if (cached) {
          const resources = JSON.parse(cached) as ProjectResource[];
          return c.json({ data: resources });
        }

        const resources = await this.projectsService.listResources(
          c.get('authUser').id,
          projectId,
        );
        waitUntil(
          env.BRAINING_KV.put(cacheKey, JSON.stringify(resources), {
            expirationTtl: PROJECT_RESOURCES_CACHE_TTL_SECONDS,
          }),
        );
        return c.json({ data: resources });
      } catch (error) {
        return this.handleError(c, error);
      }
    });

    router.put('/:id/resources', async (c) => {
      try {
        const projectId = c.req.param('id');
        const body = setProjectResourcesSchema.parse(await this.readJsonBody(c));
        const resources = await this.projectsService.setResources(
          c.get('authUser').id,
          projectId,
          body.prefixes,
        );

        waitUntil(
          Promise.all([
            env.BRAINING_KV.delete(projectResourcesCacheKey(projectId)),
            env.BRAINING_KV.delete(projectNotesCacheKey(projectId)),
          ]),
        );

        return c.json({ data: resources });
      } catch (error) {
        return this.handleError(c, error);
      }
    });

    router.get('/:id/notes', async (c) => {
      try {
        const projectId = c.req.param('id');
        const cacheKey = projectNotesCacheKey(projectId);
        const cached = await env.BRAINING_KV.get(cacheKey);

        if (cached) {
          const notes = JSON.parse(cached) as ProjectNote[];
          return c.json({ data: notes });
        }

        const notes = await this.projectsService.listNotes(
          c.get('authUser').id,
          projectId,
          c.env.R2_BUCKET,
        );
        waitUntil(
          env.BRAINING_KV.put(cacheKey, JSON.stringify(notes), {
            expirationTtl: PROJECT_NOTES_CACHE_TTL_SECONDS,
          }),
        );
        return c.json({ data: notes });
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
