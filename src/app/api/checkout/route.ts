import { NextResponse } from "next/server";
import { priceCart } from "@/lib/products";
import { createOrder, updateOrder, type Customer } from "@/lib/orders";
import { createCheckoutSession, stripeEnabled } from "@/lib/stripe";
import { backendFetch, backendUrl } from "@/lib/backend";
import type { CartLine } from "@/lib/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REQUIRED: (keyof Customer)[] = ["name", "email", "phone", "address", "city", "zip", "country"];

// Spedizione: valore provvisorio finché il cliente non definisce costi e zone.
const SHIPPING = 0;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  // Con il backend Django attivo, ordine, prezzi, spedizione e pagamento vengono gestiti lì.
  if (backendUrl()) {
    try {
      const res = await backendFetch("/api/checkout/", { method: "POST", body: { ...body, origin: new URL(req.url).origin } });
      const data = await res.json();
      return NextResponse.json(res.ok ? { url: data.url } : { error: data.error ?? "Ordine non riuscito." }, { status: res.status });
    } catch {
      return NextResponse.json({ error: "Il negozio non è raggiungibile. Riprova tra poco." }, { status: 503 });
    }
  }

  const items: CartLine[] = Array.isArray(body?.items) ? body.items.slice(0, 20) : [];
  const raw = body?.customer ?? {};
  const customer = Object.fromEntries(
    [...REQUIRED, "notes"].map((k) => [k, String(raw[k] ?? "").trim().slice(0, 300)]),
  ) as Customer;

  const missing = REQUIRED.filter((k) => !customer[k]);
  if (missing.length) return NextResponse.json({ error: "Compila tutti i campi obbligatori." }, { status: 400 });
  if (!EMAIL_RE.test(customer.email)) return NextResponse.json({ error: "Inserisci un indirizzo email valido." }, { status: 400 });
  if (body?.terms !== true) return NextResponse.json({ error: "Serve l'accettazione delle condizioni di vendita." }, { status: 400 });

  const cart = await priceCart(items);
  if (!cart.lines.length) return NextResponse.json({ error: "Il carrello è vuoto." }, { status: 400 });

  let order;
  try {
    order = await createOrder({
      status: "pending",
      customer,
      lines: cart.lines,
      subtotal: cart.subtotal,
      shipping: SHIPPING,
      total: cart.subtotal + SHIPPING,
    });
  } catch {
    // Su hosting senza archivio scrivibile (es. Vercel) l'ordine demo non può essere salvato finché non c'è un database.
    if (!stripeEnabled()) return NextResponse.json({ url: "/checkout/successo?demo=1" });
    return NextResponse.json({ error: "Archivio ordini non disponibile." }, { status: 503 });
  }

  if (!stripeEnabled()) {
    await updateOrder(order.id, { status: "demo" });
    return NextResponse.json({ url: `/checkout/successo?order=${order.id}` });
  }

  try {
    const origin = new URL(req.url).origin;
    const session = await createCheckoutSession(order, origin);
    await updateOrder(order.id, { stripeSessionId: session.id });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Pagamento non disponibile." }, { status: 502 });
  }
}
