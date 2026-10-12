import { auth } from "@/src/server/auth";
import { orderService } from "@/src/server/container";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { id } = await params;

  const result = await orderService.getCheckoutSessionById(id);

  return NextResponse.json(result);
}
