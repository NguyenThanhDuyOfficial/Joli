import {
  CreateOrderParams,
  OrderDTO,
  OrderListDTO,
  OrderListParams,
} from '@nguyenthanhduyofficial/schemas';
import { OrderDetailResult, OrderRepository } from '../repositories';
import { NotFoundError } from '../error';

export class OrderService {
  constructor(private readonly orderRepo: OrderRepository) {}

  async create(params: CreateOrderParams): Promise<OrderDTO> {
    const order = await this.orderRepo.create(params);
    return transformToDTO(order);
  }
  async getList(params: OrderListParams): Promise<OrderListDTO> {
    const { page = 1, limit = 20 } = params;
    const { data, total } = await this.orderRepo.findMany(params);
    return {
      data: data.map((order) => transformToDTO(order)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  async getById(id: string): Promise<OrderDTO> {
    const order = await this.orderRepo.findById(id);
    if (!order) {
      throw new NotFoundError('ORDER_NOT_FOUND');
    }
    return transformToDTO(order);
  }
}

function transformToDTO(order: OrderDetailResult): OrderDTO {
  const { items, shippingFee, total, subtotal, ...o } = order;
  return {
    ...o,
    subtotal: Number(subtotal),
    total: Number(total),
    shippingFee: Number(shippingFee),
    items: items.map(({ price, subtotal, ...i }) => ({
      ...i,
      subtotal: Number(subtotal),
      price: Number(price),
    })),
  };
}
