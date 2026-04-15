import { and, asc, eq } from 'drizzle-orm';
import { db } from '../../db/client';
import { Project, projects } from '../../db/schema';

export type CreateProjectInput = {
  id: string;
  name: string;
  key: string;
  description: string;
  userId: string;
};

export class ProjectsRepository {
  public async findMany(params: { userId: string }) {
    return db
      .select()
      .from(projects)
      .where(eq(projects.userId, params.userId))
      .orderBy(asc(projects.createdAt), asc(projects.id));
  }

  public async findById(id: string): Promise<Project | null> {
    const project = await db.select().from(projects).where(eq(projects.id, id)).get();
    return project ?? null;
  }

  public async findByUserAndKey(userId: string, key: string): Promise<Project | null> {
    const project = await db
      .select()
      .from(projects)
      .where(and(eq(projects.userId, userId), eq(projects.key, key)))
      .get();
    return project ?? null;
  }

  public async create(input: CreateProjectInput) {
    await db.insert(projects).values(input);
    return this.findById(input.id);
  }
}
