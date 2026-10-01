import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OrderService } from '../order.service';
import { Decimal } from '../../../../../../packages/database/generated/client/internal/prismaNamespace';
import { CreateOrderParams } from '@nguyenthanhduyofficial/schemas';
import { NotFoundError } from '../../error';

const mockRepo = {
  create: vi.fn(),
  findMany: vi.fn(),
  findById: vi.fn(),
};
const validCreateParams: CreateOrderParams = {
  userId: 'u1',
  code: 'ORD-001',
  subtotal: 100_000,
  total: 100_000,
  paymentMethod: 'cod',
  items: [
    {
      productId: 'p1',
      variantId: 'v1',
      name: 'Áo thun',
      imageUrl: 'https://img.jpg',
      price: 100_000,
      quantity: 1,
      subtotal: 100_000,
    },
  ],
};
const mockOrderResult = {
  id: 'o1',
  code: 'ORD-001',
  status: 'pending' as const,
  subtotal: new Decimal(100_000),
  shippingFee: new Decimal(30_000),
  total: new Decimal(130_000),
  paymentMethod: 'cod' as const,
  paymentStatus: 'unpaid' as const,
  items: [
    {
      id: 'i1',
      productId: 'p1',
      variantId: 'v1',
      name: 'Áo thun',
      imageUrl: 'https://img.jpg',
      price: new Decimal(100_000),
      quantity: 1,
      subtotal: new Decimal(100_000),
    },
  ],
  shipping: {
    id: 's1',
    name: 'Ken',
    phone: '0901234567',
    address: '123 Lê Lợi',
    note: null,
  },
};
describe('OrderService', () => {
  let service: OrderService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new OrderService(mockRepo);
  });
  describe('OrderService.create', () => {
    it('creates order and returns DTO', async () => {
      mockRepo.create = vi.fn().mockResolvedValue(mockOrderResult);

      const result = await service.create(validCreateParams);

      expect(result.id).toBe('o1');
      expect(result.code).toBe('ORD-001');
    });

    it('converts Decimal fields to numbers', async () => {
      mockRepo.create = vi.fn().mockResolvedValue(mockOrderResult);

      const result = await service.create(validCreateParams);

      expect(result.subtotal).toBe(100_000);
      expect(result.shippingFee).toBe(30_000);
      expect(result.total).toBe(130_000);
    });

    it('passes params to repository', async () => {
      mockRepo.create = vi.fn().mockResolvedValue(mockOrderResult);

      await service.create(validCreateParams);

      expect(mockRepo.create).toHaveBeenCalledWith(validCreateParams);
    });
  });
  describe('OrderService.getList', () => {
    it('returns list with pagination', async () => {
      mockRepo.findMany = vi.fn().mockResolvedValue({
        data: [mockOrderResult],
        total: 1,
      });

      const result = await service.getList({ userId: 'u1' });

      expect(result.data).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
    });

    it('calculates totalPages correctly', async () => {
      mockRepo.findMany = vi.fn().mockResolvedValue({
        data: [],
        total: 101,
      });

      const result = await service.getList({
        userId: 'u1',
        page: 1,
        limit: 20,
      });

      expect(result.pagination.totalPages).toBe(6);
    });

    it('converts Decimal in list', async () => {
      mockRepo.findMany = vi.fn().mockResolvedValue({
        data: [mockOrderResult],
        total: 1,
      });

      const result = await service.getList({ userId: 'u1' });

      expect(result.data[0].subtotal).toBe(100_000);
      expect(result.data[0].items[0].price).toBe(100_000);
    });

    it('passes params to repository', async () => {
      mockRepo.findMany = vi.fn().mockResolvedValue({ data: [], total: 0 });

      const params = { userId: 'u1', page: 2, limit: 10 };
      await service.getList(params);

      expect(mockRepo.findMany).toHaveBeenCalledWith(params);
    });
  });
  describe('OrderService.getById', () => {
    it('returns order by id', async () => {
      mockRepo.findById = vi.fn().mockResolvedValue(mockOrderResult);

      const result = await service.getById('o1');

      expect(result.id).toBe('o1');
    });

    it('throws NotFoundError when not found', async () => {
      mockRepo.findById = vi.fn().mockResolvedValue(null);

      await expect(service.getById('ghost')).rejects.toThrow(NotFoundError);
    });

    it('converts Decimal fields', async () => {
      mockRepo.findById = vi.fn().mockResolvedValue(mockOrderResult);

      const result = await service.getById('o1');

      expect(result.subtotal).toBe(100_000);
      expect(result.shippingFee).toBe(30_000);
      expect(result.total).toBe(130_000);
      expect(result.items[0].price).toBe(100_000);
    });

    it('handles null shipping', async () => {
      mockRepo.findById = vi.fn().mockResolvedValue({
        ...mockOrderResult,
        shipping: null,
      });

      const result = await service.getById('o1');

      expect(result.shipping).toBeNull();
    });

    it('passes id to repository', async () => {
      mockRepo.findById = vi.fn().mockResolvedValue(mockOrderResult);

      await service.getById('o1');

      expect(mockRepo.findById).toHaveBeenCalledWith('o1');
    });
  });
});
