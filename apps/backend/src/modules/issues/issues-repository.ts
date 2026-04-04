import { and, asc, eq } from 'drizzle-orm';
import { db } from '../../db/client';
import { Issue, issues, type IssueStatus, User, users } from '../../db/schema';

export type IssueWithUser = Pick<Issue, 'id' | 'name' | 'status' | 'createdAt' | 'userId'> & {
  user: Pick<User, 'id' | 'name' | 'email' | 'image' | 'createdAt'>;
};

export type CreateIssueInput = {
  id: string;
  name: string;
  status: IssueStatus;
  userId: string;
};

export type UpdateIssueInput = Partial<Pick<CreateIssueInput, 'name' | 'status' | 'userId'>>;

export class IssuesRepository {
  public async findMany(params?: { userId?: string; status?: IssueStatus }) {
    const conditions = [];

    if (params?.userId) {
      conditions.push(eq(issues.userId, params.userId));
    }

    if (params?.status) {
      conditions.push(eq(issues.status, params.status));
    }

    const whereClause =
      conditions.length === 0
        ? undefined
        : conditions.length === 1
          ? conditions[0]
          : and(...conditions);

    const rows = await db
      .select({ issues, users })
      .from(issues)
      .innerJoin(users, eq(issues.userId, users.id))
      .where(whereClause)
      .orderBy(asc(issues.createdAt), asc(issues.id));

    return rows.map((row) => this.mapIssueWithUser(row));
  }

  public async findById(id: string) {
    const row = await db
      .select({ issues, users })
      .from(issues)
      .innerJoin(users, eq(issues.userId, users.id))
      .where(eq(issues.id, id))
      .get();

    return row ? this.mapIssueWithUser(row) : null;
  }

  public async create(input: CreateIssueInput) {
    await db.insert(issues).values(input);

    return this.findById(input.id);
  }

  public async update(id: string, input: UpdateIssueInput) {
    if (Object.keys(input).length === 0) {
      return this.findById(id);
    }

    await db.update(issues).set(input).where(eq(issues.id, id));

    return this.findById(id);
  }

  public async delete(id: string) {
    const issue = await this.findById(id);

    if (!issue) {
      return null;
    }

    await db.delete(issues).where(eq(issues.id, id));

    return issue;
  }

  private mapIssueWithUser(row: { issues: Issue; users: User }): IssueWithUser {
    return {
      id: row.issues.id,
      name: row.issues.name,
      status: row.issues.status,
      createdAt: row.issues.createdAt,
      userId: row.issues.userId,
      user: {
        id: row.users.id,
        name: row.users.name,
        email: row.users.email,
        image: row.users.image,
        createdAt: row.users.createdAt,
      },
    };
  }
}
