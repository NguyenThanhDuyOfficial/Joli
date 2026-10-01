import { prisma } from '@nguyenthanhduyofficial/database';
import { OrderParams } from '@nguyenthanhduyofficial/schemas';

export class OrderRepository {
  async create(params: OrderParams) {
    const {
      userId,
      shippingId,
      code,
      status = 'pending',
      subtotal,
      shippingFee = 0,
      total,
      paymentMethod,
      paymentStatus = 'unpaid',
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
            variantId: item.variantId ?? null,
            name: item.name,
            imageUrl: item.imageUrl ?? null,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.subtotal,
          })),
        },
      },
      select: {
        id: true,
        code: true,
        status: true,
        subtotal: true,
        shippingFee: true,
        total: true,
        paymentMethod: true,
        paymentStatus: true,
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
          select: { id: true },
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
      },
    });
    return order;
  }
  async findMany(userId: string) {
    const orders = await prisma.order.findMany({
      where: { userId },
      select: {
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
          select: { id: true },
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
      },
    });
    return orders;
  }
  async findById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      select: {
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
          select: { id: true },
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
      },
    });
    return order;
  }
}
