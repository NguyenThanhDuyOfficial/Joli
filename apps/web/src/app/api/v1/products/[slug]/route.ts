import { NextResponse } from 'next/server';
import { productService } from '../../../../../server/container';
import { NotFoundError } from '../../../../../server/error';

export async function GET({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const result = await productService.getBySlug(slug);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.code }, { status: 404 });
    }
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
