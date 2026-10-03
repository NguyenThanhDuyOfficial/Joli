import { NextRequest, NextResponse } from 'next/server';
import { orderService } from '../../../../../server/container';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const result = await orderService.getById(id);
  return NextResponse.json(result);
}
