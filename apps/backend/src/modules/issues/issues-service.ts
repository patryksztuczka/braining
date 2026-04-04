import {
  IssuesRepository,
  type CreateIssueInput,
  type UpdateIssueInput,
  type IssueWithUser,
} from './issues-repository';
import { UsersRepository } from '../users/users-repository';
import type { CreateIssueSchema, ListIssuesQuerySchema, UpdateIssueSchema } from './issues-schemas';

export class IssuesServiceError extends Error {
  constructor(
    message: string,
    readonly statusCode: 400 | 404 | 500,
  ) {
    super(message);
  }
}

export class IssuesService {
  public constructor(
    private readonly issuesRepository: IssuesRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  public async list(authUserId: string, input?: ListIssuesQuerySchema) {
    return this.issuesRepository.findMany({
      userId: authUserId,
      status: input?.status,
    });
  }

  public async getById(authUserId: string, id: string) {
    const issue = await this.issuesRepository.findById(id);

    if (!issue || issue.userId !== authUserId) {
      throw new IssuesServiceError(`Issue not found: ${id}`, 404);
    }

    return issue;
  }

  public async create(authUserId: string, input: CreateIssueSchema) {
    const payload: CreateIssueInput = {
      id: crypto.randomUUID(),
      name: input.name,
      status: input.status,
      userId: authUserId,
    };

    await this.ensureUserExists(payload.userId);

    const issue = await this.issuesRepository.create(payload);

    if (!issue) {
      throw new IssuesServiceError('Failed to create issue', 500);
    }

    return issue;
  }

  public async update(authUserId: string, id: string, input: UpdateIssueSchema) {
    await this.getOwnedIssue(authUserId, id);

    const payload: UpdateIssueInput = {};

    if (input.name !== undefined) {
      payload.name = input.name;
    }

    if (input.status !== undefined) {
      payload.status = input.status;
    }

    const issue = await this.issuesRepository.update(id, payload);

    if (!issue) {
      throw new IssuesServiceError(`Issue not found: ${id}`, 404);
    }

    return issue;
  }

  public async delete(authUserId: string, id: string) {
    await this.getOwnedIssue(authUserId, id);

    const issue = await this.issuesRepository.delete(id);

    if (!issue) {
      throw new IssuesServiceError(`Issue not found: ${id}`, 404);
    }

    return issue;
  }

  private async ensureUserExists(userId: string) {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new IssuesServiceError(`User not found: ${userId}`, 404);
    }
  }

  private async getOwnedIssue(authUserId: string, issueId: string): Promise<IssueWithUser> {
    return this.getById(authUserId, issueId);
  }
}
