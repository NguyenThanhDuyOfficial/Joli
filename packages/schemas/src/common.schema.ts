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

export const PageParamSchema = z.coerce.number().int().min(1).default(1);
export const LimitParamSchema = z.coerce
  .number()
  .int()
  .min(1)
  .max(100)
  .default(20);

export const SortParamSchema = z
  .enum(['newest', 'bestsellers', 'price_asc', 'price_desc'])
  .default('newest');

export const SearchParamSchema = z.string().min(1).max(100).optional();

export const CsvParamSchema = z
  .string()
  .optional()
  .transform((val) => (val ? val.split(',').map((s) => s.trim()) : undefined));

export const CategoryParamSchema = CsvParamSchema;
export const TagParamSchema = CsvParamSchema;
