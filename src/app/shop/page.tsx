import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/products";
import { PageHero } from "@/components/pages/PageHero";
import { ProductDetail } from "@/components/pages/ProductDetail";
import { Footer } from "@/components/Footer";
import { RevealAnimations } from "@/components/RevealAnimations";
import { Lines } from "@/components/Lines";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shop — FLOEMA Wood Studio",
  description: "FLOEMA 01: sgabello in legno massello realizzato a mano a Livigno, anche tavolino d'appoggio e comodino. Scegli la colorazione.",
};

export const revalidate = 60;

const AVAILABILITY = {
  available: "https://schema.org/InStock",
  preorder: "https://schema.org/PreOrder",
  soldout: "https://schema.org/OutOfStock",
} as const;

// Con un solo prodotto, lo shop è direttamente la sua pagina prodotto.
export default async function ShopPage() {
  const [product] = await getProducts();
  if (!product) notFound();

  // Dati strutturati per Google: nome, foto, prezzo e disponibilità del prodotto nei risultati di ricerca.
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((i) => `${SITE_URL}${i.src}`),
    brand: { "@type": "Brand", name: "FLOEMA Wood Studio" },
    material: product.material,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/shop`,
      price: product.price,
      priceCurrency: "EUR",
      availability: AVAILABILITY[product.status as keyof typeof AVAILABILITY] ?? AVAILABILITY.available,
    },
  };

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

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
        <ProductDetail product={product} />

        <section className="section shop-info" data-theme="dark">
          <div className="container shop-info__grid">
            <Lines as="h2" className="display" lines={["Un oggetto,", "molteplici possibilità."]} />
            <ul className="shop-info__list">
              <li data-fade>
                <span>Utilizzo</span>
                Sgabello quando serve una seduta in più, tavolino d&apos;appoggio accanto al divano, comodino vicino al letto. Un solo
                oggetto che si sposta da una stanza all&apos;altra e si adatta agli spazi e ai momenti della giornata, mantenendo
                sempre la propria identità.
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
