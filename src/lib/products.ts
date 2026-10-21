import "server-only";
import { readCollection } from "./store";
import type { CartLine, PricedLine, Product } from "./types";

export async function getProducts(): Promise<Product[]> {
  return readCollection<Product[]>("products", []);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return (await getProducts()).find((p) => p.slug === slug);
}

// I prezzi vengono sempre ricalcolati lato server: il client invia solo slug e quantità.
export async function priceCart(lines: CartLine[]) {
  const products = await getProducts();
  const priced: PricedLine[] = [];
  for (const line of lines) {
    const product = products.find((p) => p.slug === line.slug);
    const qty = Math.min(Math.max(Math.floor(Number(line.qty) || 0), 0), 10);
    if (!product || qty === 0 || product.status === "soldout") continue;
    priced.push({
      slug: product.slug,
      qty,
      name: product.name,
      unitPrice: product.price,
      total: product.price * qty,
      image: product.modes[0]?.image ?? "",
    });
  }
  const subtotal = priced.reduce((sum, l) => sum + l.total, 0);
  return { lines: priced, subtotal, currency: "EUR" as const };
}
