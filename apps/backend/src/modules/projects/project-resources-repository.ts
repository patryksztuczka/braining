import { and, asc, eq, inArray } from 'drizzle-orm';
import { db } from '../../db/client';
import { projectResources, type ProjectResource } from '../../db/schema';

export type CreateProjectResourceInput = {
  id: string;
  projectId: string;
  userId: string;
  prefix: string;
};

export class ProjectResourcesRepository {
  public async findByProject(projectId: string): Promise<ProjectResource[]> {
    return db
      .select()
      .from(projectResources)
      .where(eq(projectResources.projectId, projectId))
      .orderBy(asc(projectResources.createdAt), asc(projectResources.id));
  }

  public async createMany(inputs: CreateProjectResourceInput[]) {
    if (inputs.length === 0) return;
    await db.insert(projectResources).values(inputs).onConflictDoNothing();
  }

  public async deleteByPrefixes(projectId: string, prefixes: string[]) {
    if (prefixes.length === 0) return;
    await db
      .delete(projectResources)
      .where(
        and(
          eq(projectResources.projectId, projectId),
          inArray(projectResources.prefix, prefixes),
        ),
      );
  }
}
