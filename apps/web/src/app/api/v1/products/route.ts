import { NextRequest, NextResponse } from "next/server";
import { ProductsRequestSchema } from "@nguyenthanhduyofficial/schemas";
import { productService } from "../../../../server/container";
import z from "zod";

export async function GET(req: NextRequest) {
  const parsed = ProductsRequestSchema.safeParse(
    Object.fromEntries(req.nextUrl.searchParams),
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: "INVALID_QUERY", details: z.flattenError(parsed.error) },
      { status: 400 },
    );
  }
  try {
    const result = await productService.getMany(parsed.data);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 },
    );
  }
}
