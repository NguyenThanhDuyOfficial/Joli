import { auth } from "@/src/server/auth";
import { orderService } from "@/src/server/container";
import { AppError } from "@/src/server/error";
import { CreateCheckOutSessionInputSchema } from "@nguyenthanhduyofficial/schemas";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const parsed = CreateCheckOutSessionInputSchema.safeParse(await req.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid params", details: z.flattenError(parsed.error) },
        { status: 400 },
      );
    }

    const userId = session.user.id;
    const result = await orderService.createCheckoutSession({
      ...parsed.data,
      userId,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        {
          error: error.code,
        },
        { status: error.statusCode },
      );
    }

    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
