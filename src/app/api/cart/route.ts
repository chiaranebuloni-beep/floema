import { NextResponse } from "next/server";
import { priceCart } from "@/lib/products";
import type { CartLine } from "@/lib/types";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const items: CartLine[] = Array.isArray(body?.items) ? body.items.slice(0, 20) : [];
  return NextResponse.json(await priceCart(items));
}
