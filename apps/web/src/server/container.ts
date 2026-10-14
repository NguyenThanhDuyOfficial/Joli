import { OrderRepository, ProductRepository } from "./repositories";
import { CheckoutSessionRepository } from "./repositories/checkoutSession.repository";
import { OrderService, ProductService } from "./services";
import { CheckoutSessionService } from "./services/checkoutSession.service";

export const productRepo = new ProductRepository();
export const productService = new ProductService(productRepo);

export const checkoutSessionRepo = new CheckoutSessionRepository();
export const checkoutSessionService = new CheckoutSessionService(
  checkoutSessionRepo,
  productRepo,
);
export const orderRepo = new OrderRepository();
export const orderService = new OrderService(
  orderRepo,
  productRepo,
  checkoutSessionRepo,
);
