"use server";

import { CreateOrderRequestSchema } from "@nguyenthanhduyofficial/schemas";
import { requireAuth } from "../server/auth-guard";
import { orderService } from "../server/container";
import { revalidatePath } from "next/cache";
import { AppError } from "../server/error";
import z from "zod";

export async function createOrderAction(input: unknown) {
  const user = await requireAuth();

  const parsed = CreateOrderRequestSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: "INVALID_PARAMS",
      details: z.flattenError(parsed.error),
    };
  }

  try {
    const result = await orderService.create(parsed.data, user.id);

    revalidatePath("/order");

    return result;
  } catch (error) {
    if (error instanceof AppError) {
      return { ...error, error: error.code };
    }
    return { error: "INTERNAL_ERROR" };
  }
}
