import z from "zod";

export const TagResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
});

export const ImageResponseSchea = z.object({
  id: z.string(),
  url: z.string(),
  alt: z.string().nullable(),
});

export const VariantResponseSchema = z.object({
  id: z.string(),
  size: z.string(),
  color: z.string(),
  price: z.int().nonnegative(),
  stock: z.int().nonnegative(),
  images: z.array(ImageResponseSchea),
});

export const ProductListItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  variants: z.array(VariantResponseSchema),
  tags: z.array(TagResponseSchema),
});

export const PaginationSchema = z.object({
  page: z.int().positive(),
  limit: z.int().positive(),
  total: z.int().nonnegative(),
  totalPages: z.int().nonnegative(),
});

export const ProductsListResponseSchema = z.object({
  data: z.array(ProductListItemSchema),
  pagination: PaginationSchema,
});

export const SortSchema = z.enum(["newest", "bestseller"]).default("newest");

export const ProductsRequestSchema = z.object({
  category: z.array(z.string()).optional(),
  tag: z.array(z.string()).optional(),
  search: z.string().optional(),
  sort: SortSchema.optional(),
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
});

export const ProductItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  starRating: z.number().nonnegative(),
  reviewCount: z.int().nonnegative(),
  variants: z.array(VariantResponseSchema),
  tags: z.array(TagResponseSchema),
  loves: z.array(z.object({ userId: z.string() })),
});
export const ProductResponseSchema = z.object({
  data: ProductItemSchema,
});

export type ProductListItem = z.infer<typeof ProductListItemSchema>;
export type ProductItem = z.infer<typeof ProductItemSchema>;
export type ProductsListResponse = z.infer<typeof ProductsListResponseSchema>;
export type ProductResponse = z.infer<typeof ProductResponseSchema>;
export type Sort = z.infer<typeof SortSchema>;
export type ProductsRequest = z.infer<typeof ProductsRequestSchema>;
