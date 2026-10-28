export type ProductMode = {
  id: string;
  label: string;
  title: string;
  text: string;
  image: string;
};

export type VariantKind = "color" | "material" | "size";

export type ProductVariant = {
  id: string;
  kind: VariantKind;
  name: string;
  extra: number; // supplemento sul prezzo del prodotto
  swatch?: string; // solo colori: pallino nel selettore
  woodTint?: string; // solo colori: tinta del legno chiaro nel 3D
  legTint?: string; // solo colori: tinta della gamba nel 3D
};

export type ProductDetails = {
  placeholder?: boolean; // true finché i dati non arrivano dal cliente
  wood: string;
  finish: string;
  mechanism: string;
  care: string;
  certifications: string;
  shipping: string;
  returns: string;
  leadTime: string;
};

export type Product = {
  slug: string;
  name: string;
  chapter: string;
  description: string;
  material: string;
  dimensions?: string;
  origin: string;
  price: number;
  currency: "EUR";
  status: "available" | "preorder" | "soldout";
  images: { src: string; alt: string; variant?: string | null }[]; // galleria; variant = colorazione a cui si riferisce
  modes: ProductMode[];
  variants: ProductVariant[];
  details: ProductDetails;
};

export type CartLine = { slug: string; variant?: string; qty: number };

export type PricedLine = CartLine & { key: string; name: string; variantName: string; unitPrice: number; total: number; image: string };
