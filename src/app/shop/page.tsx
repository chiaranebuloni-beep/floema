import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/products";
import { PageHero } from "@/components/pages/PageHero";
import { ProductDetail } from "@/components/pages/ProductDetail";
import { Footer } from "@/components/Footer";
import { RevealAnimations } from "@/components/RevealAnimations";
import { Lines } from "@/components/Lines";

export const metadata: Metadata = {
  title: "Shop — FLOEMA Wood Studio",
  description: "FLOEMA 01: sgabello in legno massello realizzato a mano a Livigno, anche tavolino d'appoggio. Scegli la colorazione.",
};

export const revalidate = 60;

// Con un solo prodotto, lo shop è direttamente la sua pagina prodotto.
export default async function ShopPage() {
  const [product] = await getProducts();
  if (!product) notFound();

  return (
    <>
      <main>
        <PageHero
          index="01"
          eyebrow="Shop"
          lines={["La collezione,", "un capitolo alla volta."]}
          lead="Oggetti in legno massello dal carattere scultoreo, pensati per durare nel tempo e adattarsi a spazi e interpretazioni differenti."
          image={{ src: "/images/shop-legno-scuro.jpg", alt: "Superficie di legno antico scuro con crepe e venature" }}
        />

        <ProductDetail product={product} />

        <section className="section shop-info" data-theme="dark">
          <div className="container shop-info__grid">
            <Lines as="h2" className="display" lines={["Un oggetto,", "molteplici possibilità."]} />
            <ul className="shop-info__list">
              <li data-fade>
                <span>Materia</span>
                Legno massello: venature, nodi e sfumature rendono ogni superficie unica.
              </li>
              <li data-fade="0.05">
                <span>Lavorazione</span>
                Progettato e realizzato a mano a Livigno, rifinito nei dettagli.
              </li>
              <li data-fade="0.1">
                <span>Utilizzo</span>
                Sgabello o tavolino d&apos;appoggio, mantenendo sempre la propria identità.
              </li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
      <RevealAnimations />
    </>
  );
}
