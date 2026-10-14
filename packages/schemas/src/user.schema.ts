import { z } from "zod";
import { ProductSchema } from "./product.schema";

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
  get productLove() {
    return z.array(ProductSchema.omit({ loves: true }));
  },
});
