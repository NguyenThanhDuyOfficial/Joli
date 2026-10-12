import { z } from "zod";
import { PaginationSchema } from "./common.schema";
import { UserSchema } from "./user.schema";
import { ProductImageSchema } from "./product.schema";

export const OrderStatusSchema = z.enum([
  "pending",
  "paid",
  "shipping",
  "delivered",
  "cancelled",
]);

export const PaymentStatusSchema = z.enum([
  "unpaid",
  "pending",
  "paid",
  "failed",
  "refunded",
]);

export const PaymentMethodSchema = z.enum([
  "cod",
  "vnpay",
  "momo",
  "bank_transfer",
]);

export const OrderItemSchema = z.object({
  id: z.uuid(),
  orderId: z.string(),
  productId: z.string(),
  variantId: z.string(),
  name: z.string(),
  imageUrl: z.url(),
  price: z.number(),
  quantity: z.number(),
  subtotal: z.number(),
});

export const OrderSchema = z.object({
  id: z.uuid(),
  userId: z.string(),
  shippingId: z.string().optional().nullable(),
  code: z.string(),
  status: OrderStatusSchema.default("pending").optional(),
  subtotal: z.number(),
  shippingFee: z.number().default(0).optional(),
  total: z.number(),
  paymentMethod: PaymentMethodSchema,
  paymentStatus: PaymentStatusSchema.default("unpaid").optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  items: z.array(OrderItemSchema),
});

export const CreateOrderParamsSchema = OrderSchema.pick({
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

export const ShippingSchema = z.object({
  id: z.uuid(),
  orderId: z.string(),
  name: z.string(),
  phone: z.string(),
  address: z.string(),
  note: z.string().optional().nullable(),
  order: OrderSchema,
});
export const OrderDTOSchema = OrderSchema.pick({
  id: true,
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
  shipping: ShippingSchema.pick({
    id: true,
    name: true,
    phone: true,
    address: true,
    note: true,
  }).nullable(),
});

export const OrderListItemDTOSchema = OrderSchema.pick({
  id: true,
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

export const OrderListDTOSchema = z.object({
  data: z.array(OrderListItemDTOSchema),
  pagination: PaginationSchema,
});

export const OrderListParamsSchema = z.object({
  userId: z.string(),
  page: z.number().default(1).optional(),
  limit: z.number().default(20).optional(),
});

export const CheckoutSessionStatusSchema = z.enum([
  "DRAFT",
  "CONVERTED",
  "EXPIRED",
  "CANCELLED",
]);

export const CheckoutSessionItemSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  productId: z.string(),
  variantId: z.string(),
  productImageId: z.string(),

  name: z.string(),
  unitPrice: z.int(),
  quantity: z.int(),
  subTotal: z.int(),
});

export const CheckoutSessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  orderId: z.string().optional(),

  subTotal: z.int(),
  total: z.int().optional(),
  status: CheckoutSessionStatusSchema.default("DRAFT"),
  expiresAt: z.coerce.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateCheckOutSessionInputSchema = CheckoutSessionSchema.pick({
  userId: true,
}).extend({
  items: z.array(
    CheckoutSessionItemSchema.pick({
      productId: true,
      variantId: true,
      quantity: true,
    }),
  ),
});

export type CreateOrderParams = z.infer<typeof CreateOrderParamsSchema>;
export type OrderDTO = z.infer<typeof OrderDTOSchema>;
export type OrderListDTO = z.infer<typeof OrderListDTOSchema>;
export type OrderListItemDTO = z.infer<typeof OrderListItemDTOSchema>;
export type OrderListParams = z.infer<typeof OrderListParamsSchema>;

export type CheckoutSession = z.infer<typeof CheckoutSessionSchema>;
export type CreateCheckOutSessionInput = z.infer<
  typeof CreateCheckOutSessionInputSchema
>;
