import { z } from 'zod';
import { LimitParamSchema, PageParamSchema } from './common.schema';

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
  productId: z.uuid(),
  variantId: z.uuid().nullable().optional(),
  name: z.string(),
  image: z.url().nullable().optional(),
  price: z.number(),
  quantity: z.number().int(),
  subtotal: z.number(),
});

export const ShippingAddressSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  note: z.string().nullable().optional(),
});

export const OrderSchema = z.object({
  id: z.uuid(),
  code: z.string(),
  status: OrderStatusSchema,
  items: z.array(OrderItemSchema),
  subtotal: z.number(),
  shippingFee: z.number(),
  total: z.number(),
  shippingAddress: ShippingAddressSchema,
  paymentMethod: PaymentMethodSchema,
  paymentStatus: PaymentStatusSchema,
  createdAt: z.iso.datetime(),
});

export const OrderListSchema = z.object({
  data: z.array(OrderSchema),
});

export const CreateOrderItemSchema = z.object({
  productId: z.uuid(),
  variantId: z.uuid().nullable().optional(),
  quantity: z.number().int().min(1),
});

export const CreateOrderSchema = z.object({
  items: z.array(CreateOrderItemSchema).min(1),
  shippingAddress: ShippingAddressSchema,
  paymentMethod: PaymentMethodSchema,
});

export const OrderListParamsSchema = z.object({
  userId: z.uuid(),
  status: z
    .enum(['pending', 'paid', 'shipping', 'delivered', 'cancelled'])
    .optional(),
  page: PageParamSchema,
  limit: LimitParamSchema,
});

export const CreateOrderRequestSchema = CreateOrderSchema.extend({
  userId: z.uuid().nullable(),
});
export const OrderDetailParamsSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
});

export type OrderResponse = z.infer<typeof OrderSchema>;
export type OrderListResponse = z.infer<typeof OrderListSchema>;
export type CreateOrderRequest = z.infer<typeof CreateOrderRequestSchema>;
export type OrderListParams = z.infer<typeof OrderListParamsSchema>;
