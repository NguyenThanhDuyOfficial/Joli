import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from '../route';

vi.mock('../../../../../server/container', () => ({
  productService: { getList: vi.fn() },
}));

import { productService } from '../../../../../server/container';
import { ProductListParamsSchema } from '@nguyenthanhduyofficial/schemas';

describe('/api/v1/products', () => {
  const mockGetList = vi.mocked(productService.getList);
  const createRequest = (query = '') =>
    new NextRequest(`http://localhost:3000/api/v1/products${query}`);

  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe('GET', () => {
    it('should return 200', async () => {
      const mockResult = {
        data: [],
        pagination: { page: 1, totalPages: 1, limit: 20, total: 1 },
      };
      mockGetList.mockResolvedValue(mockResult);

      const res = await GET(createRequest());

      expect(mockGetList).toHaveBeenCalledWith({
        page: 1,
        limit: 20,
        sort: 'newest',
      });
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual(mockResult);
    });
    it('should return 400 when query params invalid', async () => {
      const res = await GET(createRequest('?page=abc'));

      expect(mockGetList).not.toHaveBeenCalled();
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({
        error: 'INVALID_QUERY',
        details: {
          formErrors: [],
          fieldErrors: {
            page: ['Invalid input: expected number, received NaN'],
          },
        },
      });
    });

    it('should return 500 when service throws', async () => {
      mockGetList.mockRejectedValue(new Error('DB connection failed'));

      const res = await GET(createRequest());

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ error: 'INTERNAL_SERVER_ERROR' });
    });

    it('should pass all parsed query params to service', async () => {
      mockGetList.mockResolvedValue({
        data: [],
        pagination: { page: 2, totalPages: 1, limit: 10, total: 0 },
      });

      await GET(createRequest('?page=2&limit=10&search=laptop'));

      expect(mockGetList).toHaveBeenCalledWith({
        page: 2,
        limit: 10,
        sort: 'newest',
        search: 'laptop',
      });
    });

    it('should return empty list with 200', async () => {
      mockGetList.mockResolvedValue({
        data: [],
        pagination: { page: 1, totalPages: 0, limit: 20, total: 0 },
      });

      const res = await GET(createRequest());

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.data).toEqual([]);
      expect(body.pagination.total).toBe(0);
    });
  });
});
