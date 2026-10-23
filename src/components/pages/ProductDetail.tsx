"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { VARIANT_KINDS, resolveVariants, variantKey, variantPrice } from "@/lib/variants";
import { useCart } from "../cart/CartProvider";
import { Magnetic } from "../Magnetic";

const Stool3D = dynamic(() => import("../three/Stool3D"), {
  ssr: false,
  loading: () => <div className="stool3d__canvas stool3d__canvas--loading" />,
});

export function ProductDetail({ product }: { product: Product }) {
  const { add } = useCart();
  const [codes, setCodes] = useState(() => variantKey(resolveVariants(product)));
  const [view, setView] = useState<"3d" | number>("3d");
  const [qty, setQty] = useState(1);
  const chosen = resolveVariants(product, codes);
  const color = chosen.find((v) => v.kind === "color");
  // Scegliere un'opzione sostituisce quella dello stesso tipo e lascia invariate le altre.
  const choose = (kind: string, id: string) =>
    setCodes(variantKey(chosen.map((v) => (v.kind === kind ? product.variants.find((o) => o.id === id) ?? v : v))));
  const d = product.details;
  const photos = product.images;

  // Caratteristiche del prodotto e informazioni d'acquisto in due elenchi apribili distinti.
  const specs = [
    { t: "Dimensioni", body: product.dimensions ?? "—" },
    { t: "Legno", body: d.wood },
    { t: "Finitura", body: d.finish },
    { t: "Utilizzo", body: d.mechanism },
    { t: "Cura e manutenzione", body: d.care },
  ];
  const purchase = [
    { t: "Certificazioni", body: d.certifications },
    { t: "Spedizioni", body: d.shipping },
    { t: "Resi", body: d.returns },
  ];

  return (
    <section className="pdp" data-theme="light">
      <div className="container pdp__grid">
        <div className="pdp__gallery">
          <div className={`pdp__stage ${view === "3d" ? "pdp__stage--3d" : ""}`}>
            {view === "3d" ? (
              <>
                <Stool3D woodTint={color?.woodTint} legTint={color?.legTint} />
                <span className="pcard__hint" aria-hidden>
                  ↻ Trascina per ruotare
                </span>
              </>
            ) : (
              <Image src={photos[view].src} alt={photos[view].alt} fill sizes="(max-width: 900px) 92vw, 52vw" priority />
            )}
          </div>
          <div className="pdp__thumbs" role="tablist" aria-label="Immagini prodotto">
            <button role="tab" aria-selected={view === "3d"} className={`pdp__thumb pdp__thumb--3d ${view === "3d" ? "is-active" : ""}`} onClick={() => setView("3d")}>
              3D
            </button>
            {photos.map((p, i) => (
              <button key={p.src} role="tab" aria-selected={view === i} className={`pdp__thumb ${view === i ? "is-active" : ""}`} onClick={() => setView(i)} aria-label={p.alt}>
                <Image src={p.src} alt="" fill sizes="96px" />
              </button>
            ))}
          </div>
        </div>

        <div className="pdp__info">
          <nav className="pdp__crumbs" aria-label="Percorso">
            <Link href="/shop">Shop</Link> <span aria-hidden>/</span> <span>{product.name}</span>
          </nav>
          {d.placeholder && <p className="pdp__draft">Contenuti provvisori — in attesa dei dati definitivi del cliente</p>}
          <p className="pcard__meta">
            <span>{product.chapter}</span>
            <span>{product.material}</span>
          </p>
          <h1 className="pcard__name">{product.name}</h1>
          <p className="pcard__price">{formatPrice(variantPrice(product, chosen))}</p>
          <p className="body pdp__desc">{product.description}</p>

          {VARIANT_KINDS.map(({ kind, label }) => {
            const options = product.variants.filter((v) => v.kind === kind);
            const current = chosen.find((v) => v.kind === kind);
            if (!options.length) return null;
            return (
              <fieldset key={kind} className="pdp__variants">
                <legend className="eyebrow eyebrow--dark">
                  {label} <strong>{current?.name}</strong>
                </legend>
                <div className={kind === "color" ? "pdp__swatches" : "pdp__options"}>
                  {options.map((v) => (
                    <label
                      key={v.id}
                      className={`${kind === "color" ? "pdp__swatch" : "pdp__option"} ${v.id === current?.id ? "is-active" : ""}`}
                      title={v.name}
                    >
                      <input type="radio" name={kind} value={v.id} checked={v.id === current?.id} onChange={() => choose(kind, v.id)} />
                      {kind === "color" ? (
                        <>
                          <span style={{ background: v.swatch }} aria-hidden />
                          <em>{v.name}</em>
                        </>
                      ) : (
                        <span>
                          {v.name}
                          {v.extra > 0 && <small> + {formatPrice(v.extra)}</small>}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </fieldset>
            );
          })}

          <div className="pdp__buy">
            <div className="qty qty--lg" aria-label="Quantità">
              <button aria-label="Diminuisci" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button aria-label="Aumenta" onClick={() => setQty((q) => Math.min(10, q + 1))}>+</button>
            </div>
            <Magnetic>
              <button className="btn btn--solid" onClick={() => add(product.slug, codes || undefined, qty)}>
                {product.status === "preorder" ? "Pre-ordina" : "Aggiungi al carrello"}
              </button>
            </Magnetic>
          </div>
          <p className="pdp__lead">{d.leadTime}</p>

          <div className="pdp__accordion">
            {specs.map((i) => (
              <details key={i.t}>
                <summary>{i.t}</summary>
                <p className="body">{i.body}</p>
              </details>
            ))}
          </div>

          <div className="pdp__purchase">
            <p className="eyebrow eyebrow--dark">Acquisto</p>
            <div className="pdp__accordion">
              {purchase.map((i) => (
                <details key={i.t}>
                  <summary>{i.t}</summary>
                  <p className="body">{i.body}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
