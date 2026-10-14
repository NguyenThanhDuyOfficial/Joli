import {
  CheckoutSessionResponse,
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionResponse,
} from "@nguyenthanhduyofficial/schemas";
import { CheckoutSessionRepository } from "../repositories/checkoutSession.repository";
import { ProductRepository } from "../repositories";
import { BadRequestError, NotFoundError } from "../error";

export class CheckoutSessionService {
  constructor(
    private readonly checkoutSessionRepo: CheckoutSessionRepository,
    private readonly productRepo: ProductRepository,
  ) {}

  async getById(id: string): Promise<CheckoutSessionResponse> {
    const checkoutSession = await this.checkoutSessionRepo.findById(id);
    if (!checkoutSession) {
      throw new NotFoundError("CHECKOUT_SESSION_NOT_FOUND");
    }
    return checkoutSession;
  }

  async createCheckoutSession(
    request: CreateCheckoutSessionRequest,
    userId: string,
  ): Promise<CreateCheckoutSessionResponse> {
    const variantIds = request.items.map((i) => i.variantId);
    const variants = await this.productRepo.findVariantsByIds(variantIds);
    const variantMap = new Map(variants.map((v) => [v.id, v]));

    const items = request.items.map((item) => {
      const variant = variantMap.get(item.variantId);

      if (!variant) {
        throw new NotFoundError("VARIANT_NOT_FOUND");
      }

      if (variant.stock < item.quantity) {
        throw new BadRequestError("OUT_OF_STOCK");
      }

      const subTotal = variant?.price * item.quantity;

      return {
        productId: variant.productId,
        variantId: variant.id,
        name: variant.product.name,
        image: variant.images[0]!.url,
        price: variant.price,
        quantity: item.quantity,
        subTotal,
      };
    });

    const subTotal = items.reduce((sum, i) => sum + i.subTotal, 0);
    const total = subTotal;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const data = {
      userId,
      subTotal,
      total,
      expiresAt,
      items: { create: items },
    };

    const checkoutSession = await this.checkoutSessionRepo.create(data);
    return { data: checkoutSession };
  }
}
