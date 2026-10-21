import { NextResponse } from "next/server";
import { getProduct } from "@/lib/products";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const product = await getProduct((await params).slug);
  if (!product) return NextResponse.json({ error: "Prodotto non trovato" }, { status: 404 });
  return NextResponse.json({ product });
}
