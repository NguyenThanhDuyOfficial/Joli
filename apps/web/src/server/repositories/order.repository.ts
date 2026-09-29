import 'server-only';
import { prisma } from '@nguyenthanhduyofficial/database';
import { OrderSchema, OrderListSchema } from '@nguyenthanhduyofficial/schemas';
import type { Prisma } from '@nguyenthanhduyofficial/database';
import { BaseRepository } from './base.repository';
import type {
  OrderListParams,
  OrderListResponse,
  OrderResponse,
  CreateOrderRequest,
} from '@nguyenthanhduyofficial/schemas';

export class OrderRepository extends BaseRepository {
  async findMany(params: OrderListParams): Promise<OrderListResponse> {
    const { userId, status, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {
      userId,
      ...(status && { status }),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { items: true },
      }),
      prisma.order.count({ where }),
    ]);

    const result = {
      data: orders.map((o) => this.serialize(o)),
    };

    return this.parse(OrderListSchema, result);
  }

  async findById(id: string, userId: string): Promise<OrderResponse | null> {
    const order = await prisma.order.findFirst({
      where: { id, userId },
      include: { items: true },
    });

    if (!order) return null;

    return this.parse(OrderSchema, this.serialize(order));
  }

  async create(input: CreateOrderRequest): Promise<OrderResponse> {
    const variantIds = input.items
      .map((i) => i.variantId)
      .filter((id): id is string => id !== null);

    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds }, isActive: true },
      include: {
        product: true,
        images: { orderBy: { isPrimary: 'desc' }, take: 1 },
      },
    });

    if (variants.length !== variantIds.length) {
      throw new OrderError('VARIANT_NOT_FOUND', 'Không tìm thấy biến thể');
    }

    for (const item of input.items) {
      if (!item.variantId) {
        throw new OrderError('VARIANT_REQUIRED', 'Thiếu variantId');
      }
      const variant = variants.find((v) => v.id === item.variantId);
      if (!variant) {
        throw new OrderError('VARIANT_NOT_FOUND', 'Không tìm thấy biến thể');
      }
      if (variant.stock < item.quantity) {
        throw new OrderError(
          'INSUFFICIENT_STOCK',
          `Sản phẩm "${variant.product.name}" không đủ hàng`,
        );
      }
    }

    const itemsData = input.items.map((item) => {
      const variant = variants.find((v) => v.id === item.variantId)!;
      const price = Number(variant.price);
      const subtotal = price * item.quantity;
      return {
        productId: variant.productId,
        variantId: variant.id,
        name: variant.product.name,
        image: variant.images[0]?.url ?? null,
        price,
        quantity: item.quantity,
        subtotal,
      };
    });

    const subtotal = itemsData.reduce((sum, i) => sum + i.subtotal, 0);
    const shippingFee = 0;
    const total = subtotal + shippingFee;

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          code: this.generateOrderCode(),
          userId: input.userId,
          subtotal,
          shippingFee,
          total,
          shippingAddress: JSON.stringify(input.shippingAddress),
          paymentMethod: input.paymentMethod,
          items: { create: itemsData },
        },
        include: { items: true },
      });

      for (const item of input.items) {
        await tx.productVariant.update({
          where: { id: item.variantId! },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return created;
    });

    return this.parse(OrderSchema, this.serialize(order));
  }

  private generateOrderCode(): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `ORD-${date}-${rand}`;
  }

  private serialize(order: any) {
    return {
      id: order.id,
      code: order.code,
      status: order.status,
      subtotal: Number(order.subtotal),
      shippingFee: Number(order.shippingFee),
      total: Number(order.total),
      shippingAddress: JSON.parse(order.shippingAddress),
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((i: any) => ({
        productId: i.productId,
        variantId: i.variantId ?? null,
        name: i.name,
        image: i.image ?? null,
        price: Number(i.price),
        quantity: i.quantity,
        subtotal: Number(i.subtotal),
      })),
    };
  }
}

export class OrderError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = 'OrderError';
  }
}

export const orderRepository = new OrderRepository();
