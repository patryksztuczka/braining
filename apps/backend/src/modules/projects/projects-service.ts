import { ProjectsRepository, type CreateProjectInput } from './projects-repository';
import { UsersRepository } from '../users/users-repository';
import type { CreateProjectSchema } from './projects-schemas';

export class ProjectsServiceError extends Error {
  constructor(
    message: string,
    readonly statusCode: 400 | 404 | 409 | 500,
  ) {
    super(message);
  }
}

export class ProjectsService {
  public constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly usersRepository: UsersRepository,
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
}
