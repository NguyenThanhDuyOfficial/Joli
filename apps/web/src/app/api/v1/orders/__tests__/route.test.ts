import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '../route';
import { auth } from '../../../../../server/auth';
import { orderService } from '../../../../../server/container';

vi.mock('../../../../../server/auth', () => ({
  auth: { api: { getSession: vi.fn() } },
}));

vi.mock('../../../../../server/container', () => ({
  orderService: {
    getList: vi.fn(),
    create: vi.fn(),
  },
}));

const mockGetSession = vi.mocked(auth.api.getSession);
const mockGetList = vi.mocked(orderService.getList);
const mockCreate = vi.mocked(orderService.create);

const session = { user: { id: 'user-1' } };

function createRequest(params: string = '') {
  return new NextRequest(`http://localhost/api/v1/orders${params}`);
}
function createPostRequest(url: string, body: unknown = '') {
  return new NextRequest(`http://localhost/api/v1/orders${url}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('GET /api/v1/orders', () => {
  it('returns 401 when no session', async () => {
    mockGetSession.mockResolvedValue(null);

    const res = await GET(createRequest(''));

    expect(res.status).toBe(401);
    expect(mockGetList).not.toHaveBeenCalled();
  });

  it('returns orders for the current user', async () => {
    mockGetSession.mockResolvedValue(session as never);
    mockGetList.mockResolvedValue({ items: [], total: 0 } as never);

    const res = await GET(createRequest());

    expect(mockGetList).toHaveBeenCalledWith({
      userId: 'user-1',
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ items: [], total: 0 });
  });

  it('falls back to undefined when params are invalid', async () => {
    mockGetSession.mockResolvedValue(session as never);
    mockGetList.mockResolvedValue({ items: [], total: 0 } as never);

    await GET(createRequest('?page=abc'));

    expect(mockGetList).toHaveBeenCalledWith({
      userId: 'user-1',
      page: undefined,
      limit: undefined,
    });
  });
});

describe('POST /api/v1/orders', () => {
  it('returns 401 when no session', async () => {
    mockGetSession.mockResolvedValue(null);

    const res = await POST(createPostRequest(''));

    expect(res.status).toBe(401);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('returns 400 when body is invalid', async () => {
    mockGetSession.mockResolvedValue(session as never);

    const res = await POST(createPostRequest(''));

    expect(res.status).toBe(400);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('creates an order for the current user', async () => {
    mockGetSession.mockResolvedValue(session as never);
    mockCreate.mockResolvedValue({ id: 'order-1' } as never);

    const body = {
      userId: 'user-1',
      shippingId: 'ship-1',
      code: 'ORD-001',
      status: 'pending',
      subtotal: 200,
      shippingFee: 20,
      total: 220,
      paymentMethod: 'cod' as const,
      paymentStatus: 'unpaid',
      items: [
        {
          productId: 'p1',
          variantId: 'v1',
          name: 'Product 1',
          imageUrl: 'https://example.com/p1.jpg',
          price: 100,
          quantity: 2,
          subtotal: 200,
        },
      ],
    };
    const res = await POST(createPostRequest('', body));

    expect(mockCreate).toHaveBeenCalledWith({
      ...body,
      userId: 'user-1',
    });
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ id: 'order-1' });
  });
});
