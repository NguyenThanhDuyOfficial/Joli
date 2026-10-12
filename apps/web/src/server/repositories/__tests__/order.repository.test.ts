import {
  createTestImage,
  createTestProduct,
  createTestShipping,
  createTestUser,
  createTestVariant,
  createUnique,
} from "./helpers";
import { OrderRepository } from "../order.repository";
import { expect, describe, it } from "vitest";

const repo = new OrderRepository();

describe("OrderRepository", () => {
  describe("OrderRepository.create", () => {
    it("creates order with items", async () => {
      const shipping = await createTestShipping();
      const product = await createTestProduct();
      const user = await createTestUser();
      const variant = await createTestVariant(product.id);
      const image = await createTestImage(variant.id);

      const order = await repo.create({
        userId: user.id,
        shippingId: shipping.id,
        code: "ORD-TEST-001",
        subtotal: 200_000,
        total: 230_000,
        paymentMethod: "cod",
        items: [
          {
            imageUrl: image.url,
            variantId: variant.id,
            productId: product.id,
            name: "Áo thun",
            price: 100_000,
            quantity: 2,
            subtotal: 200_000,
          },
        ],
      });

      expect(order.id).toBeDefined();
      expect(order.code).toBe("ORD-TEST-001");
      expect(order.items).toHaveLength(1);
      expect(order.user?.id).toBe(user.id);
    });
    it("creates order without shipping", async () => {
      const product = await createTestProduct();
      const user = await createTestUser();
      const variant = await createTestVariant(product.id);
      const image = await createTestImage(variant.id);

      const order = await repo.create({
        userId: user.id,
        code: "ORD-NOSHIP-001",
        subtotal: 100_000,
        total: 100_000,
        paymentMethod: "cod",
        items: [
          {
            imageUrl: image.url,
            variantId: variant.id,
            productId: product.id,
            name: "X",
            price: 100_000,
            quantity: 1,
            subtotal: 100_000,
          },
        ],
      });

      expect(order.shipping).toBeNull();
    });
    it("creates order with multiple items", async () => {
      const p1 = await createTestProduct({ slug: "p1" });
      const p2 = await createTestProduct({ slug: "p2" });
      const p3 = await createTestProduct({ slug: "p3" });

      const user = await createTestUser();
      const variant1 = await createTestVariant(p1.id);
      const variant2 = await createTestVariant(p2.id);
      const variant3 = await createTestVariant(p3.id);
      const image = await createTestImage(variant1.id);

      const order = await repo.create({
        userId: user.id,
        code: "ORD-MULTI-001",
        subtotal: 600_000,
        total: 600_000,
        paymentMethod: "cod",
        items: [
          {
            imageUrl: image.url,
            variantId: variant1.id,
            productId: p1.id,
            name: "A",
            price: 100_000,
            quantity: 1,
            subtotal: 100_000,
          },
          {
            imageUrl: image.url,
            variantId: variant2.id,
            productId: p2.id,
            name: "B",
            price: 200_000,
            quantity: 1,
            subtotal: 200_000,
          },
          {
            imageUrl: image.url,
            variantId: variant3.id,
            productId: p3.id,
            name: "C",
            price: 300_000,
            quantity: 1,
            subtotal: 300_000,
          },
        ],
      });

      expect(order.items).toHaveLength(3);
    });
    it("creates order with variantId", async () => {
      const product = await createTestProduct();
      const variant = await createTestVariant(product.id);

      const user = await createTestUser();
      const image = await createTestImage(variant.id);

      const order = await repo.create({
        userId: user.id,
        code: "ORD-VAR-001",
        subtotal: 100_000,
        total: 100_000,
        paymentMethod: "cod",
        items: [
          {
            imageUrl: image.url,
            variantId: variant.id,
            productId: product.id,
            name: "Áo thun",
            price: 100_000,
            quantity: 1,
            subtotal: 100_000,
          },
        ],
      });

      expect(order.items[0]?.variantId).toBe(variant.id);
    });
    it("throws on duplicate code", async () => {
      const product = await createTestProduct();

      const user = await createTestUser();
      const variant = await createTestVariant(product.id);
      const image = await createTestImage(variant.id);

      await repo.create({
        userId: user.id,
        code: "ORD-DUP-001",
        subtotal: 100_000,
        total: 100_000,
        paymentMethod: "cod",
        items: [
          {
            imageUrl: image.url,
            variantId: variant.id,
            productId: product.id,
            name: "A",
            price: 100_000,
            quantity: 1,
            subtotal: 100_000,
          },
        ],
      });

      await expect(
        repo.create({
          userId: user.id,
          code: "ORD-DUP-001",
          subtotal: 100_000,
          total: 100_000,
          paymentMethod: "cod",
          items: [
            {
              imageUrl: image.url,
              variantId: variant.id,
              productId: product.id,
              name: "A",
              price: 100_000,
              quantity: 1,
              subtotal: 100_000,
            },
          ],
        }),
      ).rejects.toThrow();
    });
  });
  describe("OrderRepository.findMany", () => {
    it("returns orders of user", async () => {
      const user = await createTestUser();
      const product = await createTestProduct();

      const variant = await createTestVariant(product.id);
      const image = await createTestImage(variant.id);

      await repo.create({
        userId: user.id,
        code: "ORD-1",
        subtotal: 100_000,
        total: 100_000,
        paymentMethod: "cod",
        items: [
          {
            imageUrl: image.url,
            variantId: variant.id,
            productId: product.id,
            name: "A",
            price: 100_000,
            quantity: 1,
            subtotal: 100_000,
          },
        ],
      });
      await repo.create({
        userId: user.id,
        code: "ORD-2",
        subtotal: 200_000,
        total: 200_000,
        paymentMethod: "cod",
        items: [
          {
            imageUrl: image.url,
            variantId: variant.id,
            productId: product.id,
            name: "B",
            price: 200_000,
            quantity: 1,
            subtotal: 200_000,
          },
        ],
      });

      const orders = await repo.findMany({ userId: user.id });

      expect(orders.data).toHaveLength(2);
    });
    it("returns empty array when user has no orders", async () => {
      const user = await createTestUser();

      const orders = await repo.findMany({ userId: user.id });

      expect(orders.data).toEqual([]);
    });
    it("does not return orders of other users", async () => {
      const userA = await createTestUser();
      const userB = await createTestUser();
      const product = await createTestProduct();

      const variant = await createTestVariant(product.id);
      const image = await createTestImage(variant.id);

      await repo.create({
        userId: userA.id,
        code: "ORD-A",
        subtotal: 100_000,
        total: 100_000,
        paymentMethod: "cod",
        items: [
          {
            imageUrl: image.url,
            variantId: variant.id,
            productId: product.id,
            name: "A",
            price: 100_000,
            quantity: 1,
            subtotal: 100_000,
          },
        ],
      });
      await repo.create({
        userId: userB.id,
        code: "ORD-B",
        subtotal: 100_000,
        total: 100_000,
        paymentMethod: "cod",
        items: [
          {
            imageUrl: image.url,
            variantId: variant.id,
            productId: product.id,
            name: "B",
            price: 100_000,
            quantity: 1,
            subtotal: 100_000,
          },
        ],
      });

      const orders = await repo.findMany({ userId: userA.id });

      expect(orders.data).toHaveLength(1);
      expect(orders.data[0]?.code).toBe("ORD-A");
    });
    it("includes items, shipping, user", async () => {
      const user = await createTestUser();
      const shipping = await createTestShipping();
      const product = await createTestProduct();

      const variant = await createTestVariant(product.id);
      const image = await createTestImage(variant.id);

      await repo.create({
        userId: user.id,
        shippingId: shipping.id,
        code: "ORD-INC-001",
        subtotal: 100_000,
        total: 100_000,
        paymentMethod: "cod",
        items: [
          {
            imageUrl: image.url,
            variantId: variant.id,
            productId: product.id,
            name: "A",
            price: 100_000,
            quantity: 1,
            subtotal: 100_000,
          },
        ],
      });

      const orders = await repo.findMany({ userId: user.id });

      expect(orders.data[0]?.items).toHaveLength(1);
      expect(orders.data[0]?.shipping).toBeDefined();
      expect(orders.data[0]?.user?.id).toBe(user.id);
    });
  });
  describe("OrderRepository.findById", () => {
    it("returns order by id", async () => {
      const product = await createTestProduct();
      const user = await createTestUser();
      const variant = await createTestVariant(product.id);
      const image = await createTestImage(variant.id);
      const created = await repo.create({
        userId: user.id,
        code: "ORD-FIND-001",
        subtotal: 100_000,
        total: 100_000,
        paymentMethod: "cod",
        items: [
          {
            imageUrl: image.url,
            variantId: variant.id,
            productId: product.id,
            name: "A",
            price: 100_000,
            quantity: 1,
            subtotal: 100_000,
          },
        ],
      });

      const order = await repo.findById(created.id);

      expect(order?.id).toBe(created.id);
      expect(order?.code).toBe("ORD-FIND-001");
    });
    it("returns null when id does not exist", async () => {
      const order = await repo.findById("khong-ton-tai");
      expect(order).toBeNull();
    });
    it("includes items, shipping, user", async () => {
      const user = await createTestUser();
      const shipping = await createTestShipping();
      const product = await createTestProduct();
      const variant = await createTestVariant(product.id);
      const image = await createTestImage(variant.id);

      const created = await repo.create({
        userId: user.id,
        shippingId: shipping.id,
        code: "ORD-DETAIL-001",
        subtotal: 100_000,
        total: 100_000,
        paymentMethod: "cod",
        items: [
          {
            imageUrl: image.url,
            variantId: variant.id,
            productId: product.id,
            name: "A",
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
  describe("OrderRepository.createCheckoutSesion", () => {
    const mockSessionId = createUnique("checkoutSession");
    const mockProductId = createUnique("product");
    const mockVariantId = createUnique("variant");

    it("successfully create sesson with 1 item", async () => {
      const user = await createTestUser();
      const validParams = {
        userId: user.id,
        subTotal: 500000,
        expiresAt: "2026-10-12T10:15:00Z",
        items: [
          {
            productId: mockProductId,
            variantId: mockVariantId,
            quantity: 2,
            unitPrice: 250000,
            subTotal: 500000,
          },
        ],
      };
      const session = await repo.createCheckoutSession(validParams);
      expect(session.id).toBeDefined();
      expect(session.userId).toBe(user.id);
      expect(session.items).toHaveLength(1);
    });

    it("successfully create session with multiple items", async () => {
      const user = await createTestUser();
      const params = {
        userId: user.id,
        expiresAt: "2026-10-12T10:15:00Z",
        subTotal: 1_000_000,
        items: [
          {
            productId: mockProductId,
            variantId: mockVariantId,
            quantity: 2,
            unitPrice: 250000,
            subTotal: 500000,
          },
          {
            productId: createUnique("product"),
            variantId: createUnique("variant"),
            quantity: 3,
            unitPrice: 250000,
            subTotal: 750000,
          },
        ],
      };

      const session = await repo.createCheckoutSession(params);

      expect(session.id).toBeDefined();
      expect(session.items).toHaveLength(2);
      expect(session.subTotal).toBe(1_000_000);
    });

    it("persists item fields correctly", async () => {
      const user = await createTestUser();
      const validParams = {
        userId: user.id,
        subTotal: 500000,
        expiresAt: "2026-10-12T10:15:00Z",
        items: [
          {
            productId: mockProductId,
            variantId: mockVariantId,
            quantity: 2,
            unitPrice: 250000,
            subTotal: 500000,
          },
        ],
      };
      const session = await repo.createCheckoutSession(validParams);
      const item = session.items[0];

      expect(item?.productId).toBe(mockProductId);
      expect(item?.variantId).toBe(mockVariantId);
      expect(item?.quantity).toBe(2);
      expect(item?.unitPrice).toBe(250000);
      expect(item?.subTotal).toBe(500000);
    });

    it("returns session with selected fields", async () => {
      const user = await createTestUser();
      const validParams = {
        userId: user.id,
        subTotal: 500000,
        expiresAt: "2026-10-12T10:15:00Z",
        items: [
          {
            productId: mockProductId,
            variantId: mockVariantId,
            quantity: 2,
            unitPrice: 250000,
            subTotal: 500000,
          },
        ],
      };
      const session = await repo.createCheckoutSession(validParams);

      expect(session).toHaveProperty("id");
      expect(session).toHaveProperty("userId");
      expect(session).toHaveProperty("subTotal");
      expect(session).toHaveProperty("items");
    });

    it("throws when userId does not exist (FK violation)", async () => {
      const user = await createTestUser();
      const validParams = {
        userId: user.id,
        subTotal: 500000,
        expiresAt: "2026-10-12T10:15:00Z",
        items: [
          {
            productId: mockProductId,
            variantId: mockVariantId,
            quantity: 2,
            unitPrice: 250000,
            subTotal: 500000,
          },
        ],
      };
      const params = {
        ...validParams,
        userId: createUnique("nonexistent-user"),
      };

      await expect(repo.createCheckoutSession(params)).rejects.toThrow();
    });

    it("handles quantity = 1", async () => {
      const user = await createTestUser();
      const params = {
        userId: user.id,
        expiresAt: "2026-10-12T10:15:00Z",
        subTotal: 250000,
        items: [
          {
            productId: mockProductId,
            variantId: mockVariantId,
            unitPrice: 250000,
            quantity: 1,
            subTotal: 250000,
          },
        ],
      };

      const session = await repo.createCheckoutSession(params);

      expect(session.items[0]?.quantity).toBe(1);
      expect(session.subTotal).toBe(250000);
    });

    it("handles unitPrice = 0 (free product)", async () => {
      const user = await createTestUser();
      const params = {
        userId: user.id,
        expiresAt: "2026-10-12T10:15:00Z",
        subTotal: 0,
        items: [
          {
            productId: mockProductId,
            variantId: mockVariantId,
            quantity: 1,
            unitPrice: 0,
            subTotal: 0,
          },
        ],
      };

      const session = await repo.createCheckoutSession(params);

      expect(session.items[0]?.unitPrice).toBe(0);
      expect(session.subTotal).toBe(0);
    });

    it("handles large amount (VND)", async () => {
      const user = await createTestUser();
      const largeAmount = 999_999_999;
      const params = {
        userId: user.id,
        expiresAt: "2026-10-12T10:15:00Z",
        subTotal: largeAmount,
        items: [
          {
            productId: mockProductId,
            variantId: mockVariantId,
            quantity: 1,
            unitPrice: largeAmount,
            subTotal: largeAmount,
          },
        ],
      };

      const session = await repo.createCheckoutSession(params);

      expect(session.items[0]?.unitPrice).toBe(largeAmount);
      expect(session.subTotal).toBe(largeAmount);
    });

    it("session subTotal matches sum of item subTotals", async () => {
      const user = await createTestUser();
      const params = {
        userId: user.id,
        expiresAt: "2026-10-12T10:15:00Z",
        subTotal: 1_000_000,
        items: [
          {
            productId: mockProductId,
            variantId: mockVariantId,
            quantity: 2,
            subTotal: 500000,
            unitPrice: 250000,
          },
          {
            productId: createUnique("product"),
            variantId: createUnique("variant"),
            quantity: 2,
            unitPrice: 250000,
            subTotal: 500000,
          },
        ],
      };

      const session = await repo.createCheckoutSession(params);
      const sum = session.items.reduce((acc, i) => acc + i.subTotal, 0);

      expect(session.subTotal).toBe(sum);
    });

    it("does not mutate input params", async () => {
      const user = await createTestUser();
      const validParams = {
        userId: user.id,
        subTotal: 500000,
        expiresAt: "2026-10-12T10:15:00Z",
        items: [
          {
            productId: mockProductId,
            variantId: mockVariantId,
            quantity: 2,
            unitPrice: 250000,
            subTotal: 500000,
          },
        ],
      };
      const originalItems = JSON.parse(JSON.stringify(validParams.items));
      const originalSubTotal = validParams.subTotal;

      await repo.createCheckoutSession(validParams);

      expect(validParams.items).toEqual(originalItems);
      expect(validParams.subTotal).toBe(originalSubTotal);
    });
  });
});
