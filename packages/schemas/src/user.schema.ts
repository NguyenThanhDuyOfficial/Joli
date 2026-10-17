import { z } from "zod";

export const UserRoleSchema = z
  .enum(["admin", "user", "manager"])
  .default("user");

export const UserSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
  role: UserRoleSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
