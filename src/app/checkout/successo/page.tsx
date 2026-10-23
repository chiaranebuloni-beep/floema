import type { Metadata } from "next";
import Link from "next/link";
import { getOrder, updateOrder, type Order } from "@/lib/orders";
import { isSessionPaid, stripeEnabled } from "@/lib/stripe";
import { formatPrice } from "@/lib/format";
import { ClearCart } from "@/components/pages/ClearCart";
import { backendFetch, backendUrl } from "@/lib/backend";

// Ordine letto dal backend Django (verifica anche il pagamento Stripe al ritorno dal checkout).
async function getBackendOrder(number: string, token?: string, sessionId?: string): Promise<Order | undefined> {
  const params = new URLSearchParams({ t: token ?? "" });
  if (sessionId) params.set("session_id", sessionId);
  try {
    const res = await backendFetch(`/api/orders/${encodeURIComponent(number)}/?${params}`);
    return res.ok ? ((await res.json()) as Order) : undefined;
  } catch {
    return undefined;
  }
}

export const metadata: Metadata = { title: "Ordine ricevuto — FLOEMA Wood Studio", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ order?: string; t?: string; session_id?: string; demo?: string }> }) {
  const { order: id, t, session_id, demo } = await searchParams;
  if (id && backendUrl()) return <OrderDone order={await getBackendOrder(id, t, session_id)} demo={demo} />;
  let order = id ? await getOrder(id) : undefined;

  // Con Stripe attivo, lo stato "pagato" viene verificato direttamente sulla sessione di pagamento.
  if (order && order.status === "pending" && stripeEnabled() && session_id && session_id === order.stripeSessionId) {
    if (await isSessionPaid(session_id)) order = await updateOrder(order.id, { status: "paid" });
  }

  return <OrderDone order={order} demo={demo} />;
}

function OrderDone({ order, demo }: { order?: Order; demo?: string }) {
  return (
    <main>
      <section className="checkout" data-theme="light">
        <div className="container checkout__done">
          {order ? (
            <>
              <ClearCart />
              <p className="eyebrow eyebrow--dark">Ordine {order.id}</p>
              <h1 className="display display--dark">Grazie, {order.customer.name.split(" ")[0]}.</h1>
              <p className="lead">
                {order.status === "paid"
                  ? "Il pagamento è andato a buon fine. Riceverai una email di conferma con i dettagli della spedizione."
                  : order.status === "demo"
                    ? "Ordine registrato in modalità demo: nessun pagamento è stato effettuato."
                    : "Stiamo verificando il pagamento. Riceverai una email di conferma a breve."}
              </p>
              <ul className="checkout__recap">
                {order.lines.map((l) => (
                  <li key={l.key}>
                    <span>
                      {l.name} — {l.variantName} × {l.qty}
                    </span>
                    <span>{formatPrice(l.total)}</span>
                  </li>
                ))}
                <li className="checkout__total">
                  <span>Totale</span>
                  <span>{formatPrice(order.total)}</span>
                </li>
              </ul>
              <Link href="/shop" className="btn btn--solid">
                Torna allo shop
              </Link>
            </>
          ) : demo ? (
            <>
              <ClearCart />
              <h1 className="display display--dark">Grazie.</h1>
              <p className="lead">
                Ordine demo completato: nessun pagamento è stato effettuato e l&apos;ordine non è stato archiviato, perché il database
                degli ordini non è ancora collegato.
              </p>
              <Link href="/shop" className="btn btn--solid">
                Torna allo shop
              </Link>
            </>
          ) : (
            <>
              <h1 className="display display--dark">Ordine non trovato.</h1>
              <Link href="/shop" className="btn btn--solid">
                Torna allo shop
              </Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
