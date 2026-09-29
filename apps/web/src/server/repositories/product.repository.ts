import 'server-only';
import { prisma } from '@nguyenthanhduyofficial/database';
import {
  ProductSchema,
  ProductListSchema,
} from '@nguyenthanhduyofficial/schemas';
import type { Prisma } from '@nguyenthanhduyofficial/database';
import { BaseRepository } from './base.repository';
import type {
  ProductListParams,
  ProductListResponse,
  ProductResponse,
} from '@nguyenthanhduyofficial/schemas';

export class ProductRepository extends BaseRepository {
  async findMany(
    params: ProductListParams,
    userId?: string | null,
  ): Promise<ProductListResponse> {
    const { category, tag, search, sort, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      AND: [
        ...(category?.length
          ? [
              {
                categories: {
                  some: {
                    category: { slug: { in: category } },
                  },
                },
              } satisfies Prisma.ProductWhereInput,
            ]
          : []),

        ...(tag?.length
          ? [
              {
                tags: {
                  some: { tag: { slug: { in: tag } } },
                },
              } satisfies Prisma.ProductWhereInput,
            ]
          : []),

        ...(search
          ? [
              {
                name: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
              } satisfies Prisma.ProductWhereInput,
            ]
          : []),
      ],
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: this.buildOrderBy(sort),
        skip,
        take: limit,
        include: {
          variants: {
            where: { isActive: true },
            include: {
              images: { orderBy: { isPrimary: 'desc' } },
            },
          },
          categories: { include: { category: true } },
          tags: { include: { tag: true } },
          loves: userId
            ? { where: { userId }, select: { userId: true } }
            : false,
        },
      }),
      prisma.product.count({ where }),
    ]);

    const result = {
      data: products.map((p) => this.serializeListItem(p, userId)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    return this.parse(ProductListSchema, result);
  }

  async findBySlug(
    slug: string,
    userId?: string | null,
  ): Promise<ProductResponse | null> {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        variants: {
          where: { isActive: true },
          include: {
            images: { orderBy: { isPrimary: 'desc' } },
          },
        },
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        loves: userId ? { where: { userId }, select: { userId: true } } : false,
      },
    });

    if (!product) return null;

    return this.parse(ProductSchema, this.serializeDetail(product, userId));
  }

  private buildOrderBy(
    sort: ProductListParams['sort'],
  ): Prisma.ProductOrderByWithRelationInput {
    switch (sort) {
      case 'bestsellers':
        return { orderItems: { _count: 'desc' } };
      case 'price_asc':
      case 'price_desc':
        return { createdAt: 'desc' };
      case 'newest':
      default:
        return { createdAt: 'desc' };
    }
  }

  private serializeListItem(product: any, userId?: string | null) {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      tags: product.tags.map((pt: any) => pt.tag.slug),
      variants: product.variants.map((v: any) => this.serializeVariant(v)),
    };
  }

  private serializeDetail(product: any, userId?: string | null) {
    const isLoved = Array.isArray(product.loves)
      ? product.loves.length > 0
      : false;

    const price = product.variants.length
      ? Math.min(...product.variants.map((v: any) => Number(v.price)))
      : 0;

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price,
      description: product.description ?? null,
      isLoved,
      starRating: Number(product.starRating),
      tags: product.tags.map((pt: any) => pt.tag.slug),
      variants: product.variants.map((v: any) => this.serializeVariant(v)),
      categories: product.categories.map((pc: any) => ({
        id: pc.category.id,
        name: pc.category.name,
        slug: pc.category.slug,
      })),
    };
  }

  private serializeVariant(v: any) {
    return {
      id: v.id,
      sku: v.sku ?? null,
      size: v.size ?? null,
      color: v.color ?? null,
      price: Number(v.price),
      stock: v.stock,
      isActive: v.isActive,
      images: v.images.map((img: any) => ({
        id: img.id,
        url: img.url,
        alt: img.alt ?? null,
        isPrimary: img.isPrimary,
      })),
    };
  }
}

export const productRepository = new ProductRepository();
