import "server-only";
import type { Order } from "./orders";

// Integrazione Stripe Checkout via API REST: si attiva solo se è presente STRIPE_SECRET_KEY (chiave di test sk_test_...).
export const stripeEnabled = () => Boolean(process.env.STRIPE_SECRET_KEY);

async function stripe(path: string, init?: { method?: string; body?: URLSearchParams }) {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: init?.method ?? "GET",
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: init?.body,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message ?? "Errore Stripe");
  return data;
}

export async function createCheckoutSession(order: Order, origin: string): Promise<{ id: string; url: string }> {
  const body = new URLSearchParams();
  body.set("mode", "payment");
  body.set("customer_email", order.customer.email);
  body.set("success_url", `${origin}/checkout/successo?order=${order.id}&session_id={CHECKOUT_SESSION_ID}`);
  body.set("cancel_url", `${origin}/checkout`);
  body.set("metadata[order_id]", order.id);
  order.lines.forEach((l, i) => {
    body.set(`line_items[${i}][quantity]`, String(l.qty));
    body.set(`line_items[${i}][price_data][currency]`, "eur");
    body.set(`line_items[${i}][price_data][unit_amount]`, String(Math.round(l.unitPrice * 100)));
    body.set(`line_items[${i}][price_data][product_data][name]`, l.variantName ? `${l.name} — ${l.variantName}` : l.name);
  });
  const session = await stripe("checkout/sessions", { method: "POST", body });
  return { id: session.id, url: session.url };
}

export async function isSessionPaid(sessionId: string): Promise<boolean> {
  const session = await stripe(`checkout/sessions/${encodeURIComponent(sessionId)}`);
  return session.payment_status === "paid";
}
