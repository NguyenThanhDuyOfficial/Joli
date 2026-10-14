import z from "zod";

export const CheckoutSessionStatusSchema = z.enum([
  "DRAFT",
  "CONVERTED",
  "EXPIRED",
  "CANCELLED",
]);

export const CheckoutSessionItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string(),
  price: z.int().nonnegative(),
  quantity: z.int().nonnegative(),
  subTotal: z.int().nonnegative(),
});

export const CheckoutSessionSchema = z.object({
  id: z.string(),
  subTotal: z.int().nonnegative(),
  total: z.int().nonnegative(),
  items: z.array(CheckoutSessionItemSchema),
});

export const CheckoutSessionsResponseSchema = z.object({
  data: CheckoutSessionSchema,
});

export const CheckoutSessionRequestSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string(),
      quantity: z.int().nonnegative(),
    }),
  ),
});

export const CreateCheckoutSessionRequestSchema = CheckoutSessionRequestSchema;
export const CreateCheckoutSessionResponseSchema = z.object({
  data: z.object({
    id: z.string(),
  }),
});
export type CreateCheckoutSessionRequest = z.infer<
  typeof CreateCheckoutSessionRequestSchema
>;
export type CreateCheckoutSessionResponse = z.infer<
  typeof CreateCheckoutSessionResponseSchema
>;
export type CheckoutSessionsResponse = z.infer<
  typeof CheckoutSessionsResponseSchema
>;
export type CheckoutSessionResponse = z.infer<typeof CheckoutSessionSchema>;
export type CheckoutSessionRequest = z.infer<
  typeof CheckoutSessionRequestSchema
>;
