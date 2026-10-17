import {
  CreateOrderRequest,
  CreateOrderResponse,
  OrderResponse,
} from "@nguyenthanhduyofficial/schemas";
import { OrderRepository } from "../repositories";
import { NotFoundError } from "../error";
import { CheckoutSessionRepository } from "../repositories/checkoutSession.repository";

export class OrderService {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly checkoutRepo: CheckoutSessionRepository,
  ) {}

  async getById(id: string): Promise<OrderResponse> {
    const order = await this.orderRepo.findById(id);
    if (!order) {
      throw new NotFoundError("ORDER_NOT_FOUND");
    }
    return { data: order };
  }

  async create(
    request: CreateOrderRequest,
    userId: string,
  ): Promise<CreateOrderResponse> {
    const checkoutSession = await this.checkoutRepo.findById(
      request.checkoutSessionId,
    );
    if (!checkoutSession) {
      throw new NotFoundError("CHECKOUT_SESSION_NOT_FOUND");
    }
    const data = {
      userId,
      code: generateOrderCode(),
      subTotal: checkoutSession.subTotal,
      total: checkoutSession.total,
      shippingName: request.shippingName,
      shippingPhone: request.shippingPhone,
      shippingAddress: request.shippingAddress,
      note: request.note ?? null,
      items: {
        create: checkoutSession.items.map((item) => ({
          name: item.name,
          image: item.image,
          price: item.price,
          subTotal: item.subTotal,
          quantity: item.quantity,
        })),
      },
    };
    const order = await this.orderRepo.create(data);
    return { data: order };
  }

  // async create(params: CreateOrderParams): Promise<OrderDTO> {
  //   return await this.orderRepo.create(params);
  // }
  // async getList(params: OrderListParams): Promise<OrderListDTO> {
  //   const { page = 1, limit = 20 } = params;
  //   const { data, total } = await this.orderRepo.findMany(params);
  //   return {
  //     data,
  //     pagination: {
  //       page,
  //       limit,
  //       total,
  //       totalPages: Math.ceil(total / limit),
  //     },
  //   };
  // }
  // async getById(id: string): Promise<OrderDTO> {
  //   const order = await this.orderRepo.findById(id);
  //   if (!order) {
  //     throw new NotFoundError("ORDER_NOT_FOUND");
  //   }
  //   return order;
  // }

  // async getCheckoutSessionById(id: string) {
  //   return await this.orderRepo.findCheckoutSessionById(id);
  // }
  //   async createCheckoutSession(params: CreateCheckOutSessionInput) {
  //     // VALIDATE AND BUILD ITEMS
  //     if (!params.items.length) {
  //       throw new BadRequestError("EMPTY_ITEMS");
  //     }
  //     if (params.items.length > 50) {
  //       throw new BadRequestError("TOO_MANY_ITEMS");
  //     }
  //
  //     const variantIds = params.items.map((i) => i.variantId);
  //     const variants = await this.productRepo.findVariantsByIds(variantIds);
  //
  //     const items = params.items.map((item) => {
  //       const variant = variants.find((v) => v.id === item.variantId);
  //
  //       if (!variant) {
  //         throw new NotFoundError(`VARIANT_NOT_FOUND`, `${item.variantId}`);
  //       }
  //       if (variant.stock < item.quantity) {
  //         throw new ConflictError(
  //           `OUT_OF_STOCK`,
  //           `${variant.stock} < ${item.quantity}`,
  //         );
  //       }
  //       if (variant.productId !== item.productId) {
  //         throw new BadRequestError(
  //           `PRODUCT_VARIANT_MISMATCH`,
  //           `${variant.productId} !== ${item.productId}`,
  //         );
  //       }
  //       const primaryImage = variant.images[0];
  //       if (!primaryImage) {
  //         throw new NotFoundError("VARIANT_IMAGE_NOT_FOUND");
  //       }
  //
  //       return {
  //         productId: item.productId,
  //         variantId: item.variantId,
  //         productImageId: primaryImage.id,
  //         unitPrice: variant.price,
  //         name: variant.product.name,
  //         quantity: item.quantity,
  //         subTotal: variant.price * item.quantity,
  //       };
  //     });
  //
  //     // SUBTOTAL & EXPIRESAT
  //     const subTotal = items.reduce((sum, i) => sum + i.subTotal, 0);
  //     const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  //
  //     return await this.orderRepo.createCheckoutSession({
  //       userId: params.userId,
  //       subTotal,
  //       expiresAt,
  //       items: { create: items },
  //     });
  //   }
}
function generateOrderCode(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, ""); // 20261014
  const random = Math.random().toString(36).slice(2, 8).toUpperCase(); // ABC123
  return `JOLI-${date}-${random}`;
}
