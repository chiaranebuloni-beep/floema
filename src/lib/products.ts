import "server-only";
import { backendFetch, backendUrl } from "./backend";
import { readCollection } from "./store";
import type { CartLine, PricedLine, Product } from "./types";
import { resolveVariants, variantKey, variantLabel, variantPrice } from "./variants";

// Per le pagine il catalogo resta in cache un minuto; per i prezzi del carrello (`fresh`) si rilegge sempre.
export async function getProducts({ fresh = false } = {}): Promise<Product[]> {
  if (backendUrl()) {
    try {
      const res = await backendFetch("/api/products/", fresh ? undefined : { revalidate: 60 });
      if (res.ok) return (await res.json()) as Product[];
    } catch {
      // Backend non raggiungibile: si ripiega sul catalogo locale.
    }
  }
  return readCollection<Product[]>("products", []);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return (await getProducts()).find((p) => p.slug === slug);
}

export const lineKey = (slug: string, variant?: string) => `${slug}:${variant ?? ""}`;

// I prezzi vengono sempre ricalcolati lato server: il client invia solo slug, colorazione e quantità.
export async function priceCart(lines: CartLine[]) {
  const products = await getProducts({ fresh: true });
  const priced: PricedLine[] = [];
  for (const line of lines) {
    const product = products.find((p) => p.slug === line.slug);
    const qty = Math.min(Math.max(Math.floor(Number(line.qty) || 0), 0), 10);
    if (!product || qty === 0 || product.status === "soldout") continue;
    const variants = resolveVariants(product, line.variant);
    const unitPrice = variantPrice(product, variants);
    const variant = variantKey(variants) || undefined;
    const key = lineKey(product.slug, variant);
    // Righe che finiscono sullo stesso prodotto e colorazione (es. una salvata senza colore) vengono unite.
    const existing = priced.find((l) => l.key === key);
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, 10);
      existing.total = existing.unitPrice * existing.qty;
      continue;
    }
    priced.push({
      key,
      slug: product.slug,
      variant,
      qty,
      name: product.name,
      variantName: variantLabel(variants),
      unitPrice,
      total: unitPrice * qty,
      image: product.modes[0]?.image ?? "",
    });
  }
  const subtotal = priced.reduce((sum, l) => sum + l.total, 0);
  return { lines: priced, subtotal, currency: "EUR" as const };
}
