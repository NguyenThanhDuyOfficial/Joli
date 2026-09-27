import * as z from 'zod';

export const productSchema = z.object({
  id: z.cuid2(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(255),
  description: z.string().nullable(),
  price: z.number().positive(),
  sku: z.string().nullable(),
  stock: z.number().int().nonnegative(),
  categoryId: z.uuid().nullable(),
  images: z.array(z.url()),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
export type Product = z.infer<typeof productSchema>;

export const createProductInputSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().optional(),
  price: z.number().positive(),
  sku: z.string().optional(),
  stock: z.number().int().nonnegative().default(0),
  categoryId: z.uuid().optional(),
  images: z.array(z.url()).default([]),
});
export type CreateProductInput = z.infer<typeof createProductInputSchema>;

export const updateProductInputSchema = createProductInputSchema.partial();
export type UpdateProductInput = z.infer<typeof updateProductInputSchema>;

export const productFilterSchema = z.object({
  categoryId: z.uuid().optional(),
  search: z.string().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
});
export type ProductFilter = z.infer<typeof productFilterSchema>;
