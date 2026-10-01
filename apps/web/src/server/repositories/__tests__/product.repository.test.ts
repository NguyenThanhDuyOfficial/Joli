import { describe, expect, it } from 'vitest';
import { getOrderBy, ProductRepository } from '../product.repository';
import {
  createTestCategory,
  createTestImage,
  createTestOrder,
  createTestOrderItem,
  createTestProduct,
  createTestProductLove,
  createTestTag,
  createTestUser,
  createTestVariant,
} from './helpers';

const repo = new ProductRepository();

describe('ProductRepository', () => {
  describe('ProductRepository.findMany', () => {
    it('return all products', async () => {
      await createTestProduct();
      await createTestProduct();

      const result = await repo.findMany();
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('filters by category slug', async () => {
      const product = await createTestProduct();
      await createTestCategory('candle', product.id);

      const result = await repo.findMany({
        category: ['candle'],
      });
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('filters by tag slug', async () => {
      const product = await createTestProduct();
      await createTestTag('sale', product.id);

      const result = await repo.findMany({ tag: ['sale'] });

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('filters by search', async () => {
      await createTestProduct({ name: 'Scented Candle' });
      await createTestProduct({ name: 'Soap Bar' });

      const result = await repo.findMany({ search: 'candle' });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('Scented Candle');
      expect(result.total).toBe(1);
    });

    it('returns empty when search matches nothing', async () => {
      await createTestProduct({ name: 'Scented Candle' });

      const result = await repo.findMany({ search: 'xyzabc123' });

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });
    it('paginates without overlap', async () => {
      for (let i = 0; i < 25; i++) {
        await createTestProduct();
      }

      const page1 = await repo.findMany({ page: 1, limit: 10 });
      const page2 = await repo.findMany({ page: 2, limit: 10 });

      expect(page1.data).toHaveLength(10);
      expect(page2.data).toHaveLength(10);
      expect(page1.total).toBe(25);

      const ids1 = page1.data.map((p) => p.id);
      const ids2 = page2.data.map((p) => p.id);
      expect(ids1.filter((id) => ids2.includes(id))).toHaveLength(0);
    });

    it('returns empty page when skip exceeds total', async () => {
      await createTestProduct();

      const result = await repo.findMany({ page: 99, limit: 20 });

      expect(result.data).toEqual([]);
      expect(result.total).toBe(1);
    });

    it('includes only active variants with images', async () => {
      const product = await createTestProduct();
      await createTestVariant(product.id, undefined, undefined, false);
      const product2 = await createTestProduct();
      await createTestVariant(product2.id);

      const result = await repo.findMany();

      expect(result.data[0].variants).toHaveLength(1);
    });

    it('sorts bestsellers by orderItems count desc', async () => {
      const user = await createTestUser();
      await createTestProduct();
      const p2 = await createTestProduct({ slug: 'p2' });
      const variant2 = await createTestVariant(p2.id);
      const image2 = await createTestImage(variant2.id);
      const order = await createTestOrder(user.id);
      await createTestOrderItem(
        variant2.id,
        order.id,
        p2.id,
        100,
        1,
        100,
        p2.name,
        image2.url,
      );
      await createTestOrderItem(
        variant2.id,
        order.id,
        p2.id,
        100,
        1,
        100,
        p2.name,
        image2.url,
      );

      const result = await repo.findMany({ sort: 'bestsellers' });

      expect(result.data[0].slug).toBe('p2');
    });
  });

  describe('getOrderBy', () => {
    it('returns bestsellers order', () => {
      expect(getOrderBy('bestsellers')).toEqual({
        orderItems: { _count: 'desc' },
      });
    });

    it('returns newest order', () => {
      expect(getOrderBy('newest')).toEqual({ createdAt: 'desc' });
    });

    it('falls back to createdAt desc for unknown sort', () => {
      // @ts-expect-error — intentionally passing invalid value
      expect(getOrderBy('hacked')).toEqual({ createdAt: 'desc' });
      expect(getOrderBy(undefined)).toEqual({ createdAt: 'desc' });
    });
  });

  describe('ProductRepository.findBySlug', () => {
    it('returns product with relations', async () => {
      const product = await createTestProduct({ slug: 'scented-candle' });
      await createTestTag('sale', product.id);
      await createTestVariant(product.id);

      const result = await repo.findBySlug('scented-candle');

      expect(result).not.toBeNull();
      expect(result?.variants).toHaveLength(1);
      expect(result?.tags).toHaveLength(1);
    });
    it('returns null when slug does not exist', async () => {
      const result = await repo.findBySlug('ghost');
      expect(result).toBeNull();
    });
    it('returns product with variants', async () => {
      const p = await createTestProduct({
        slug: 'ao-thun',
      });
      for (let i = 0; i < 3; i++) {
        await createTestVariant(p.id);
      }

      const result = await repo.findBySlug('ao-thun');

      expect(result?.variants).toHaveLength(3);
      expect(result?.variants[0]).toHaveProperty('price');
      expect(result?.variants[0]).toHaveProperty('stock');
    });
    it('returns empty loves when userId is not provided', async () => {
      await createTestProduct({ slug: 'ao-thun' });

      const result = await repo.findBySlug('ao-thun');

      expect(result?.loves).toEqual([]);
    });
    it('returns empty loves when user has not loved', async () => {
      const user = await createTestUser();
      await createTestProduct({ slug: 'ao-thun' });

      const result = await repo.findBySlug('ao-thun', user.id);

      expect(result?.loves).toEqual([]);
    });
    it('returns loves array with userId when user loved the product', async () => {
      const user = await createTestUser();
      const product = await createTestProduct({ slug: 'ao-thun' });

      await createTestProductLove(user.id, product.id);

      const result = await repo.findBySlug('ao-thun', user.id);

      expect(result?.loves).toHaveLength(1);
      expect(result?.loves[0].userId).toBe(user.id);
    });
  });
});
