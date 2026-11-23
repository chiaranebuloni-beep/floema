import type { Metadata } from "next";
import Link from "next/link";
import { backendFetch, backendUrl } from "@/lib/backend";
import { formatPrice } from "@/lib/format";

// «Segui l'ordine»: il link arriva nelle email (numero dell'ordine + codice segreto, come la pagina di conferma).
export const metadata: Metadata = { title: "Il tuo ordine — FLOEMA Wood Studio", robots: { index: false } };
export const dynamic = "force-dynamic";

type TrackedOrder = {
  id: string;
  createdAt: string;
  customer: { name: string };
  lines: { key: string; name: string; variantName: string; qty: number; total: number }[];
  total: number;
  shipment: { status: string; carrier: string; trackingNumber: string; trackingUrl: string; shippedAt: string | null };
};

async function getOrder(number?: string, token?: string): Promise<TrackedOrder | undefined> {
  if (!number || !token || !backendUrl()) return undefined;
  try {
    const res = await backendFetch(`/api/orders/${encodeURIComponent(number)}/?t=${encodeURIComponent(token)}`);
    return res.ok ? ((await res.json()) as TrackedOrder) : undefined;
  } catch {
    return undefined;
  }
}

const date = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString("it-IT", { timeZone: "Europe/Rome" }) : "");

export default async function OrderPage({ searchParams }: { searchParams: Promise<{ order?: string; t?: string }> }) {
  const { order: number, t } = await searchParams;
  const order = await getOrder(number, t);

  if (!order) {
    return (
      <main>
        <section className="checkout" data-theme="light">
          <div className="container checkout__done">
            <h1 className="display display--dark">Ordine non trovato.</h1>
            <p className="lead">Apri il link che trovi nell&apos;email di conferma dell&apos;ordine.</p>
            <Link href="/shop" className="btn btn--solid">
              Torna allo shop
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const s = order.shipment;
  const cancelled = s.status === "cancelled";
  const shipped = s.status === "shipped" || s.status === "delivered";
  const delivered = s.status === "delivered";
  const steps = [
    { label: "Ordine confermato", done: true, note: date(order.createdAt) },
    { label: "Ordine spedito", done: shipped, note: shipped ? date(s.shippedAt) : "In preparazione nel laboratorio" },
    { label: "Consegnato", done: delivered, note: delivered ? "" : shipped ? "In arrivo" : "" },
  ];

  return (
    <main>
      <section className="checkout" data-theme="light">
        <div className="container track">
          <p className="track__eyebrow">Ordine {order.id}</p>
          <h1 className="checkout__title">{cancelled ? "Ordine annullato." : delivered ? "Consegnato." : shipped ? "In viaggio." : "In preparazione."}</h1>

          {!cancelled && (
            <ol className="track__steps">
              {steps.map((step) => (
                <li key={step.label} className={step.done ? "is-done" : ""}>
                  <span className="track__mark" aria-hidden>
                    {step.done ? "✓" : "○"}
                  </span>
                  <span className="track__label">{step.label}</span>
                  {step.note && <span className="track__note">{step.note}</span>}
                </li>
              ))}
            </ol>
          )}

          {shipped && (s.carrier || s.trackingNumber || s.trackingUrl) && (
            <div className="track__box">
              {s.carrier && (
                <div>
                  <span className="track__key">Corriere</span>
                  <span className="track__value">{s.carrier}</span>
                </div>
              )}
              {s.trackingNumber && (
                <div>
                  <span className="track__key">Numero di tracking</span>
                  <span className="track__value track__value--code">{s.trackingNumber}</span>
                </div>
              )}
              {s.trackingUrl && (
                <a href={s.trackingUrl} className="btn btn--solid" target="_blank" rel="noopener noreferrer">
                  Segui la spedizione
                </a>
              )}
            </div>
          )}

          <ul className="checkout__recap track__recap">
            {order.lines.map((l) => (
              <li key={l.key}>
                <span>
                  {l.name}
                  {l.variantName && ` — ${l.variantName}`} × {l.qty}
                </span>
                <span>{formatPrice(l.total)}</span>
              </li>
            ))}
            <li className="checkout__total">
              <span>Totale</span>
              <span>{formatPrice(order.total)}</span>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
