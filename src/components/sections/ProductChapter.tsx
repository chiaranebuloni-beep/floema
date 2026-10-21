"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useCart } from "../cart/CartProvider";
import { Lines } from "../Lines";
import { Magnetic } from "../Magnetic";

export function ProductChapter({ product }: { product: Product }) {
  const { add } = useCart();
  const [active, setActive] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const mode = product.modes[active];

  // Transizione a tenda tra la versione sgabello e la versione tavolino.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (prefersReducedMotion()) return;
    const el = stage.current!;
    const incoming = el.querySelector(`[data-mode="${active}"]`);
    const text = document.querySelectorAll(".chapter__mode-anim");
    gsap.fromTo(incoming, { clipPath: "inset(0 0 0 100%)" }, { clipPath: "inset(0 0 0 0%)", duration: 1.2, ease: "expo.inOut" });
    gsap.fromTo(incoming!.querySelector("img"), { scale: 1.2 }, { scale: 1, duration: 1.6, ease: "expo.out" });
    gsap.fromTo(text, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.06, ease: "power3.out" });
  }, [active]);

  return (
    <section id="creazione" className="section chapter" data-theme="dark">
      <div className="container chapter__grid">
        <div className="chapter__stage" ref={stage} data-img-reveal data-cursor={product.modes[(active + 1) % product.modes.length].label}>
          {product.modes.map((m, i) => (
            <button
              key={m.id}
              type="button"
              data-mode={i}
              className={`chapter__frame ${i === active ? "is-active" : ""}`}
              onClick={() => setActive((active + 1) % product.modes.length)}
              aria-label={`Mostra versione ${product.modes[(active + 1) % product.modes.length].label}`}
              tabIndex={i === active ? 0 : -1}
            >
              <Image src={m.image} alt={`${product.name} in versione ${m.title.toLowerCase()}`} fill sizes="(max-width: 900px) 92vw, 50vw" />
            </button>
          ))}
          <span className="chapter__badge">{product.chapter}</span>
        </div>

        <div className="chapter__info">
          <div className="section__label section__label--light" data-fade>
            <span>02</span>
            <span>La prima creazione</span>
          </div>
          <Lines as="h2" className="display" lines={["Il primo capitolo", "prende forma."]} />
          <p className="lead lead--light" data-fade>
            {product.description}
          </p>

          <div className="toggle" role="tablist" aria-label="Versione" data-fade>
            {product.modes.map((m, i) => (
              <button key={m.id} role="tab" aria-selected={i === active} className={i === active ? "is-active" : ""} onClick={() => setActive(i)}>
                {m.label}
              </button>
            ))}
            <span className="toggle__pill" style={{ transform: `translateX(${active * 100}%)` }} />
          </div>

          <div className="chapter__mode" aria-live="polite">
            <p className="chapter__mode-title chapter__mode-anim">{mode.title}</p>
            <p className="body body--light chapter__mode-anim">{mode.text}</p>
          </div>

          <dl className="specs" data-fade>
            <div>
              <dt>Materiale</dt>
              <dd>{product.material}</dd>
            </div>
            <div>
              <dt>Lavorazione</dt>
              <dd>{product.origin}</dd>
            </div>
            <div>
              <dt>Utilizzo</dt>
              <dd>{product.modes.map((m) => m.title).join(" · ")}</dd>
            </div>
          </dl>

          <div className="chapter__buy" data-fade>
            <div>
              <p className="chapter__name">{product.name}</p>
              <p className="chapter__price">{formatPrice(product.price)}</p>
            </div>
            <Magnetic>
              <button className="btn btn--light" onClick={() => add(product.slug)}>
                {product.status === "preorder" ? "Pre-ordina" : "Aggiungi al carrello"}
              </button>
            </Magnetic>
          </div>
          <p className="chapter__note">{product.tagline}</p>
        </div>
      </div>
    </section>
  );
}
