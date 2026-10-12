import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/src/server/auth", () => ({
  auth: { api: { getSession: vi.fn() } },
}));

vi.mock("@/src/server/container", () => ({
  orderService: { createCheckoutSession: vi.fn() },
}));

import { POST } from "../route";
import { auth } from "@/src/server/auth";
import { orderService } from "@/src/server/container";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "@/src/server/error";

function makeRequest(
  body: unknown,
  options?: { invalidJson?: boolean },
): NextRequest {
  const req = new NextRequest("http://localhost:3000/api/v1/checkout", {
    method: "POST",
    headers: new Headers({ "content-type": "application/json" }),
  });

  if (options?.invalidJson) {
    vi.spyOn(req, "json").mockRejectedValue(new SyntaxError("Invalid JSON"));
  } else {
    vi.spyOn(req, "json").mockResolvedValue(body);
  }

  return req;
}

describe("POST /api/v1/checkout", () => {
  const mockUserId = "user_abc123";
  const validBody = {
    userId: "placeholder", // schema yêu cầu userId
    items: [{ productId: "p1", variantId: "v1", quantity: 2 }],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null);

    const res = await POST(makeRequest(validBody));

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("UNAUTHORIZED");
    expect(orderService.createCheckoutSession).not.toHaveBeenCalled();
  });

  it("returns 400 when body is invalid", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: mockUserId },
    } as any);

    const res = await POST(makeRequest({}));

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid params");
    expect(orderService.createCheckoutSession).not.toHaveBeenCalled();
  });

  it("does not call service when validation fails", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: mockUserId },
    } as any);

    await POST(makeRequest({}));

    expect(orderService.createCheckoutSession).not.toHaveBeenCalled();
  });

  it("returns 201 with session on success", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: mockUserId },
    } as any);

    const mockSession = {
      id: "session_001",
      userId: mockUserId,
      subTotal: 500000,
      items: [],
    };
    vi.mocked(orderService.createCheckoutSession).mockResolvedValue(
      mockSession as any,
    );

    const res = await POST(makeRequest(validBody));

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toEqual(mockSession);
  });

  it("returns 400 when service throws BadRequestError", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: mockUserId },
    } as any);

    vi.mocked(orderService.createCheckoutSession).mockRejectedValue(
      new BadRequestError("EMPTY_ITEMS", "Items cannot be empty"),
    );

    const res = await POST(makeRequest(validBody));

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("EMPTY_ITEMS");
  });

  it("returns 404 when service throws NotFoundError", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: mockUserId },
    } as any);

    vi.mocked(orderService.createCheckoutSession).mockRejectedValue(
      new NotFoundError("VARIANT_NOT_FOUND", "Variant v1"),
    );

    const res = await POST(makeRequest(validBody));

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe("VARIANT_NOT_FOUND");
  });

  it("returns 409 when service throws ConflictError", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: mockUserId },
    } as any);

    vi.mocked(orderService.createCheckoutSession).mockRejectedValue(
      new ConflictError("OUT_OF_STOCK", "1 < 5"),
    );

    const res = await POST(makeRequest(validBody));

    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toBe("OUT_OF_STOCK");
  });

  it("returns 500 when service throws unknown error", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: mockUserId },
    } as any);

    vi.mocked(orderService.createCheckoutSession).mockRejectedValue(
      new Error("DB connection failed"),
    );

    const res = await POST(makeRequest(validBody));

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("INTERNAL_ERROR");
  });
});
