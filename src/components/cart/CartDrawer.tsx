"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/format";

export function CartDrawer() {
  const { open, setOpen, priced, subtotal, setQty } = useCart();

  useEffect(() => {
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <div className={`drawer ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <button className="drawer__scrim" aria-label="Chiudi carrello" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} />
      <aside className="drawer__panel" role="dialog" aria-modal="true" aria-label="Carrello">
        <header className="drawer__head">
          <span className="eyebrow">Il tuo carrello</span>
          <button className="link-line" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
            Chiudi
          </button>
        </header>

        {priced.length === 0 ? (
          <p className="drawer__empty">Il carrello è vuoto.</p>
        ) : (
          <ul className="drawer__list">
            {priced.map((l) => (
              <li key={l.key} className="drawer__line">
                <div className="drawer__thumb">
                  <Image src={l.image} alt="" fill sizes="96px" />
                </div>
                <div>
                  <p className="drawer__name">{l.name}</p>
                  <p className="drawer__meta">
                    {l.variantName && `${l.variantName} · `}Pre-ordine · {formatPrice(l.unitPrice)}
                  </p>
                  <div className="qty">
                    <button aria-label="Diminuisci" tabIndex={open ? 0 : -1} onClick={() => setQty(l.slug, l.variant, l.qty - 1)}>−</button>
                    <span>{l.qty}</span>
                    <button aria-label="Aumenta" tabIndex={open ? 0 : -1} onClick={() => setQty(l.slug, l.variant, Math.min(l.qty + 1, 10))}>+</button>
                  </div>
                </div>
                <p className="drawer__total">{formatPrice(l.total)}</p>
              </li>
            ))}
          </ul>
        )}

        <footer className="drawer__foot">
          <div className="drawer__sub">
            <span>Subtotale</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <p className="drawer__note">Spedizione e imposte calcolate al checkout.</p>
          {priced.length > 0 ? (
            <Link href="/checkout" className="btn btn--solid btn--full" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
              Vai al checkout
            </Link>
          ) : (
            <button className="btn btn--solid btn--full" disabled tabIndex={open ? 0 : -1}>
              Vai al checkout
            </button>
          )}
        </footer>
      </aside>
    </div>
  );
}
