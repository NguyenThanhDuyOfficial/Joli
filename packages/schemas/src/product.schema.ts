import { z } from 'zod';
import {
  CategoryParamSchema,
  LimitParamSchema,
  PageParamSchema,
  PaginationSchema,
  SearchParamSchema,
  SortParamSchema,
  TagParamSchema,
} from './common.schema';
import { UserSchema } from './user.schema';
import { OrderItemSchema } from './order.schema';

export const ProductImageSchema = z.object({
  id: z.uuid(),
  variantId: z.string(),
  url: z.url(),
  alt: z.string().nullable().optional(),
  isPrimary: z.boolean().default(false),
  createdAt: z.iso.datetime(),
});

export const ProductVariantSchema = z.object({
  id: z.uuid(),
  productId: z.string(),
  size: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  price: z.number().nullable(),
  stock: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  createdAt: z.iso.datetime(),
  images: z.array(ProductImageSchema),
});

export const ProductCategorySchema = z.object({
  id: z.uuid(),
  parentId: z.string().optional(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.iso.datetime(),
});

export const ProductTagSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
});

export const ProductSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
  starRating: z.number(),
  reviewCount: z.number(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),

  variants: z.array(ProductVariantSchema),
  categories: z.array(ProductCategorySchema),
  tags: z.array(ProductTagSchema),
  get loves() {
    return z.array(UserSchema.omit({ productLove: true }));
  },
  orderItem: z.array(OrderItemSchema),
});

export const ProductListItemDTOSchema = ProductSchema.pick({
  id: true,
  name: true,
  slug: true,
}).extend({
  tags: z.array(ProductTagSchema),
  variants: z.array(
    ProductVariantSchema.pick({
      id: true,
      size: true,
      color: true,
      price: true,
      stock: true,
    }).extend({
      images: z.array(
        ProductImageSchema.pick({
          id: true,
          url: true,
          alt: true,
        }),
      ),
    }),
  ),
});

export const ProductListDTOSchema = z.object({
  data: z.array(ProductListItemDTOSchema),
  pagination: PaginationSchema,
});

export const ProductDetailDTOSchema = ProductSchema.pick({
  id: true,
  name: true,
  description: true,
  starRating: true,
  reviewCount: true,
}).extend({
  isLoved: z.boolean().default(false),
  tags: z.array(ProductTagSchema),
  variants: z.array(
    ProductVariantSchema.pick({
      id: true,
      size: true,
      color: true,
      price: true,
      stock: true,
    }).extend({
      images: z.array(
        ProductImageSchema.pick({
          id: true,
          url: true,
          alt: true,
          isPrimary: true,
        }),
      ),
    }),
  ),
});

export const ProductListParamsSchema = z.object({
  category: CategoryParamSchema,
  tag: TagParamSchema,
  search: SearchParamSchema,
  sort: SortParamSchema,
  page: PageParamSchema,
  limit: LimitParamSchema,
});

export type Product = z.infer<typeof ProductSchema>;
export type ProductListDTO = z.infer<typeof ProductListDTOSchema>;
export type ProductListParams = z.infer<typeof ProductListParamsSchema>;
export type ProductDetailDTO = z.infer<typeof ProductDetailDTOSchema>;
export type ProductListItemDTO = z.infer<typeof ProductListItemDTOSchema>;
