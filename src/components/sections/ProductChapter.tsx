"use client";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import { Lines } from "../Lines";
import { Magnetic } from "../Magnetic";

export function ProductChapter({ product }: { product: Product }) {
  const cover = product.modes[0];

  return (
    <section id="creazione" className="section chapter" data-theme="dark">
      <div className="container chapter__grid">
        <figure className="chapter__stage" data-img-reveal>
          <Image src={cover.image} alt={`${product.name}, sgabello in legno massello`} fill sizes="(max-width: 900px) 92vw, 50vw" />
          <span className="chapter__badge">{product.chapter}</span>
        </figure>

        <div className="chapter__info">
          <div className="section__label section__label--light" data-fade>
            <span>02</span>
            <span>La prima creazione</span>
          </div>
          <Lines as="h2" className="display" lines={["Il primo capitolo", <>prende forma.</>]} />
          <p className="lead lead--light" data-fade>
            {product.description}
          </p>

          <dl className="specs" data-fade>
            <div>
              <dt>Materiale</dt>
              <dd>{product.material}</dd>
            </div>
            {product.dimensions && (
              <div>
                <dt>Dimensioni</dt>
                <dd>{product.dimensions}</dd>
              </div>
            )}
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
              <Link href="/shop" className="btn btn--light">
                {product.status === "preorder" ? "Pre-ordina" : "Aggiungi al carrello"}
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
