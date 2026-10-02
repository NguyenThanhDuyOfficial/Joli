import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../server/auth';
import {
  CreateOrderParamsSchema,
  OrderListParamsSchema,
} from '@nguyenthanhduyofficial/schemas';
import { orderService } from '../../../../server/container';
import { UnauthorizedError } from '../../../../server/error';
import z from 'zod';

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsed = OrderListParamsSchema.safeParse(
    Object.fromEntries(req.nextUrl.searchParams),
  );
  const userId = session.user.id;

  const result = await orderService.getList({
    userId,
    page: parsed.data?.page,
    limit: parsed.data?.limit,
  });
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsed = CreateOrderParamsSchema.safeParse(await req.json());

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid params', details: z.flattenError(parsed.error) },
      { status: 400 },
    );
  }

  const userId = session.user.id;
  const result = await orderService.create({
    ...parsed.data,
    userId,
  });

  return NextResponse.json(result, { status: 201 });
}
