import { beforeEach, describe, expect, it, vi } from "vitest";
import { OrderService } from "../order.service";
import { CreateOrderParams } from "@nguyenthanhduyofficial/schemas";
import { NotFoundError } from "../../error";

const mockRepo = {
  create: vi.fn(),
  findMany: vi.fn(),
  findById: vi.fn(),
  createCheckoutSession: vi.fn(),
};

const mockProduct = {
  findMany: vi.fn(),
  findBySlug: vi.fn(),
  findVariantsByIds: vi.fn(),
};

const validCreateParams: CreateOrderParams = {
  userId: "u1",
  code: "ORD-001",
  subtotal: 100_000,
  total: 100_000,
  paymentMethod: "cod",
  items: [
    {
      productId: "p1",
      variantId: "v1",
      name: "Áo thun",
      imageUrl: "https://img.jpg",
      price: 100_000,
      quantity: 1,
      subtotal: 100_000,
    },
  ],
};
const mockOrderResult = {
  id: "o1",
  code: "ORD-001",
  status: "pending" as const,
  subtotal: 100_000,
  shippingFee: 30_000,
  total: 130_000,
  paymentMethod: "cod" as const,
  paymentStatus: "unpaid" as const,
  items: [
    {
      id: "i1",
      productId: "p1",
      variantId: "v1",
      name: "Áo thun",
      imageUrl: "https://img.jpg",
      price: 100_000,
      quantity: 1,
      subtotal: 100_000,
    },
  ],
  shipping: {
    id: "s1",
    name: "Ken",
    phone: "0901234567",
    address: "123 Lê Lợi",
    note: null,
  },
};

