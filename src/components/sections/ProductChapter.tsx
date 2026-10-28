"use client";
import Image from "next/image";
import type { Product } from "@/lib/types";
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
            <span>03</span>
            <span>La prima creazione</span>
          </div>
          <Lines as="h2" className="display" lines={["Il primo capitolo", <>prende forma.</>]} />
          <p className="lead lead--light" data-fade>
            {product.description}
          </p>

          {/* Solo i titoli: il dettaglio si apre al clic, come nelle tendine della pagina Shop. */}
          <div className="pdp__accordion pdp__accordion--light" data-fade>
            {product.dimensions && (
              <details>
                <summary>Dimensioni</summary>
                <p className="body body--light">{product.dimensions}</p>
              </details>
            )}
            <details>
              <summary>Lavorazione</summary>
              <p className="body body--light">{product.origin}</p>
            </details>
            <details>
              <summary>Utilizzo</summary>
              <p className="body body--light">{product.modes.map((m) => m.title).join(" · ")}</p>
            </details>
          </div>

          <div className="chapter__buy" data-fade>
            <Magnetic>
              <Link href="/shop" className="btn btn--light">
                Scopri lo sgabello
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
