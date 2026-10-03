import { z } from 'zod';

export const ErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.string(), z.unknown()).nullable().optional(),
});
export type BadRequestResponse = z.infer<typeof ErrorSchema>;
export type UnauthorizedResponse = z.infer<typeof ErrorSchema>;
export type NotFoundResponse = z.infer<typeof ErrorSchema>;
export type InternalErrorResponse = z.infer<typeof ErrorSchema>;

export const PaginationSchema = z.object({
  page: z.int(),
  limit: z.int(),
  total: z.int(),
  totalPages: z.int(),
});

export const PageParamSchema = z.coerce
  .number()
  .int()
  .min(1)
  .default(1)
  .optional();
export const LimitParamSchema = z.coerce
  .number()
  .int()
  .min(1)
  .max(100)
  .default(20)
  .optional();

export const SortParamSchema = z
  .enum(['newest', 'bestsellers'])
  .default('newest')
  .optional();

export const SearchParamSchema = z.string().min(1).max(100).optional();

const CsvParamSchema = z
  .union([z.string(), z.array(z.string())])
  .transform((val) => {
    const arr = Array.isArray(val) ? val : val.split(',');
    return arr.map((s) => s.trim()).filter(Boolean);
  })
  .optional();

export const CategoryParamSchema = CsvParamSchema;
export const TagParamSchema = CsvParamSchema;

export type SortParam = z.infer<typeof SortParamSchema>;
