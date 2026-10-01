import { beforeEach, vi, describe, it, expect } from 'vitest';
import { ProductService } from '../product.service';
import { Decimal } from '../../../../../../packages/database/generated/client/internal/prismaNamespace';
import { NotFoundError } from '../../error';

const mockRepo = {
  findMany: vi.fn(),
  findBySlug: vi.fn(),
};

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ProductService(mockRepo);
  });

  describe('ProductService.getList', () => {
    it('returns products with pagination', async () => {
      mockRepo.findMany = vi.fn().mockResolvedValue({
        data: [
          {
            id: 'p1',
            name: 'Áo thun',
            slug: 'ao-thun',
            tags: [{ tag: { id: 't1', name: 'Sale', slug: 'sale' } }],
            variants: [
              {
                id: 'v1',
                price: new Decimal(100_000),
                stock: 5,
                images: [{ url: 'https://img.jpg' }],
              },
            ],
          },
        ],
        total: 1,
      });

      const result = await service.getList({ page: 1, limit: 20 });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe('p1');
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.totalPages).toBe(1);
    });
    it('flattens tags', async () => {
      mockRepo.findMany = vi.fn().mockResolvedValue({
        data: [
          {
            id: 'p1',
            name: 'Áo thun',
            slug: 'ao-thun',
            tags: [
              { tag: { id: 't1', name: 'Sale', slug: 'sale' } },
              { tag: { id: 't2', name: 'New', slug: 'new' } },
            ],
            variants: [],
          },
        ],
        total: 1,
      });

      const result = await service.getList({});

      expect(result.data[0].tags).toEqual([
        { id: 't1', name: 'Sale', slug: 'sale' },
        { id: 't2', name: 'New', slug: 'new' },
      ]);
      expect(result.data[0].tags[0]).not.toHaveProperty('tag');
    });
    it('converts price from Decimal to number', async () => {
      mockRepo.findMany = vi.fn().mockResolvedValue({
        data: [
          {
            id: 'p1',
            name: 'Áo thun',
            slug: 'ao-thun',
            tags: [],
            variants: [{ id: 'v1', price: new Decimal(100_000), stock: 5 }],
          },
        ],
        total: 1,
      });

      const result = await service.getList({});

      expect(result.data[0].variants[0].price).toBe(100_000);
      expect(typeof result.data[0].variants[0].price).toBe('number');
    });
    it('calculates totalPages correctly', async () => {
      mockRepo.findMany = vi.fn().mockResolvedValue({
        data: [],
        total: 101,
      });

      const result = await service.getList({ page: 1, limit: 20 });

      expect(result.pagination.totalPages).toBe(6);
    });

    it('uses default page and limit', async () => {
      mockRepo.findMany = vi.fn().mockResolvedValue({ data: [], total: 0 });

      const result = await service.getList({});

      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(20);
    });
    it('returns empty data when no products', async () => {
      mockRepo.findMany = vi.fn().mockResolvedValue({ data: [], total: 0 });

      const result = await service.getList({});

      expect(result.data).toEqual([]);
      expect(result.pagination.total).toBe(0);
      expect(result.pagination.totalPages).toBe(0);
    });
    it('passes params to repository', async () => {
      mockRepo.findMany = vi.fn().mockResolvedValue({ data: [], total: 0 });

      const params = { page: 2, limit: 10, search: 'ao' };
      await service.getList(params);

      expect(mockRepo.findMany).toHaveBeenCalledWith(params);
      expect(mockRepo.findMany).toHaveBeenCalledTimes(1);
    });
  });
  describe('ProductService.getBySlug', () => {
    it('returns product detail', async () => {
      mockRepo.findBySlug = vi.fn().mockResolvedValue({
        id: 'p1',
        name: 'Áo thun',
        slug: 'ao-thun',
        description: 'Mô tả',
        starRating: new Decimal(4.5),
        reviewCount: 10,
        loveCount: 100,
        tags: [{ tag: { id: 't1', name: 'Sale', slug: 'sale' } }],
        variants: [
          {
            id: 'v1',
            price: new Decimal(100_000),
            stock: 5,
            images: [{ url: 'https://img.jpg', isPrimary: true }],
          },
        ],
        loves: [],
      });

      const result = await service.getBySlug('ao-thun');

      expect(result.id).toBe('p1');
      expect(result.name).toBe('Áo thun');
    });
    it('throws NotFoundError when product not found', async () => {
      mockRepo.findBySlug = vi.fn().mockResolvedValue(null);

      await expect(service.getBySlug('ghost')).rejects.toThrow(NotFoundError);
    });
    it('sets isLoved true when user loved product', async () => {
      mockRepo.findBySlug = vi.fn().mockResolvedValue({
        id: 'p1',
        name: 'Áo thun',
        slug: 'ao-thun',
        starRating: new Decimal(4.5),
        tags: [],
        variants: [],
        loves: [{ userId: 'u1' }], // ← user đã love
      });

      const result = await service.getBySlug('ao-thun', 'u1');

      expect(result.isLoved).toBe(true);
    });
    it('sets isLoved false when user has not loved', async () => {
      mockRepo.findBySlug = vi.fn().mockResolvedValue({
        id: 'p1',
        name: 'Áo thun',
        slug: 'ao-thun',
        starRating: new Decimal(4.5),
        tags: [],
        variants: [],
        loves: [], // ← chưa love
      });

      const result = await service.getBySlug('ao-thun', 'u1');

      expect(result.isLoved).toBe(false);
    });
    it('sets isLoved false when userId is not provided', async () => {
      mockRepo.findBySlug = vi.fn().mockResolvedValue({
        id: 'p1',
        name: 'Áo thun',
        slug: 'ao-thun',
        starRating: new Decimal(4.5),
        tags: [],
        variants: [],
        loves: [],
      });

      const result = await service.getBySlug('ao-thun'); // ← không userId

      expect(result.isLoved).toBe(false);
    });
    it('converts starRating from Decimal to number', async () => {
      mockRepo.findBySlug = vi.fn().mockResolvedValue({
        id: 'p1',
        name: 'Áo thun',
        slug: 'ao-thun',
        starRating: new Decimal(4.5),
        tags: [],
        variants: [],
        loves: [],
      });

      const result = await service.getBySlug('ao-thun');

      expect(result.starRating).toBe(4.5);
      expect(typeof result.starRating).toBe('number');
    });
    it('converts variant price to number', async () => {
      mockRepo.findBySlug = vi.fn().mockResolvedValue({
        id: 'p1',
        name: 'Áo thun',
        slug: 'ao-thun',
        starRating: new Decimal(4.5),
        tags: [],
        variants: [{ id: 'v1', price: new Decimal(200_000), stock: 10 }],
        loves: [],
      });

      const result = await service.getBySlug('ao-thun');

      expect(result.variants[0].price).toBe(200_000);
      expect(typeof result.variants[0].price).toBe('number');
    });
    it('passes slug and userId to repository', async () => {
      mockRepo.findBySlug = vi.fn().mockResolvedValue({
        id: 'p1',
        name: 'Áo thun',
        slug: 'ao-thun',
        starRating: new Decimal(4.5),
        tags: [],
        variants: [],
        loves: [],
      });

      await service.getBySlug('ao-thun', 'u1');

      expect(mockRepo.findBySlug).toHaveBeenCalledWith('ao-thun', 'u1');
      expect(mockRepo.findBySlug).toHaveBeenCalledTimes(1);
    });
  });
});
