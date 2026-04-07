import type { DashboardColumn, IssueStatus } from './boards-types';

export const STATUS_CONFIG: Record<IssueStatus, Omit<DashboardColumn, 'issues'>> = {
  todo: {
    id: 'todo',
    title: 'To Do',
    color: '#818cf8',
  },
  in_progress: {
    id: 'in_progress',
    title: 'In Progress',
    color: '#f59e0b',
  },
  done: {
    id: 'done',
    title: 'Done',
    color: '#34d399',
  },
};

export const STATUS_ORDER: IssueStatus[] = ['todo', 'in_progress', 'done'];

export const TABS = ['Backlog', 'Roadmap', 'Active sprints', 'Releases', 'Reports', 'Tasks'];
