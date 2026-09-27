import * as z from 'zod';

export const userRoleSchema = z.enum(['admin', 'user']);
export type UserRole = z.infer<typeof userRoleSchema>;

export const userSchema = z.object({
  id: z.cuid2(),
  name: z.string().min(1).max(100),
  email: z.email().min(1).max(100),
  role: userRoleSchema,
  avatarUrl: z.url().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
export type User = z.infer<typeof userSchema>;

export const createUserInputSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: userRoleSchema.optional().default('user'),
});
export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const updateUserInputSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.email().optional(),
  avatarUrl: z.url().nullable().optional(),
  role: userRoleSchema.optional(),
});
export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

export const userFilterSchema = z.object({
  role: userRoleSchema.optional(),
  search: z.string().optional(),
});
export type UserFilter = z.infer<typeof userFilterSchema>;
