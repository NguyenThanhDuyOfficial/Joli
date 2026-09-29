import { NextRequest, NextResponse } from 'next/server';
import { productService } from '../../../../server/services/index';
import { getSession } from '../../../../server/auth';
import { withErrorHandler } from '../../../../server/http';
import { ProductListParamsSchema } from '@nguyenthanhduyofficial/schemas';

// ═══════════════════════════════════════════
// GET /api/v1/products
// ═══════════════════════════════════════════
export async function GET(req: NextRequest) {
  return withErrorHandler(async () => {
    const searchParams = Object.fromEntries(req.nextUrl.searchParams);

    const params = ProductListParamsSchema.parse(searchParams);

    const session = await getSession();
    const result = await productService.getList(params, session?.user?.id);

    return NextResponse.json(result);
  });
}
