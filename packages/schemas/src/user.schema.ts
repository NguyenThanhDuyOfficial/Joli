import { z } from 'zod';

export const UserRoleSchema = z
  .enum(['admin', 'user', 'manager'])
  .default('user');

export const UserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  name: z.string(),
  emailVerified: z.boolean(),
  role: UserRoleSchema,
});
