import { prisma } from "@nguyenthanhduyofficial/database";
import type { Prisma } from "@nguyenthanhduyofficial/database";

export const ProductSelect = {
  id: true,
  name: true,
  slug: true,
  variants: {
    select: {
      id: true,
      size: true,
      color: true,
      price: true,
      stock: true,
      images: { select: { id: true, url: true, alt: true } },
    },
  },
  tags: {
    select: {
      tag: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  },
} satisfies Prisma.ProductSelect;

export type Product = Prisma.ProductGetPayload<{
  select: typeof ProductSelect;
}>;

export class ProductRepository {
  async count(where: Prisma.ProductWhereInput) {
    return await prisma.product.count({ where });
  }
  async findUnique(where: Prisma.ProductWhereUniqueInput) {
    return prisma.product.findUnique({
      where,
      select: ProductSelect,
    });
  }

  async findMany(params: {
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
    skip?: number;
    take?: number;
  }) {
    const { where, orderBy, skip, take } = params;
    return prisma.product.findMany({
      where,
      orderBy,
      skip,
      take,
      select: ProductSelect,
    });
  }

  async findByName(name: string) {
    const keyword = `%${name}%`;
    return prisma.$queryRaw<{ id: string }[]>`
    SELECT id
    FROM "product"
    WHERE unaccent(LOWER(name)) LIKE unaccent(LOWER(${keyword}))
  `;
  }

  async findBySlug(slug: string, userId?: string) {
    return await prisma.product.findUnique({
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
  async findVariantsByIds(ids: string[]) {
    return await prisma.productVariant.findMany({
      where: { id: { in: ids }, isActive: true },
      select: {
        id: true,
        stock: true,
        productId: true,
        price: true,
        product: { select: { name: true } },
        images: {
          where: { isPrimary: true },
          select: { url: true },
          take: 1,
        },
      },
    });
  }
}
