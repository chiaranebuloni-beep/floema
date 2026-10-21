export type ProductMode = {
  id: string;
  label: string;
  title: string;
  text: string;
  image: string;
};

export type Product = {
  slug: string;
  name: string;
  chapter: string;
  tagline: string;
  description: string;
  material: string;
  origin: string;
  price: number;
  currency: "EUR";
  status: "available" | "preorder" | "soldout";
  modes: ProductMode[];
};

export type CartLine = { slug: string; qty: number };

export type PricedLine = CartLine & { name: string; unitPrice: number; total: number; image: string };