const mockVariant = {
  id: "v1",
  productId: "p1",
  price: 250000,
  stock: 10,
};
const validParams = {
  userId: "u1",
  items: [
    {
      productId: "p1",
      variantId: "v1",
      quantity: 2,
    },
  ],
};
describe("OrderService", () => {
  let service: OrderService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new OrderService(mockRepo, mockProduct);
  });
  describe("OrderService.create", () => {
    it("creates order and returns DTO", async () => {
      mockRepo.create = vi.fn().mockResolvedValue(mockOrderResult);

      const result = await service.create(validCreateParams);

      expect(result.id).toBe("o1");
      expect(result.code).toBe("ORD-001");
    });

    it("passes params to repository", async () => {
      mockRepo.create = vi.fn().mockResolvedValue(mockOrderResult);

      await service.create(validCreateParams);

      expect(mockRepo.create).toHaveBeenCalledWith(validCreateParams);
    });
  });
  describe("OrderService.getList", () => {
    it("returns list with pagination", async () => {
      mockRepo.findMany = vi.fn().mockResolvedValue({
        data: [mockOrderResult],
        total: 1,
      });

      const result = await service.getList({ userId: "u1" });

      expect(result.data).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
    });

    it("calculates totalPages correctly", async () => {
      mockRepo.findMany = vi.fn().mockResolvedValue({
        data: [],
        total: 101,
      });

      const result = await service.getList({
        userId: "u1",
        page: 1,
        limit: 20,
      });

      expect(result.pagination.totalPages).toBe(6);
    });

    it("passes params to repository", async () => {
      mockRepo.findMany = vi.fn().mockResolvedValue({ data: [], total: 0 });

      const params = { userId: "u1", page: 2, limit: 10 };
      await service.getList(params);

      expect(mockRepo.findMany).toHaveBeenCalledWith(params);
    });
  });
  describe("OrderService.getById", () => {
    it("returns order by id", async () => {
      mockRepo.findById = vi.fn().mockResolvedValue(mockOrderResult);

      const result = await service.getById("o1");

      expect(result.id).toBe("o1");
    });

    it("throws NotFoundError when not found", async () => {
      mockRepo.findById = vi.fn().mockResolvedValue(null);

      await expect(service.getById("ghost")).rejects.toThrow(NotFoundError);
    });

    it("handles null shipping", async () => {
      mockRepo.findById = vi.fn().mockResolvedValue({
        ...mockOrderResult,
        shipping: null,
      });

      const result = await service.getById("o1");

      expect(result.shipping).toBeNull();
    });

    it("passes id to repository", async () => {
      mockRepo.findById = vi.fn().mockResolvedValue(mockOrderResult);

      await service.getById("o1");

      expect(mockRepo.findById).toHaveBeenCalledWith("o1");
    });
  });
  describe("OrderService.createCheckoutSession", () => {
    it("creates session with 1 item successfully", async () => {
      vi.mocked(mockProduct.findVariantsByIds).mockResolvedValue([mockVariant]);
      vi.mocked(mockRepo.createCheckoutSession).mockResolvedValue({
        id: "session_001",
        userId: "u1",
        subTotal: 500000,
        items: [],
      });
      const result = await service.createCheckoutSession(validParams);
      expect(result).toBeDefined();
      expect(mockRepo.createCheckoutSession).toHaveBeenCalledOnce();
    });

    it("passes correct data to repo", async () => {
      vi.mocked(mockProduct.findVariantsByIds).mockResolvedValue([mockVariant]);
      vi.mocked(mockRepo.createCheckoutSession).mockResolvedValue({
        id: "session_001",
        userId: "u1",
        subTotal: 500000,
        items: [],
      });

      await service.createCheckoutSession(validParams);

      const callArg = vi.mocked(mockRepo.createCheckoutSession).mock
        .calls[0]![0];
      expect(callArg.userId).toBe("u1");
      expect(callArg.subTotal).toBe(500000);
      expect(callArg.items).toHaveLength(1);
      expect(callArg.items[0]).toEqual({
        productId: "p1",
        variantId: "v1",
        quantity: 2,
        unitPrice: 250000,
        subTotal: 500000,
      });
    });

    it("looks up variants by ids with 1 query", async () => {
      vi.mocked(mockProduct.findVariantsByIds).mockResolvedValue([mockVariant]);
      vi.mocked(mockRepo.createCheckoutSession).mockResolvedValue({
        id: "session_001",
        userId: "u1",
        subTotal: 500000,
        items: [],
      });

      await service.createCheckoutSession(validParams);

      expect(mockProduct.findVariantsByIds).toHaveBeenCalledOnce();
      expect(mockProduct.findVariantsByIds).toHaveBeenCalledWith(["v1"]);
    });

    it("computes subTotal as sum of item subTotals", async () => {
      vi.mocked(mockProduct.findVariantsByIds).mockResolvedValue([
        { ...mockVariant, id: "v1", price: 100000, stock: 10 },
        { ...mockVariant, id: "v2", price: 200000, stock: 10 },
      ]);
      vi.mocked(mockRepo.createCheckoutSession).mockResolvedValue({
        id: "session_001",
        userId: "u1",
        subTotal: 800000,
        items: [],
      });

      const params = {
        userId: "u1",
        items: [
          { productId: "p1", variantId: "v1", quantity: 2 },
          { productId: "p1", variantId: "v2", quantity: 3 },
        ],
      };

      await service.createCheckoutSession(params);

      const callArg = vi.mocked(mockRepo.createCheckoutSession).mock
        .calls[0]![0];
      expect(callArg.subTotal).toBe(800000);
    });

    it("sets expiresAt about 15 minutes from now", async () => {
      vi.mocked(mockProduct.findVariantsByIds).mockResolvedValue([mockVariant]);
      vi.mocked(mockRepo.createCheckoutSession).mockResolvedValue({
        id: "session_001",
        userId: "u1",
        subTotal: 500000,
        items: [],
      });

      const before = Date.now();
      await service.createCheckoutSession(validParams);
      const after = Date.now();

      const callArg = vi.mocked(mockRepo.createCheckoutSession).mock
        .calls[0]![0];
      const expiresAtMs = callArg.expiresAt.getTime();

      expect(expiresAtMs).toBeGreaterThanOrEqual(before + 15 * 60 * 1000);
      expect(expiresAtMs).toBeLessThanOrEqual(after + 15 * 60 * 1000);
    });

    it("throws EMPTY_ITEMS when items is empty", async () => {
      await expect(
        service.createCheckoutSession({ userId: "u1", items: [] }),
      ).rejects.toMatchObject({ code: "EMPTY_ITEMS" });
    });

    it("throws TOO_MANY_ITEMS when items > 50", async () => {
      const manyItems = Array.from({ length: 51 }, (_, i) => ({
        productId: "p1",
        variantId: `v${i}`,
        quantity: 1,
      }));

      await expect(
        service.createCheckoutSession({ userId: "u1", items: manyItems }),
      ).rejects.toMatchObject({ code: "TOO_MANY_ITEMS" });
    });

    it("does not throw when exactly 50 items", async () => {
      const fiftyItems = Array.from({ length: 50 }, (_, i) => ({
        productId: "p1",
        variantId: `v${i}`,
        quantity: 1,
      }));

      vi.mocked(mockProduct.findVariantsByIds).mockResolvedValue(
        fiftyItems.map((item) => ({
          ...mockVariant,
          id: item.variantId,
          stock: 10,
        })),
      );
      vi.mocked(mockRepo.createCheckoutSession).mockResolvedValue({
        id: "session_001",
        userId: "u1",
        subTotal: 0,
        items: [],
      });

      await expect(
        service.createCheckoutSession({ userId: "u1", items: fiftyItems }),
      ).resolves.toBeDefined();
    });

    it("throws VARIANT_NOT_FOUND when variant does not exist", async () => {
      vi.mocked(mockProduct.findVariantsByIds).mockResolvedValue([]);

      await expect(
        service.createCheckoutSession(validParams),
      ).rejects.toMatchObject({ code: "VARIANT_NOT_FOUND" });
    });

    it("throws VARIANT_NOT_FOUND when some variants missing", async () => {
      vi.mocked(mockProduct.findVariantsByIds).mockResolvedValue([mockVariant]);

      const params = {
        userId: "u1",
        items: [
          { productId: "p1", variantId: "v1", quantity: 1 },
          { productId: "p1", variantId: "v_missing", quantity: 1 },
        ],
      };

      await expect(service.createCheckoutSession(params)).rejects.toMatchObject(
        { code: "VARIANT_NOT_FOUND" },
      );
    });

    it("does not call repo when variant not found", async () => {
      vi.mocked(mockProduct.findVariantsByIds).mockResolvedValue([]);

      await expect(
        service.createCheckoutSession(validParams),
      ).rejects.toThrow();

      expect(mockRepo.createCheckoutSession).not.toHaveBeenCalled();
    });

    it("throws OUT_OF_STOCK when stock < quantity", async () => {
      vi.mocked(mockProduct.findVariantsByIds).mockResolvedValue([
        { ...mockVariant, stock: 1 },
      ]);

      const params = {
        userId: "u1",
        items: [{ productId: "p1", variantId: "v1", quantity: 5 }],
      };

      await expect(service.createCheckoutSession(params)).rejects.toMatchObject(
        { code: "OUT_OF_STOCK" },
      );
    });

    it("does not throw when stock equals quantity", async () => {
      vi.mocked(mockProduct.findVariantsByIds).mockResolvedValue([
        { ...mockVariant, stock: 2 },
      ]);
      vi.mocked(mockRepo.createCheckoutSession).mockResolvedValue({
        id: "session_001",
        userId: "u1",
        subTotal: 500000,
        items: [],
      });

      const params = {
        userId: "u1",
        items: [{ productId: "p1", variantId: "v1", quantity: 2 }],
      };

      await expect(
        service.createCheckoutSession(params),
      ).resolves.toBeDefined();
    });

    it("throws OUT_OF_STOCK when stock is 0", async () => {
      vi.mocked(mockProduct.findVariantsByIds).mockResolvedValue([
        { ...mockVariant, stock: 0 },
      ]);

      await expect(
        service.createCheckoutSession(validParams),
      ).rejects.toMatchObject({ code: "OUT_OF_STOCK" });
    });

    it("throws PRODUCT_VARIANT_MISMATCH when productId does not match", async () => {
      vi.mocked(mockProduct.findVariantsByIds).mockResolvedValue([
        { ...mockVariant, productId: "different_product" },
      ]);

      await expect(
        service.createCheckoutSession(validParams),
      ).rejects.toMatchObject({ code: "PRODUCT_VARIANT_MISMATCH" });
    });

    it("handles quantity equal 1", async () => {
      vi.mocked(mockProduct.findVariantsByIds).mockResolvedValue([mockVariant]);
      vi.mocked(mockRepo.createCheckoutSession).mockResolvedValue({
        id: "session_001",
        userId: "u1",
        subTotal: 250000,
        items: [],
      });

      const params = {
        userId: "u1",
        items: [{ productId: "p1", variantId: "v1", quantity: 1 }],
      };

      await service.createCheckoutSession(params);

      const callArg = vi.mocked(mockRepo.createCheckoutSession).mock
        .calls[0]![0];
      expect(callArg.subTotal).toBe(250000);
      expect(callArg.items[0].quantity).toBe(1);
    });

    it("handles price equal 0", async () => {
      vi.mocked(mockProduct.findVariantsByIds).mockResolvedValue([
        { ...mockVariant, price: 0 },
      ]);
      vi.mocked(mockRepo.createCheckoutSession).mockResolvedValue({
        id: "session_001",
        userId: "u1",
        subTotal: 0,
        items: [],
      });

      await service.createCheckoutSession(validParams);

      const callArg = vi.mocked(mockRepo.createCheckoutSession).mock
        .calls[0]![0];
      expect(callArg.subTotal).toBe(0);
      expect(callArg.items[0].unitPrice).toBe(0);
    });

    it("handles large amount VND", async () => {
      const largePrice = 999_999_999;
      vi.mocked(mockProduct.findVariantsByIds).mockResolvedValue([
        { ...mockVariant, price: largePrice, stock: 10 },
      ]);
      vi.mocked(mockRepo.createCheckoutSession).mockResolvedValue({
        id: "session_001",
        userId: "u1",
        subTotal: largePrice,
        items: [],
      });

      const params = {
        userId: "u1",
        items: [{ productId: "p1", variantId: "v1", quantity: 1 }],
      };

      await service.createCheckoutSession(params);

      const callArg = vi.mocked(mockRepo.createCheckoutSession).mock
        .calls[0]![0];
      expect(callArg.subTotal).toBe(largePrice);
    });

    it("handles large quantity", async () => {
      vi.mocked(mockProduct.findVariantsByIds).mockResolvedValue([
        { ...mockVariant, stock: 1000 },
      ]);
      vi.mocked(mockRepo.createCheckoutSession).mockResolvedValue({
        id: "session_001",
        userId: "u1",
        subTotal: 250000 * 1000,
        items: [],
      });

      const params = {
        userId: "u1",
        items: [{ productId: "p1", variantId: "v1", quantity: 1000 }],
      };

      await service.createCheckoutSession(params);

      const callArg = vi.mocked(mockRepo.createCheckoutSession).mock
        .calls[0]![0];
      expect(callArg.subTotal).toBe(250000 * 1000);
    });

    it("handles duplicate variantId", async () => {
      vi.mocked(mockProduct.findVariantsByIds).mockResolvedValue([mockVariant]);
      vi.mocked(mockRepo.createCheckoutSession).mockResolvedValue({
        id: "session_001",
        userId: "u1",
        subTotal: 750000,
        items: [],
      });

      const params = {
        userId: "u1",
        items: [
          { productId: "p1", variantId: "v1", quantity: 1 },
          { productId: "p1", variantId: "v1", quantity: 2 },
        ],
      };

      await service.createCheckoutSession(params);

      const callArg = vi.mocked(mockRepo.createCheckoutSession).mock
        .calls[0]![0];
      expect(callArg.items).toHaveLength(2);
    });

    it("does not mutate input params", async () => {
      vi.mocked(mockProduct.findVariantsByIds).mockResolvedValue([mockVariant]);
      vi.mocked(mockRepo.createCheckoutSession).mockResolvedValue({
        id: "session_001",
        userId: "u1",
        subTotal: 500000,
        items: [],
      });

      const params = {
        userId: "u1",
        items: [{ productId: "p1", variantId: "v1", quantity: 2 }],
      };
      const snapshot = JSON.parse(JSON.stringify(params));

      await service.createCheckoutSession(params);

      expect(params).toEqual(snapshot);
    });
  });
});
