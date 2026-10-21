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
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
};

const CartContext = createContext<CartState | null>(null);
const KEY = "floema-cart";

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
      .then((data) => {
        setPriced(data.lines);
        setSubtotal(data.subtotal);
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, [lines, ready]);

  const add = useCallback((slug: string, qty = 1) => {
    setLines((prev) => {
      const found = prev.find((l) => l.slug === slug);
      if (found) return prev.map((l) => (l.slug === slug ? { ...l, qty: Math.min(l.qty + qty, 10) } : l));
      return [...prev, { slug, qty }];
    });
    setOpen(true);
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setLines((prev) => (qty <= 0 ? prev.filter((l) => l.slug !== slug) : prev.map((l) => (l.slug === slug ? { ...l, qty } : l))));
  }, []);

  const count = lines.reduce((n, l) => n + l.qty, 0);
  const value = useMemo(
    () => ({ lines, priced, subtotal, count, open, setOpen, add, setQty }),
    [lines, priced, subtotal, count, open, add, setQty],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart va usato dentro CartProvider");
  return ctx;
}
