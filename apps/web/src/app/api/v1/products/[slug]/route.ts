import { NextRequest, NextResponse } from 'next/server';
import { productService } from '../../../../../server/services';
import { getSession } from '../../../../../server/auth';
import { withErrorHandler } from '../../../../../server/http';

// ═══════════════════════════════════════════
// GET /api/v1/products/{slug}
// ═══════════════════════════════════════════
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  return withErrorHandler(async () => {
    const { slug } = await params;

    const session = await getSession();
    const product = await productService.getBySlug(slug, session?.user?.id);

    return NextResponse.json(product);
  });
}
