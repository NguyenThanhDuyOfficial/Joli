import { z } from 'zod';

export const OrderStatusSchema = z.enum([
  'pending',
  'paid',
  'shipping',
  'delivered',
  'cancelled',
]);

export const PaymentStatusSchema = z.enum([
  'unpaid',
  'pending',
  'paid',
  'failed',
  'refunded',
]);

export const PaymentMethodSchema = z.enum([
  'cod',
  'vnpay',
  'momo',
  'bank_transfer',
]);

export const OrderItemSchema = z.object({
  id: z.uuid(),
  orderId: z.string(),
  productId: z.string(),
  variantId: z.string().optional(),
  name: z.string(),
  imageUrl: z.url().optional(),
  price: z.number(),
  quantity: z.number(),
  subtotal: z.number(),
});

export const OrderSchema = z.object({
  id: z.uuid(),
  userId: z.string().optional(),
  shippingId: z.string().optional(),
  code: z.string(),
  status: OrderStatusSchema.default('pending').optional(),
  subtotal: z.number(),
  shippingFee: z.number().default(0).optional(),
  total: z.number(),
  paymentMethod: PaymentMethodSchema,
  paymentStatus: PaymentStatusSchema.default('unpaid').optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  items: z.array(OrderItemSchema),
});

export const OrderParamsSchema = OrderSchema.pick({
  userId: true,
  shippingId: true,
  code: true,
  status: true,
  subtotal: true,
  shippingFee: true,
  total: true,
  paymentMethod: true,
  paymentStatus: true,
}).extend({
  items: z.array(
    OrderItemSchema.pick({
      productId: true,
      variantId: true,
      name: true,
      imageUrl: true,
      price: true,
      quantity: true,
      subtotal: true,
    }),
  ),
});

export type OrderParams = z.infer<typeof OrderParamsSchema>;
