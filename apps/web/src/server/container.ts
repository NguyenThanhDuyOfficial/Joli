import { OrderRepository, ProductRepository } from './repositories';
import { OrderService, ProductService } from './services';

export const orderRepo = new OrderRepository();
export const orderService = new OrderService(orderRepo);

export const productRepo = new ProductRepository();
export const productService = new ProductService(productRepo);
