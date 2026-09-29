import { z } from 'zod';
import { CategorySchema } from './category.schema';
import {
  CategoryParamSchema,
  LimitParamSchema,
  PageParamSchema,
  PaginationSchema,
  SearchParamSchema,
  SortParamSchema,
  TagParamSchema,
} from './common.schema';

export const ProductImageSchema = z.object({
  id: z.uuid(),
  url: z.url(),
  alt: z.string().nullable().optional(),
  isPrimary: z.boolean(),
});

export const ProductVariantSchema = z.object({
  id: z.uuid(),
  sku: z.string().nullable().optional(),
  size: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  price: z.number().nullable().optional(),
  stock: z.number().int().min(0),
  images: z.array(ProductImageSchema),
  isActive: z.boolean(),
});

export const ProductSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
  price: z.number(),
  description: z.string().nullable().optional(),
  isLoved: z.boolean(),
  starRating: z.number(),
  variants: z.array(ProductVariantSchema),
  categories: z.array(CategorySchema),
  tags: z.array(z.string()),
});

export const ProductListItemSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
  variants: z.array(ProductVariantSchema),
  tags: z.array(z.string()),
});

export const ProductListSchema = z.object({
  data: z.array(ProductListItemSchema),
  pagination: PaginationSchema,
});

export const ProductListParamsSchema = z.object({
  category: CategoryParamSchema,
  tag: TagParamSchema,
  search: SearchParamSchema,
  sort: SortParamSchema,
  page: PageParamSchema,
  limit: LimitParamSchema,
});

export type ProductResponse = z.infer<typeof ProductSchema>;
export type ProductListParams = z.infer<typeof ProductListParamsSchema>;
export type ProductListResponse = z.infer<typeof ProductListSchema>;
export type ProductDetailResponse = z.infer<typeof ProductSchema>;
