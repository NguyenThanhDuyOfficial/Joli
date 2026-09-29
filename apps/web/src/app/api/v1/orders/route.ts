import { NextRequest, NextResponse } from 'next/server';
import { orderService } from '../../../../server/services';
import { requireSession } from '../../../../server/auth';
import { withErrorHandler } from '../../../../server/http';
import {
  CreateOrderRequestSchema,
  OrderListParamsSchema,
} from '@nguyenthanhduyofficial/schemas';

// ═══════════════════════════════════════════
// GET /api/v1/orders
// ═══════════════════════════════════════════
export async function GET(req: NextRequest) {
  return withErrorHandler(async () => {
    const session = await requireSession();

    const searchParams = Object.fromEntries(req.nextUrl.searchParams);

    const params = OrderListParamsSchema.parse({
      userId: session.user.id,
      status: searchParams.status,
      page: searchParams.page,
      limit: searchParams.limit,
    });

    const result = await orderService.getList(params);
    return NextResponse.json(result);
  });
}

// ═══════════════════════════════════════════
// POST /api/v1/orders
// ═══════════════════════════════════════════
export async function POST(req: NextRequest) {
  return withErrorHandler(async () => {
    const session = await requireSession();

    const body = await req.json();

    const input = CreateOrderRequestSchema.parse({
      ...body,
      userId: session.user.id,
    });

    const order = await orderService.create(input);
    return NextResponse.json(order, { status: 201 });
  });
}
