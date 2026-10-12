import { Prisma, prisma } from "@nguyenthanhduyofficial/database";
import {
  CreateCheckOutSession,
  CreateOrderParams,
  OrderListParams,
} from "@nguyenthanhduyofficial/schemas";

export class OrderRepository {
  async create(params: CreateOrderParams) {
    const {
      userId,
      shippingId,
      code,
      status = "pending",
      subtotal,
      shippingFee = 0,
      total,
      paymentMethod,
      paymentStatus = "unpaid",
      items,
    } = params ?? {};

    const order = await prisma.order.create({
      data: {
        userId,
        shippingId,
        code,
        status,
        subtotal,
        shippingFee,
        total,
        paymentMethod,
        paymentStatus,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            name: item.name,
            imageUrl: item.imageUrl ?? null,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.subtotal,
          })),
        },
      },
      select: orderDetailSelect,
    });
    return order;
  }
  async findMany(params: OrderListParams) {
    const { userId, page = 1, limit = 20 } = params;
    const where: Prisma.OrderWhereInput = {};
    where.userId = userId;
    const [orders, total] = await Promise.all([
      await prisma.order.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        select: orderDetailSelect,
      }),
      prisma.order.count({ where }),
    ]);
    return {
      data: orders,
      total,
    };
  }
  async findById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      select: orderDetailSelect,
    });
    return order;
  }

  async createCheckoutSession(params: CreateCheckOutSession) {
    const { userId, subTotal, expiresAt, items } = params;
    const session = await prisma.checkoutSession.create({
      data: {
        userId,
        subTotal,
        expiresAt,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subTotal: item.subTotal,
          })),
        },
      },
      select: { id: true, userId: true, subTotal: true, items: true },
    });
    return session;
  }
}
export const orderDetailSelect: Prisma.OrderSelect = {
  id: true,
  code: true,
  status: true,
  subtotal: true,
  shippingFee: true,
  total: true,
  paymentMethod: true,
  paymentStatus: true,
  createdAt: true,
  updatedAt: true,
  items: {
    select: {
      id: true,
      productId: true,
      variantId: true,
      name: true,
      imageUrl: true,
      price: true,
      quantity: true,
      subtotal: true,
    },
  },
  user: {
    select: {
      id: true,
    },
  },
  shipping: {
    select: {
      id: true,
      name: true,
      phone: true,
      address: true,
      note: true,
    },
  },
};
export type OrderDetailResult = Prisma.OrderGetPayload<{
  select: typeof orderDetailSelect;
}>;
