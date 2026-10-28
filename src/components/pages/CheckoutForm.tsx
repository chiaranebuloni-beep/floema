"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { useCart } from "../cart/CartProvider";

const COUNTRIES = ["Italia", "Svizzera", "Austria", "Germania", "Francia", "Spagna", "Paesi Bassi", "Belgio"];

export function CheckoutForm({ stripe }: { stripe: boolean }) {
  const { lines, priced, subtotal } = useCart();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines,
          customer: Object.fromEntries(["name", "email", "phone", "address", "city", "zip", "country", "notes"].map((k) => [k, f.get(k)])),
          terms: f.get("terms") === "on",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Qualcosa non ha funzionato, riprova.");
      setLoading(false);
    }
  }

  return (
    <section className="checkout" data-theme="light">
      <div className="container">
        <div className="section__label">
          <span>01</span>
          <span>Checkout</span>
        </div>
        {!stripe && (
          <p className="pdp__draft">Modalità demo: nessun pagamento reale. Aggiungi una chiave Stripe di test per provare il pagamento.</p>
        )}

        {priced.length === 0 ? (
          <div className="checkout__empty">
            <h1 className="display display--dark">Il carrello è vuoto.</h1>
            <Link href="/shop" className="btn btn--solid">
              Vai allo shop
            </Link>
          </div>
        ) : (
          <div className="checkout__grid">
            <form className="cform" onSubmit={onSubmit} noValidate>
              <h1 className="checkout__title">Dati di spedizione</h1>
              <label className="cfield">
                <span>Nome e cognome *</span>
                <input name="name" autoComplete="name" required />
              </label>
              <div className="checkout__row">
                <label className="cfield">
                  <span>Email *</span>
                  <input name="email" type="email" autoComplete="email" required />
                </label>
                <label className="cfield">
                  <span>Telefono *</span>
                  <input name="phone" type="tel" autoComplete="tel" required />
                </label>
              </div>
              <label className="cfield">
                <span>Indirizzo *</span>
                <input name="address" autoComplete="street-address" required />
              </label>
              <div className="checkout__row checkout__row--3">
                <label className="cfield">
                  <span>Città *</span>
                  <input name="city" autoComplete="address-level2" required />
                </label>
                <label className="cfield">
                  <span>CAP *</span>
                  <input name="zip" autoComplete="postal-code" required />
                </label>
                <label className="cfield">
                  <span>Paese *</span>
                  <select name="country" defaultValue="Italia" autoComplete="country-name">
                    {COUNTRIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="cfield">
                <span>Note per l&apos;ordine</span>
                <textarea name="notes" rows={3} />
              </label>
              <label className="consent">
                <input type="checkbox" name="terms" required />
                <span>Accetto le condizioni di vendita e l&apos;informativa privacy.</span>
              </label>
              {error && (
                <p className="news__error" role="alert">
                  {error}
                </p>
              )}
              <div>
                <button type="submit" className="btn btn--solid" disabled={loading}>
                  {loading ? "Attendi…" : stripe ? "Procedi al pagamento" : "Conferma ordine (demo)"}
                </button>
              </div>
            </form>

            <aside className="checkout__summary" aria-label="Riepilogo ordine">
              <p className="eyebrow eyebrow--dark">Il tuo ordine</p>
              <ul className="drawer__list">
                {priced.map((l) => (
                  <li key={l.key} className="drawer__line">
                    <div className="drawer__thumb">
                      <Image src={l.image} alt="" fill sizes="96px" />
                    </div>
                    <div>
                      <p className="drawer__name">{l.name}</p>
                      <p className="drawer__meta">
                        {l.variantName} · Quantità {l.qty}
                      </p>
                    </div>
                    <p className="drawer__total">{formatPrice(l.total)}</p>
                  </li>
                ))}
              </ul>
              <div className="checkout__totals">
                <div>
                  <span>Subtotale</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div>
                  <span>Spedizione</span>
                  <span>Esclusa</span>
                </div>
                <div className="checkout__total">
                  <span>Totale</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>
              <p className="drawer__note">Prezzi IVA inclusa. Pagamento sicuro con Stripe.</p>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
