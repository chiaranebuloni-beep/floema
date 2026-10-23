"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartLine, PricedLine } from "@/lib/types";

type CartState = {
  lines: CartLine[];
  priced: PricedLine[];
  subtotal: number;
  count: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (slug: string, variant?: string, qty?: number) => void;
  setQty: (slug: string, variant: string | undefined, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartState | null>(null);
export const CART_STORAGE_KEY = "floema-cart";
const KEY = CART_STORAGE_KEY;
const same = (l: CartLine, slug: string, variant?: string) => l.slug === slug && (l.variant ?? "") === (variant ?? "");

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [priced, setPriced] = useState<PricedLine[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      if (Array.isArray(saved)) setLines(saved);
    } catch {}
    setReady(true);
  }, []);

  // Ogni modifica viene riprezzata dal backend.
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
    const ctrl = new AbortController();
    fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: lines }),
      signal: ctrl.signal,
    })
      .then((r) => r.json())
      .then((data: { lines: PricedLine[]; subtotal: number }) => {
        setPriced(data.lines);
        setSubtotal(data.subtotal);
        // Allinea il carrello salvato a quello normalizzato dal server (colorazione sempre esplicita, niente doppioni).
        const normalized: CartLine[] = data.lines.map(({ slug, variant, qty }) => ({ slug, variant, qty }));
        if (JSON.stringify(normalized) !== JSON.stringify(lines)) setLines(normalized);
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, [lines, ready]);

  const add = useCallback((slug: string, variant?: string, qty = 1) => {
    setLines((prev) => {
      const found = prev.find((l) => same(l, slug, variant));
      if (found) return prev.map((l) => (same(l, slug, variant) ? { ...l, qty: Math.min(l.qty + qty, 10) } : l));
      return [...prev, { slug, variant, qty }];
    });
    setOpen(true);
  }, []);

  const setQty = useCallback((slug: string, variant: string | undefined, qty: number) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => !same(l, slug, variant)) : prev.map((l) => (same(l, slug, variant) ? { ...l, qty } : l)),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const count = lines.reduce((n, l) => n + l.qty, 0);
  const value = useMemo(
    () => ({ lines, priced, subtotal, count, open, setOpen, add, setQty, clear }),
    [lines, priced, subtotal, count, open, add, setQty, clear],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart va usato dentro CartProvider");
  return ctx;
}
