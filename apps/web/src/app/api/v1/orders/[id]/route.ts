import { NextRequest, NextResponse } from 'next/server';
import { orderService } from '../../../../../server/services';
import { requireSession } from '../../../../../server/auth';
import { withErrorHandler } from '../../../../../server/http';
import { OrderDetailParamsSchema } from '@nguyenthanhduyofficial/schemas';

// ═══════════════════════════════════════════
// GET /api/v1/orders/{id}
// ═══════════════════════════════════════════
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withErrorHandler(async () => {
    const session = await requireSession();
    const { id } = await params;

    const input = OrderDetailParamsSchema.parse({
      id,
      userId: session.user.id,
    });

    const order = await orderService.getById(input.id, input.userId);
    return NextResponse.json(order);
  });
}
