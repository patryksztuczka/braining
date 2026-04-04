import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IssuesService, IssuesServiceError } from '../src/modules/issues/issues-service';
import { IssuesRepository, IssueWithUser } from '../src/modules/issues/issues-repository';
import { UsersRepository } from '../src/modules/users/users-repository';
import { mock } from 'vitest-mock-extended';

const issues: IssueWithUser[] = [
  {
    id: 'issue_1',
    name: 'Issue 1',
    status: 'in_progress',
    userId: 'usr_1',
    user: {
      id: 'usr_1',
      email: 'user1@example.com',
      image: null,
      name: 'John Doe',
      createdAt: new Date(),
    },
    createdAt: new Date(),
  },
  {
    id: 'issue_2',
    name: 'Issue 2',
    status: 'todo',
    userId: 'usr_1',
    user: {
      id: 'usr_1',
      email: 'user1@example.com',
      image: null,
      name: 'John Doe',
      createdAt: new Date(),
    },
    createdAt: new Date(),
  },
  {
    id: 'issue_3',
    name: 'Issue 3',
    status: 'todo',
    userId: 'usr_2',
    user: {
      id: 'usr_2',
      email: 'user2@example.com',
      image: null,
      name: 'Jane Doe',
      createdAt: new Date(),
    },
    createdAt: new Date(),
  },
];

async function expectIssuesServiceError(
  action: Promise<unknown>,
  expectedMessage: string,
  expectedStatusCode: 400 | 404 | 500,
) {
  try {
    await action;
    expect.unreachable('Expected service to throw');
  } catch (err) {
    expect(err).toBeInstanceOf(IssuesServiceError);
    expect((err as IssuesServiceError).message).toBe(expectedMessage);
    expect((err as IssuesServiceError).statusCode).toBe(expectedStatusCode);
  }
}

