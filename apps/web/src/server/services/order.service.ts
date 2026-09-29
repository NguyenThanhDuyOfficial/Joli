import 'server-only';
import { orderRepository, OrderError } from '../repositories/order.repository';
import { AppError, NotFoundError, BadRequestError } from '../error';
import type {
  OrderListParams,
  OrderListResponse,
  OrderResponse,
  CreateOrderRequest,
} from '@nguyenthanhduyofficial/schemas';

export class OrderService {
  async getList(params: OrderListParams): Promise<OrderListResponse> {
    return orderRepository.findMany(params);
  }

  async getById(id: string, userId: string): Promise<OrderResponse> {
    const order = await orderRepository.findById(id, userId);
    if (!order) {
      throw new NotFoundError(
        'ORDER_NOT_FOUND',
        `Không tìm thấy đơn hàng "${id}"`,
      );
    }
    return order;
  }

  async create(input: CreateOrderRequest): Promise<OrderResponse> {
    try {
      return await orderRepository.create(input);
    } catch (err) {
      if (err instanceof OrderError) {
        throw new BadRequestError(err.code, err.message);
      }
      throw err;
    }
  }
}

export const orderService = new OrderService();
