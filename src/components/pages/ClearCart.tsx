"use client";
import { useEffect } from "react";
import { CART_STORAGE_KEY, useCart } from "../cart/CartProvider";

// Svuota il carrello quando l'ordine è stato registrato.
export function ClearCart() {
  const { clear } = useCart();
  useEffect(() => {
    // Questo effetto gira prima di quello del CartProvider che rilegge il carrello salvato: va svuotato anche lo storage.
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {}
    clear();
  }, [clear]);
  return null;
}
