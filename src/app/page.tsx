import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { ProductChapter } from "@/components/sections/ProductChapter";
import { Perspectives } from "@/components/sections/Perspectives";
import { Marquee } from "@/components/sections/Marquee";
import { Etymology } from "@/components/sections/Etymology";
import { Heritage } from "@/components/sections/Heritage";
import { Architects } from "@/components/sections/Architects";
import { Newsletter } from "@/components/sections/Newsletter";
import { Footer } from "@/components/Footer";
import { RevealAnimations } from "@/components/RevealAnimations";

// Prezzo e disponibilità vengono riletti dal catalogo al massimo ogni minuto.
export const revalidate = 60;

export default async function Home() {
  const product = await getProduct("sgabello-01");
  if (!product) notFound();

  return (
    <>
      <main>
        <Hero />
        <Manifesto />
        <ProductChapter product={product} />
        <Perspectives />
        <Marquee />
        <Etymology />
        <Heritage />
        <Architects />
        <Newsletter />
      </main>
      <Footer />
      <RevealAnimations />
    </>
  );
}
