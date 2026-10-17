import { ProductRepository } from "../repositories/product.repository";
import type {
  ProductsRequest,
  Sort,
  ProductResponse,
  ProductsListResponse,
} from "@nguyenthanhduyofficial/schemas";
import { Prisma } from "@nguyenthanhduyofficial/database";
import { NotFoundError } from "../error";

export class ProductService {
  constructor(private readonly productRepo: ProductRepository) {}

  async getBySlug(slug: string, userId?: string): Promise<ProductResponse> {
    const product = await this.productRepo.findBySlug(slug, userId);
    if (!product) {
      throw new NotFoundError("PRODUCT_NOT_FOUND");
    }
    return {
      data: {
        ...product,
        starRating: product.starRating.toNumber(),
        tags: product.tags.map((t) => t.tag),
      },
    };
  }

  async getMany(request?: ProductsRequest): Promise<ProductsListResponse> {
    const { page = 1, limit = 20, category, tag, search, sort } = request ?? {};

    const where: Prisma.ProductWhereInput = {};
    if (category?.length) {
      where.categories = { some: { category: { slug: { in: category } } } };
    }
    if (tag) {
      where.tags = {
        some: { tag: { slug: { in: tag } } },
      };
    }
    if (search) {
      const rows = await this.productRepo.findByName(search);
      const ids = rows.map((r) => r.id);
      if (ids.length === 0) {
        return {
          data: [],
          pagination: { total: 0, page, limit, totalPages: 0 },
        };
      }
      where.id = { in: ids };
    }

    const [products, total] = await Promise.all([
      this.productRepo.findMany({
        where,
        orderBy: getOrderBy(sort),
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.productRepo.count(where),
    ]);

    return {
      data: products.map((p) => ({ ...p, tags: p.tags.map((t) => t.tag) })),
      pagination: { limit, page, total, totalPages: Math.ceil(total / limit) },
    };
  }

  // async getBySlug(slug: string, userId?: string): Promise<ProductDetailDTO> {
  //   const product = await this.productRepo.findBySlug(slug, userId);
  //   if (!product) {
  //     throw new NotFoundError("PRODUCT_NOT_FOUND");
  //   }
  //   const { loves, tags, variants, starRating, ...p } = product;
  //   return {
  //     ...p,
  //     isLoved: loves.length > 0,
  //     starRating: Number(starRating),
  //     tags: tags.map((pt) => pt.tag),
  //     variants: variants.map(({ price, ...v }) => ({
  //       price: Number(price),
  //       ...v,
  //     })),
  //   };
  // }
}

export function getOrderBy(
  sort?: Sort,
): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "bestseller":
      return { soldCount: "desc" };
    case "newest":
    default:
      return { createdAt: "desc" };
  }
}
