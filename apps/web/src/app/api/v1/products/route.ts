import { NextRequest, NextResponse } from 'next/server';
import { ProductListParamsSchema } from '@nguyenthanhduyofficial/schemas';
import { productService } from '../../../../server/container';
import z from 'zod';

export async function GET(req: NextRequest) {
  const parsed = ProductListParamsSchema.safeParse(
    Object.fromEntries(req.nextUrl.searchParams),
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'INVALID_QUERY', details: z.flattenError(parsed.error) },
      { status: 400 },
    );
  }
  const result = await productService.getList(parsed.data);
  return NextResponse.json(result);
}
