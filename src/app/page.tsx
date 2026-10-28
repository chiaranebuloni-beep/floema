import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";
import { Hero } from "@/components/sections/Hero";
import { Manifesto, ManifestoCopy } from "@/components/sections/Manifesto";
import { ProductChapter } from "@/components/sections/ProductChapter";
import { Etymology } from "@/components/sections/Etymology";
import { Heritage } from "@/components/sections/Heritage";
import { Architects } from "@/components/sections/Architects";
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
        <Etymology />
        <ManifestoCopy />
        <ProductChapter product={product} />
        <Heritage />
        <Architects />
      </main>
      <Footer />
      <RevealAnimations />
    </>
  );
}
