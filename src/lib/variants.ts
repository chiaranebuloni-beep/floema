import type { Product, ProductVariant, VariantKind } from "./types";

// Tipi di variante, nell'ordine in cui compaiono sulla pagina prodotto.
export const VARIANT_KINDS: { kind: VariantKind; label: string }[] = [
  { kind: "color", label: "Colorazione" },
  { kind: "material", label: "Materiale" },
  { kind: "size", label: "Dimensioni" },
];

// Una scelta per ogni tipo offerto dal prodotto; i codici mancanti o non validi ricadono sulla prima opzione.
export function resolveVariants(product: Product, codes?: string): ProductVariant[] {
  const wanted = (codes ?? "").split(",");
  return VARIANT_KINDS.flatMap(({ kind }) => {
    const options = product.variants.filter((v) => v.kind === kind);
    const pick = options.find((v) => wanted.includes(v.id)) ?? options[0];
    return pick ? [pick] : [];
  });
}

export const variantKey = (variants: ProductVariant[]) => variants.map((v) => v.id).join(",");
export const variantLabel = (variants: ProductVariant[]) => variants.map((v) => v.name).join(" · ");
export const variantPrice = (product: Product, variants: ProductVariant[]) =>
  product.price + variants.reduce((sum, v) => sum + (v.extra || 0), 0);
