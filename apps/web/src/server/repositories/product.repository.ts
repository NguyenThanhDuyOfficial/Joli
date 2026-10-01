import { prisma } from '@nguyenthanhduyofficial/database';
import type { Prisma } from '@nguyenthanhduyofficial/database';
import {
  type ProductListParams,
  type SortParam,
} from '@nguyenthanhduyofficial/schemas';

export class ProductRepository {
  async findMany(params?: ProductListParams) {
    const {
      category,
      tag,
      search,
      sort = 'newest',
      page = 1,
      limit = 20,
    } = params ?? {};

    const where: Prisma.ProductWhereInput = {};
    if (category) {
      where.categories = {
        some: { category: { slug: { in: category } } },
      };
    }
    if (tag) {
      where.tags = {
        some: { tag: { slug: { in: tag } } },
      };
    }
    //Prisma does not support accent-insensitive search out of the box.
    // So I used Postgres's unaccent extension combined with a raw query.
    if (search) {
      const keyword = `%${search}%`;
      const rows = await prisma.$queryRaw<{ id: string }[]>`
        SELECT id
        FROM products
        WHERE unaccent(LOWER(name)) LIKE unaccent(LOWER(${keyword}))`;
      const ids = rows.map((r) => r.id);

      if (ids.length === 0) {
        return { data: [], total: 0 };
      }

      where.id = { in: ids };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: getOrderBy(sort),
        select: {
          id: true,
          name: true,
          slug: true,
          tags: { select: { tag: true } },
          variants: {
            select: {
              id: true,
              size: true,
              color: true,
              price: true,
              stock: true,
              images: {
                where: { isPrimary: true },
                take: 1,
                select: {
                  id: true,
                  url: true,
                  alt: true,
                },
              },
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      data: products,
      total,
    };
  }

  async findBySlug(slug: string, userId?: string) {
    return prisma.product.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        description: true,
        starRating: true,
        reviewCount: true,
        loves: {
          where: { userId },
          select: { userId: true },
        },
        tags: {
          select: { tag: true },
        },
        variants: {
          select: {
            id: true,
            size: true,
            color: true,
            price: true,
            stock: true,
            images: {
              select: {
                id: true,
                url: true,
                alt: true,
                isPrimary: true,
              },
            },
          },
        },
      },
    });
  }
}

export function getOrderBy(
  sort: SortParam,
): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case 'bestsellers':
      return { orderItems: { _count: 'desc' } };
    case 'newest':
    default:
      return { createdAt: 'desc' };
  }
}
