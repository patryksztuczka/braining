export type IssueStatus = 'todo' | 'in_progress' | 'done';

export type Issue = {
  id: string;
  name: string;
  status: IssueStatus;
  createdAt: number;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    createdAt: number;
  };
};

export type IssuesResponse = {
  data: Issue[];
};

export type DashboardColumn = {
  id: IssueStatus;
  title: string;
  color: string;
  issues: Issue[];
};
