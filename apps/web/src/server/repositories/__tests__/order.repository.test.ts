import {
  createTestProduct,
  createTestShipping,
  createTestUser,
  createTestVariants,
} from './helpers';
import { OrderRepository } from '../order.repository';
import { expect, describe, it } from 'vitest';

const repo = new OrderRepository();

describe('OrderRepository', () => {
  describe('OrderRepository.create', () => {
    it('creates order with items', async () => {
      const user = await createTestUser();
      const shipping = await createTestShipping();
      const product = await createTestProduct();

      const order = await repo.create({
        userId: user.id,
        shippingId: shipping.id,
        code: 'ORD-TEST-001',
        subtotal: 200_000,
        total: 230_000,
        paymentMethod: 'cod',
        items: [
          {
            productId: product.id,
            name: 'Áo thun',
            price: 100_000,
            quantity: 2,
            subtotal: 200_000,
          },
        ],
      });

      expect(order.id).toBeDefined();
      expect(order.code).toBe('ORD-TEST-001');
      expect(order.items).toHaveLength(1);
      expect(order.user?.id).toBe(user.id);
    });
    it('creates order without shipping', async () => {
      const product = await createTestProduct();

      const order = await repo.create({
        code: 'ORD-NOSHIP-001',
        subtotal: 100_000,
        total: 100_000,
        paymentMethod: 'cod',
        items: [
          {
            productId: product.id,
            name: 'X',
            price: 100_000,
            quantity: 1,
            subtotal: 100_000,
          },
        ],
      });

      expect(order.shipping).toBeNull();
    });
    it('creates order with multiple items', async () => {
      const p1 = await createTestProduct({ slug: 'p1' });
      const p2 = await createTestProduct({ slug: 'p2' });
      const p3 = await createTestProduct({ slug: 'p3' });

      const order = await repo.create({
        code: 'ORD-MULTI-001',
        subtotal: 600_000,
        total: 600_000,
        paymentMethod: 'cod',
        items: [
          {
            productId: p1.id,
            name: 'A',
            price: 100_000,
            quantity: 1,
            subtotal: 100_000,
          },
          {
            productId: p2.id,
            name: 'B',
            price: 200_000,
            quantity: 1,
            subtotal: 200_000,
          },
          {
            productId: p3.id,
            name: 'C',
            price: 300_000,
            quantity: 1,
            subtotal: 300_000,
          },
        ],
      });

      expect(order.items).toHaveLength(3);
    });
    it('creates order with variantId', async () => {
      const product = await createTestProduct();
      const variant = await createTestVariants(product.id);

      const order = await repo.create({
        code: 'ORD-VAR-001',
        subtotal: 100_000,
        total: 100_000,
        paymentMethod: 'cod',
        items: [
          {
            productId: product.id,
            variantId: variant.id,
            name: 'Áo thun',
            price: 100_000,
            quantity: 1,
            subtotal: 100_000,
          },
        ],
      });

      expect(order.items[0].variantId).toBe(variant.id);
    });
    it('throws on duplicate code', async () => {
      const product = await createTestProduct();

      await repo.create({
        code: 'ORD-DUP-001',
        subtotal: 100_000,
        total: 100_000,
        paymentMethod: 'cod',
        items: [
          {
            productId: product.id,
            name: 'A',
            price: 100_000,
            quantity: 1,
            subtotal: 100_000,
          },
        ],
      });

      await expect(
        repo.create({
          code: 'ORD-DUP-001', // ← trùng
          subtotal: 100_000,
          total: 100_000,
          paymentMethod: 'cod',
          items: [
            {
              productId: product.id,
              name: 'A',
              price: 100_000,
              quantity: 1,
              subtotal: 100_000,
            },
          ],
        }),
      ).rejects.toThrow();
    });
  });
  describe('OrderRepository.findMany', () => {
    it('returns orders of user', async () => {
      const user = await createTestUser();
      const product = await createTestProduct();

      await repo.create({
        userId: user.id,
        code: 'ORD-1',
        subtotal: 100_000,
        total: 100_000,
        paymentMethod: 'cod',
        items: [
          {
            productId: product.id,
            name: 'A',
            price: 100_000,
            quantity: 1,
            subtotal: 100_000,
          },
        ],
      });
      await repo.create({
        userId: user.id,
        code: 'ORD-2',
        subtotal: 200_000,
        total: 200_000,
        paymentMethod: 'cod',
        items: [
          {
            productId: product.id,
            name: 'B',
            price: 200_000,
            quantity: 1,
            subtotal: 200_000,
          },
        ],
      });

      const orders = await repo.findMany(user.id);

      expect(orders).toHaveLength(2);
    });
    it('returns empty array when user has no orders', async () => {
      const user = await createTestUser();

      const orders = await repo.findMany(user.id);

      expect(orders).toEqual([]);
    });
    it('does not return orders of other users', async () => {
      const userA = await createTestUser();
      const userB = await createTestUser();
      const product = await createTestProduct();

      await repo.create({
        userId: userA.id,
        code: 'ORD-A',
        subtotal: 100_000,
        total: 100_000,
        paymentMethod: 'cod',
        items: [
          {
            productId: product.id,
            name: 'A',
            price: 100_000,
            quantity: 1,
            subtotal: 100_000,
          },
        ],
      });
      await repo.create({
        userId: userB.id,
        code: 'ORD-B',
        subtotal: 100_000,
        total: 100_000,
        paymentMethod: 'cod',
        items: [
          {
            productId: product.id,
            name: 'B',
            price: 100_000,
            quantity: 1,
            subtotal: 100_000,
          },
        ],
      });

      const orders = await repo.findMany(userA.id);

      expect(orders).toHaveLength(1);
      expect(orders[0].code).toBe('ORD-A');
    });
    it('includes items, shipping, user', async () => {
      const user = await createTestUser();
      const shipping = await createTestShipping();
      const product = await createTestProduct();

      await repo.create({
        userId: user.id,
        shippingId: shipping.id,
        code: 'ORD-INC-001',
        subtotal: 100_000,
        total: 100_000,
        paymentMethod: 'cod',
        items: [
          {
            productId: product.id,
            name: 'A',
            price: 100_000,
            quantity: 1,
            subtotal: 100_000,
          },
        ],
      });

      const orders = await repo.findMany(user.id);

      expect(orders[0].items).toHaveLength(1);
      expect(orders[0].shipping).toBeDefined();
      expect(orders[0].user?.id).toBe(user.id);
    });
  });
  describe('OrderRepository.findById', () => {
    it('returns order by id', async () => {
      const product = await createTestProduct();
      const created = await repo.create({
        code: 'ORD-FIND-001',
        subtotal: 100_000,
        total: 100_000,
        paymentMethod: 'cod',
        items: [
          {
            productId: product.id,
            name: 'A',
            price: 100_000,
            quantity: 1,
            subtotal: 100_000,
          },
        ],
      });

      const order = await repo.findById(created.id);

      expect(order?.id).toBe(created.id);
      expect(order?.code).toBe('ORD-FIND-001');
    });
    it('returns null when id does not exist', async () => {
      const order = await repo.findById('khong-ton-tai');
      expect(order).toBeNull();
    });
    it('includes items, shipping, user', async () => {
      const user = await createTestUser();
      const shipping = await createTestShipping();
      const product = await createTestProduct();

      const created = await repo.create({
        userId: user.id,
        shippingId: shipping.id,
        code: 'ORD-DETAIL-001',
        subtotal: 100_000,
        total: 100_000,
        paymentMethod: 'cod',
        items: [
          {
            productId: product.id,
            name: 'A',
            price: 100_000,
            quantity: 1,
            subtotal: 100_000,
          },
        ],
      });

      const order = await repo.findById(created.id);

      expect(order?.items).toHaveLength(1);
      expect(order?.shipping?.phone).toBeDefined();
      expect(order?.user?.id).toBe(user.id);
    });
  });
});
