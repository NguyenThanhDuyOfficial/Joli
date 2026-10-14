"use server";

import { CreateCheckoutSessionRequestSchema } from "@nguyenthanhduyofficial/schemas";
import { revalidatePath } from "next/cache";
import { checkoutSessionService } from "../server/container";
import { requireAuth } from "../server/auth-guard";
import z from "zod";
import { AppError } from "../server/error";

export async function createCheckoutSessionAction(input: unknown) {
  const user = await requireAuth();

  const parsed = CreateCheckoutSessionRequestSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: "INVALID_PARAMS",
      details: z.flattenError(parsed.error),
    };
  }

  try {
    const result = await checkoutSessionService.createCheckoutSession(
      parsed.data,
      user.id,
    );

    revalidatePath("/cart");
    revalidatePath("/checkout");

    return result;
  } catch (error) {
    if (error instanceof AppError) {
      return { ...error, error: error.code };
    }
    return { error: "INTERNAL_ERROR" };
  }
}
