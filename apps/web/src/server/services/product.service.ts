import { ProductRepository } from '../repositories/product.repository';
import { NotFoundError } from '../error';
import type {
  ProductDetailDTO,
  ProductListDTO,
  ProductListParams,
} from '@nguyenthanhduyofficial/schemas';

export class ProductService {
  constructor(private readonly productRepo: ProductRepository) {}
  async getList(params: ProductListParams): Promise<ProductListDTO> {
    const { page = 1, limit = 20 } = params ?? {};
    const { data, total } = await this.productRepo.findMany(params);

    return {
      data: data.map(({ tags, variants, ...p }) => ({
        ...p,
        tags: tags.map((pt) => pt.tag),
        variants: variants.map(({ price, ...v }) => ({
          price: Number(price),
          ...v,
        })),
      })),
      pagination: {
        page: page,
        limit: limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getBySlug(slug: string, userId?: string): Promise<ProductDetailDTO> {
    const product = await this.productRepo.findBySlug(slug, userId);
    if (!product) {
      throw new NotFoundError('PRODUCT_NOT_FOUND');
    }
    const { loves, tags, variants, starRating, ...p } = product;
    return {
      ...p,
      isLoved: loves.length > 0,
      starRating: Number(starRating),
      tags: tags.map((pt) => pt.tag),
      variants: variants.map(({ price, ...v }) => ({
        price: Number(price),
        ...v,
      })),
    };
  }
}
