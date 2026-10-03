// src/app/api/v1/orders/[id]/__tests__/route.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '../route';
import { orderService } from '../../../../../../server/container';

vi.mock('../../../../../../server/container', () => ({
  orderService: {
    getById: vi.fn(),
  },
}));

const mockGetById = vi.mocked(orderService.getById);

function createRequest() {
  return new NextRequest('http://localhost/api/v1/orders/order-1');
}

function createParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('POST /api/v1/orders/[id]', () => {
  it('returns the order by id', async () => {
    mockGetById.mockResolvedValue({ id: 'order-1', total: 220 } as never);

    const res = await POST(createRequest(), createParams('order-1'));

    expect(mockGetById).toHaveBeenCalledWith('order-1');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ id: 'order-1', total: 220 });
  });

  it('returns null when order not found', async () => {
    mockGetById.mockResolvedValue(null as never);

    const res = await POST(createRequest(), createParams('missing'));

    expect(mockGetById).toHaveBeenCalledWith('missing');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(null);
  });
});
