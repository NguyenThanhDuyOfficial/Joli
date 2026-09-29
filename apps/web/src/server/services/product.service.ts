import 'server-only';
import { productRepository } from '../repositories/product.repository';
import { NotFoundError } from '../error';
import type {
  ProductListParams,
  ProductListResponse,
  ProductResponse,
} from '@nguyenthanhduyofficial/schemas';

export class ProductService {
  async getList(
    params: ProductListParams,
    userId?: string | null,
  ): Promise<ProductListResponse> {
    return productRepository.findMany(params, userId);
  }

  async getBySlug(
    slug: string,
    userId?: string | null,
  ): Promise<ProductResponse> {
    const product = await productRepository.findBySlug(slug, userId);
    if (!product) {
      throw new NotFoundError(
        'PRODUCT_NOT_FOUND',
        `Không tìm thấy sản phẩm "${slug}"`,
      );
    }
    return product;
  }
}

export const productService = new ProductService();
