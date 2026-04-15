import { db } from '../../db/client';
import { projects as projectsTable, projectResources as projectResourcesTable } from '../../db/schema';
import { ProjectsRepository, type CreateProjectInput } from './projects-repository';
import { ProjectResourcesRepository } from './project-resources-repository';
import { UsersRepository } from '../users/users-repository';
import type { CreateProjectSchema, CreateProjectsFromNotesSchema } from './projects-schemas';

export class ProjectsServiceError extends Error {
  constructor(
    message: string,
    readonly statusCode: 400 | 404 | 409 | 500,
  ) {
    super(message);
  }
}

export type ProjectNote = {
  id: string;
  title: string;
  path: string;
  excerpt: string;
  wordCount: number;
  updatedAt: string;
};

export class ProjectsService {
  public constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly projectResourcesRepository: ProjectResourcesRepository,
  ) {}

  public async list(authUserId: string) {
    return this.projectsRepository.findMany({ userId: authUserId });
  }

  public async create(authUserId: string, input: CreateProjectSchema) {
    const user = await this.usersRepository.findById(authUserId);

    if (!user) {
      throw new ProjectsServiceError(`User not found: ${authUserId}`, 404);
    }

    const existing = await this.projectsRepository.findByUserAndKey(authUserId, input.key);

    if (existing) {
      throw new ProjectsServiceError(`Project key already in use: ${input.key}`, 409);
    }

    const payload: CreateProjectInput = {
      id: crypto.randomUUID(),
      name: input.name,
      key: input.key,
      description: input.description,
      userId: authUserId,
    };

    const project = await this.projectsRepository.create(payload);

    if (!project) {
      throw new ProjectsServiceError('Failed to create project', 500);
    }

    return project;
  }

  public async createFromNotes(authUserId: string, input: CreateProjectsFromNotesSchema) {
    const user = await this.usersRepository.findById(authUserId);

    if (!user) {
      throw new ProjectsServiceError(`User not found: ${authUserId}`, 404);
    }

    const seenKeys = new Set<string>();
    const seenPrefixes = new Set<string>();
    for (const item of input.items) {
      if (seenKeys.has(item.key)) {
        throw new ProjectsServiceError(`Duplicate project key in batch: ${item.key}`, 400);
      }
      if (seenPrefixes.has(item.prefix)) {
        throw new ProjectsServiceError(`Duplicate prefix in batch: ${item.prefix}`, 400);
      }
      seenKeys.add(item.key);
      seenPrefixes.add(item.prefix);
    }

    const existing = await this.projectsRepository.findMany({ userId: authUserId });
    const existingKeys = new Set(existing.map((project) => project.key));
    const conflict = input.items.find((item) => existingKeys.has(item.key));
    if (conflict) {
      throw new ProjectsServiceError(`Project key already in use: ${conflict.key}`, 409);
    }

    const now = new Date();
    const prepared = input.items.map((item) => {
      const projectId = crypto.randomUUID();
      return {
        project: {
          id: projectId,
          name: item.name,
          key: item.key,
          description: item.description,
          userId: authUserId,
          createdAt: now,
        },
        resource: {
          id: crypto.randomUUID(),
          projectId,
          userId: authUserId,
          prefix: item.prefix,
          createdAt: now,
        },
      };
    });

    const [firstStatement, ...restStatements] = [
      db.insert(projectsTable).values(prepared.map((entry) => entry.project)),
      db.insert(projectResourcesTable).values(prepared.map((entry) => entry.resource)),
    ];

    await db.batch([firstStatement, ...restStatements]);

    return prepared.map((entry) => entry.project);
  }

  public async listResources(authUserId: string, projectId: string) {
    await this.getOwnedProject(authUserId, projectId);
    return this.projectResourcesRepository.findByProject(projectId);
  }

  public async setResources(authUserId: string, projectId: string, prefixes: string[]) {
    const project = await this.getOwnedProject(authUserId, projectId);

    const unique = Array.from(new Set(prefixes));
    const existing = await this.projectResourcesRepository.findByProject(projectId);
    const existingPrefixes = new Set(existing.map((resource) => resource.prefix));
    const nextPrefixes = new Set(unique);

    const toAdd = unique.filter((prefix) => !existingPrefixes.has(prefix));
    const toRemove = existing
      .filter((resource) => !nextPrefixes.has(resource.prefix))
      .map((resource) => resource.prefix);

    if (toRemove.length > 0) {
      await this.projectResourcesRepository.deleteByPrefixes(projectId, toRemove);
    }

    if (toAdd.length > 0) {
      await this.projectResourcesRepository.createMany(
        toAdd.map((prefix) => ({
          id: crypto.randomUUID(),
          projectId,
          userId: authUserId,
          prefix,
        })),
      );
    }

    return this.projectResourcesRepository.findByProject(projectId);
  }

  public async listNotes(
    authUserId: string,
    projectId: string,
    bucket: R2Bucket,
  ): Promise<ProjectNote[]> {
    await this.getOwnedProject(authUserId, projectId);

    const resources = await this.projectResourcesRepository.findByProject(projectId);

    if (resources.length === 0) return [];

    const listings = await Promise.all(
      resources.map((resource) => bucket.list({ prefix: resource.prefix })),
    );

    const notes: ProjectNote[] = [];
    const seenKeys = new Set<string>();

    for (const listing of listings) {
      for (const object of listing.objects) {
        if (seenKeys.has(object.key)) continue;
        if (!object.key.toLowerCase().endsWith('.md')) continue;
        seenKeys.add(object.key);

        notes.push({
          id: object.key,
          title: this.deriveTitle(object.key),
          path: object.key,
          excerpt: '',
          wordCount: 0,
          updatedAt: object.uploaded.toISOString(),
        });
      }
    }

    notes.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));

    return notes;
  }

  private async getOwnedProject(authUserId: string, projectId: string) {
    const project = await this.projectsRepository.findById(projectId);

    if (!project || project.userId !== authUserId) {
      throw new ProjectsServiceError(`Project not found: ${projectId}`, 404);
    }

    return project;
  }

  private deriveTitle(key: string) {
    const basename = key.split('/').pop() ?? key;
    return basename.replace(/\.md$/i, '');
  }
}
