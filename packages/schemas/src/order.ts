import { z } from 'zod';

export const orderStatusSchema = z.enum([
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
]);
export type OrderStatus = z.infer<typeof orderStatusSchema>;

export const orderItemSchema = z.object({
  id: z.uuid(),
  productId: z.uuid(),
  productName: z.string(),
  productImage: z.url().nullable(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  subtotal: z.number().positive(),
});
export type OrderItem = z.infer<typeof orderItemSchema>;

export const orderSchema = z.object({
  id: z.uuid(),
  orderNumber: z.string(),
  userId: z.uuid(),
  items: z.array(orderItemSchema),
  status: orderStatusSchema,
  subtotal: z.number().positive(),
  shippingFee: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  total: z.number().positive(),
  shippingAddress: z.object({
    fullName: z.string(),
    phone: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string().nullable(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
  note: z.string().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
export type Order = z.infer<typeof orderSchema>;

export const createOrderInputSchema = z.object({
  shippingAddressId: z.uuid().optional(),
  note: z.string().optional(),
  paymentMethod: z.string(),
});
export type CreateOrderInput = z.infer<typeof createOrderInputSchema>;

export const updateOrderStatusInputSchema = z.object({
  status: orderStatusSchema,
});
export type UpdateOrderStatusInput = z.infer<
  typeof updateOrderStatusInputSchema
>;