describe('issues service', () => {
  const usersRepoMock = mock<UsersRepository>();
  const issuesRepoMock = mock<IssuesRepository>();
  const issuesService = new IssuesService(issuesRepoMock, usersRepoMock);

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  describe('list', () => {
    it('returns all issues for given user and status', async () => {
      issuesRepoMock.findMany.mockResolvedValue([issues[1]]);
      const res = await issuesService.list('usr_1', { status: 'todo' });

      expect(issuesRepoMock.findMany).toHaveBeenCalledWith({
        userId: 'usr_1',
        status: 'todo',
      });
      expect(res.length).toBe(1);
      expect(res).toEqual([issues[1]]);
    });

    it('returns all issues for given user without status filter', async () => {
      issuesRepoMock.findMany.mockResolvedValue([issues[0], issues[1]]);

      const res = await issuesService.list('usr_1');

      expect(issuesRepoMock.findMany).toHaveBeenCalledWith({
        userId: 'usr_1',
        status: undefined,
      });
      expect(res).toEqual([issues[0], issues[1]]);
    });
  });

  describe('getById', () => {
    it('returns issue by id for owning user', async () => {
      issuesRepoMock.findById.mockResolvedValue(issues[0]);

      const res = await issuesService.getById('usr_1', 'issue_1');

      expect(issuesRepoMock.findById).toHaveBeenCalledWith('issue_1');
      expect(res).toEqual(issues[0]);
    });

    it('throws 404 when issue does not exist', async () => {
      issuesRepoMock.findById.mockResolvedValue(null);

      await expectIssuesServiceError(
        issuesService.getById('usr_1', 'missing_issue'),
        'Issue not found: missing_issue',
        404,
      );

      expect(issuesRepoMock.findById).toHaveBeenCalledWith('missing_issue');
    });

    it('throws 404 when trying to access issue of different user', async () => {
      issuesRepoMock.findById.mockResolvedValue(issues[2]);

      await expectIssuesServiceError(
        issuesService.getById('usr_1', 'issue_3'),
        'Issue not found: issue_3',
        404,
      );

      expect(issuesRepoMock.findById).toHaveBeenCalledWith('issue_3');
    });
  });

  describe('create', () => {
    it('creates and returns new issue with user data', async () => {
      usersRepoMock.findById.mockResolvedValue({
        id: 'usr_2',
        email: 'user2@example.com',
        emailVerified: true,
        image: null,
        name: 'Jane Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const newIssue: IssueWithUser = {
        id: 'issue_4',
        name: 'New Issue',
        status: 'todo',
        userId: 'usr_2',
        user: {
          id: 'usr_2',
          email: 'user2@example.com',
          image: null,
          name: 'Jane Doe',
          createdAt: new Date(),
        },
        createdAt: new Date(),
      };
      vi.spyOn(crypto, 'randomUUID').mockReturnValue('issue_4');
      issuesRepoMock.create.mockResolvedValue(newIssue);

      const res = await issuesService.create('usr_2', {
        name: 'New Issue',
        status: 'todo',
      });

      expect(usersRepoMock.findById).toHaveBeenCalledWith('usr_2');
      expect(issuesRepoMock.create).toHaveBeenCalledWith({
        id: 'issue_4',
        name: 'New Issue',
        status: 'todo',
        userId: 'usr_2',
      });
      expect(res).toEqual(newIssue);
    });

    it('throws 404 when user does not exist during create', async () => {
      usersRepoMock.findById.mockResolvedValue(null);
      vi.spyOn(crypto, 'randomUUID').mockReturnValue('issue_4');

      await expectIssuesServiceError(
        issuesService.create('usr_2', {
          name: 'New Issue',
          status: 'todo',
        }),
        'User not found: usr_2',
        404,
      );

      expect(usersRepoMock.findById).toHaveBeenCalledWith('usr_2');
      expect(issuesRepoMock.create).not.toHaveBeenCalled();
    });

    it('throws 500 when repository fails to create issue', async () => {
      usersRepoMock.findById.mockResolvedValue({
        id: 'usr_2',
        email: 'user2@example.com',
        emailVerified: true,
        image: null,
        name: 'Jane Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      vi.spyOn(crypto, 'randomUUID').mockReturnValue('issue_4');
      issuesRepoMock.create.mockResolvedValue(null);

      await expectIssuesServiceError(
        issuesService.create('usr_2', {
          name: 'New Issue',
          status: 'todo',
        }),
        'Failed to create issue',
        500,
      );

      expect(usersRepoMock.findById).toHaveBeenCalledWith('usr_2');
      expect(issuesRepoMock.create).toHaveBeenCalledWith({
        id: 'issue_4',
        name: 'New Issue',
        status: 'todo',
        userId: 'usr_2',
      });
    });
  });

  describe('update', () => {
    it('updates issue name and returns updated issue', async () => {
      const updatedIssue: IssueWithUser = {
        ...issues[1],
        name: 'Updated Issue 2',
      };
      issuesRepoMock.findById.mockResolvedValue(issues[1]);
      issuesRepoMock.update.mockResolvedValue(updatedIssue);

      const res = await issuesService.update('usr_1', 'issue_2', { name: 'Updated Issue 2' });

      expect(issuesRepoMock.findById).toHaveBeenCalledWith('issue_2');
      expect(issuesRepoMock.update).toHaveBeenCalledWith('issue_2', { name: 'Updated Issue 2' });
      expect(res).toEqual(updatedIssue);
    });

    it('updates issue with empty payload when no input is passed', async () => {
      issuesRepoMock.findById.mockResolvedValue(issues[1]);
      issuesRepoMock.update.mockResolvedValue(issues[1]);

      const res = await issuesService.update('usr_1', 'issue_2', {});

      expect(issuesRepoMock.update).toHaveBeenCalledWith('issue_2', {});
      expect(res).toEqual(issues[1]);
    });

    it('updates issue status and returns updated issue', async () => {
      const updatedIssue: IssueWithUser = {
        ...issues[1],
        status: 'done',
      };
      issuesRepoMock.findById.mockResolvedValue(issues[1]);
      issuesRepoMock.update.mockResolvedValue(updatedIssue);

      const res = await issuesService.update('usr_1', 'issue_2', { status: 'done' });

      expect(issuesRepoMock.update).toHaveBeenCalledWith('issue_2', { status: 'done' });
      expect(res).toEqual(updatedIssue);
    });

    it('throws 404 when updating issue that does not exist', async () => {
      issuesRepoMock.findById.mockResolvedValue(null);

      await expectIssuesServiceError(
        issuesService.update('usr_1', 'missing_issue', { name: 'Updated Issue' }),
        'Issue not found: missing_issue',
        404,
      );

      expect(issuesRepoMock.findById).toHaveBeenCalledWith('missing_issue');
      expect(issuesRepoMock.update).not.toHaveBeenCalled();
    });

    it('throws 404 when updating issue of different user', async () => {
      issuesRepoMock.findById.mockResolvedValue(issues[2]);

      await expectIssuesServiceError(
        issuesService.update('usr_1', 'issue_3', { name: 'Updated Issue' }),
        'Issue not found: issue_3',
        404,
      );

      expect(issuesRepoMock.findById).toHaveBeenCalledWith('issue_3');
      expect(issuesRepoMock.update).not.toHaveBeenCalled();
    });

    it('throws 404 when repository cannot update owned issue', async () => {
      issuesRepoMock.findById.mockResolvedValue(issues[1]);
      issuesRepoMock.update.mockResolvedValue(null);

      await expectIssuesServiceError(
        issuesService.update('usr_1', 'issue_2', { name: 'Updated Issue' }),
        'Issue not found: issue_2',
        404,
      );

      expect(issuesRepoMock.update).toHaveBeenCalledWith('issue_2', { name: 'Updated Issue' });
    });
  });

  describe('delete', () => {
    it('deletes owned issue and returns deleted issue', async () => {
      issuesRepoMock.findById.mockResolvedValue(issues[1]);
      issuesRepoMock.delete.mockResolvedValue(issues[1]);

      const res = await issuesService.delete('usr_1', 'issue_2');

      expect(issuesRepoMock.findById).toHaveBeenCalledWith('issue_2');
      expect(issuesRepoMock.delete).toHaveBeenCalledWith('issue_2');
      expect(res).toEqual(issues[1]);
    });

    it('throws 404 when deleting issue that does not exist', async () => {
      issuesRepoMock.findById.mockResolvedValue(null);

      await expectIssuesServiceError(
        issuesService.delete('usr_1', 'missing_issue'),
        'Issue not found: missing_issue',
        404,
      );

      expect(issuesRepoMock.findById).toHaveBeenCalledWith('missing_issue');
      expect(issuesRepoMock.delete).not.toHaveBeenCalled();
    });

    it('throws 404 when deleting issue of different user', async () => {
      issuesRepoMock.findById.mockResolvedValue(issues[2]);

      await expectIssuesServiceError(
        issuesService.delete('usr_1', 'issue_3'),
        'Issue not found: issue_3',
        404,
      );

      expect(issuesRepoMock.findById).toHaveBeenCalledWith('issue_3');
      expect(issuesRepoMock.delete).not.toHaveBeenCalled();
    });

    it('throws 404 when repository cannot delete owned issue', async () => {
      issuesRepoMock.findById.mockResolvedValue(issues[1]);
      issuesRepoMock.delete.mockResolvedValue(null);

      await expectIssuesServiceError(
        issuesService.delete('usr_1', 'issue_2'),
        'Issue not found: issue_2',
        404,
      );

      expect(issuesRepoMock.delete).toHaveBeenCalledWith('issue_2');
    });
  });
});
