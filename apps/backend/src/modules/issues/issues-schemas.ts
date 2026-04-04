import { z } from 'zod';
import { issueStatuses } from '../../db/schema';

export const issueStatusSchema = z.enum(issueStatuses);

export const issueIdParamsSchema = z.object({
  id: z.string().trim().min(1, 'Issue id is required'),
});

export const listIssuesQuerySchema = z.object({
  status: issueStatusSchema.optional(),
});

export const createIssueSchema = z.object({
  name: z.string().trim().min(1, 'Issue name is required'),
  status: issueStatusSchema,
});

export const updateIssueSchema = z
  .object({
    name: z.string().trim().min(1, 'Issue name is required').optional(),
    status: issueStatusSchema.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field is required',
  });

export type CreateIssueSchema = z.infer<typeof createIssueSchema>;
export type IssueIdParamsSchema = z.infer<typeof issueIdParamsSchema>;
export type ListIssuesQuerySchema = z.infer<typeof listIssuesQuerySchema>;
export type UpdateIssueSchema = z.infer<typeof updateIssueSchema>;
