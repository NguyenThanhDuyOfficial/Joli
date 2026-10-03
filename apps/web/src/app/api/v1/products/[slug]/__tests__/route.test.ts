import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from '../route';
import { NotFoundError } from '../../../../../../server/error';

vi.mock('../../../../../../server/container', () => ({
  productService: { getBySlug: vi.fn() },
}));

import { productService } from '../../../../../../server/container';

describe('/api/v1/products/[slug]', () => {
  const mockGetBySlug = vi.mocked(productService.getBySlug);

  const createContext = (slug: string) => ({
    params: Promise.resolve({ slug }),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('should return 200 with product data', async () => {
      const mockProduct = {
        id: '1',
        slug: 'iphone-15',
        name: 'iPhone 15',
        price: 999,
      };
      mockGetBySlug.mockResolvedValue(mockProduct as any);

      const res = await GET(createContext('iphone-15'));

      expect(mockGetBySlug).toHaveBeenCalledWith('iphone-15');
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual(mockProduct);
    });

    it('should return 404 when product not found', async () => {
      const error = new NotFoundError('PRODUCT_NOT_FOUND');
      mockGetBySlug.mockRejectedValue(error);

      const res = await GET(createContext('non-existent'));

      expect(mockGetBySlug).toHaveBeenCalledWith('non-existent');
      expect(res.status).toBe(404);
      expect(await res.json()).toEqual({ error: 'PRODUCT_NOT_FOUND' });
    });

    it('should return 500 on unexpected error', async () => {
      mockGetBySlug.mockRejectedValue(new Error('DB connection failed'));

      const res = await GET(createContext('iphone-15'));

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ error: 'INTERNAL_ERROR' });
    });

    it('should pass slug from params correctly', async () => {
      mockGetBySlug.mockResolvedValue({ id: '1', slug: 'test' } as any);

      await GET(createContext('my-product-slug'));

      expect(mockGetBySlug).toHaveBeenCalledTimes(1);
      expect(mockGetBySlug).toHaveBeenCalledWith('my-product-slug');
    });

    it('should handle slug with special characters', async () => {
      mockGetBySlug.mockResolvedValue({ id: '1', slug: 'abc-123-xyz' } as any);

      const res = await GET(createContext('abc-123-xyz'));

      expect(mockGetBySlug).toHaveBeenCalledWith('abc-123-xyz');
      expect(res.status).toBe(200);
    });

    it('should return 500 when NotFoundError subclass check fails', async () => {
      mockGetBySlug.mockRejectedValue(new TypeError('unexpected'));

      const res = await GET(createContext('iphone-15'));

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ error: 'INTERNAL_ERROR' });
    });
  });
});
