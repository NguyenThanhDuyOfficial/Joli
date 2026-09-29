import 'server-only';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { AppError } from './error';

/**
 * Wrap handler để tự động bắt lỗi và trả về format Error khớp OpenAPI.
 */
export function withErrorHandler<T>(
  handler: () => Promise<NextResponse<T>>,
): Promise<NextResponse> {
  return handler().catch((err: unknown) => {
    // Zod validation error
    if (err instanceof ZodError) {
      return NextResponse.json(
        {
          code: 'VALIDATION_ERROR',
          message: 'Dữ liệu không hợp lệ',
          details: err.flatten(),
        },
        { status: 400 },
      );
    }

    // Custom AppError
    if (err instanceof AppError) {
      return NextResponse.json(
        {
          code: err.code,
          message: err.message,
          details: err.details ?? null,
        },
        { status: err.statusCode },
      );
    }

    // Unknown error
    console.error('[API_ERROR]', err);
    return NextResponse.json(
      {
        code: 'INTERNAL_ERROR',
        message: 'Lỗi hệ thống',
        details: null,
      },
      { status: 500 },
    );
  });
}
