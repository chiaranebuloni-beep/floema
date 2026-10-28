import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/pages/PageHero";
import { Footer } from "@/components/Footer";
import { RevealAnimations } from "@/components/RevealAnimations";
import { Lines } from "@/components/Lines";
import { Magnetic } from "@/components/Magnetic";
import { Slideshow } from "@/components/pages/Slideshow";
import { CountUp } from "@/components/CountUp";

export const metadata: Metadata = {
  title: "Studio — FLOEMA Wood Studio",
  description: "FLOEMA nasce dalla Falegnameria Galli di Livigno, bottega artigiana fondata nel 1984.",
};

const TAPPE = [
  { year: "1984", t: "La bottega", d: "Giovanbattista Galli apre a Livigno una piccola bottega artigiana di paese, spinto dalla passione per il legno." },
  { year: "2026", t: "FLOEMA", d: "Nasce FLOEMA Wood Studio: esperienza artigianale, materia naturale e visione contemporanea." },
];

const METODO_FOTO = [
  { src: "/images/metodo-17.jpg", alt: "Dettaglio dell'incastro tra piano e tavola in legno vissuto" },
  { src: "/images/metodo-18.jpg", alt: "Un artigiano rifinisce a mano lo spigolo di una tavola" },
  { src: "/images/metodo-19.jpg", alt: "Taglio di una tavola di legno grezzo in laboratorio" },
  { src: "/images/metodo-20.jpg", alt: "Un artigiano controlla l'incastro della gamba sotto il piano" },
];

const METODO = [
  { t: "Progettazione", d: "Uno studio di proporzioni, inclinazioni e geometrie, con disegni tecnici e simulazioni fotorealistiche." },
  { t: "Scelta del legno", d: "Ogni essenza viene selezionata per carattere, venatura e destinazione d'uso." },
  { t: "Lavorazione", d: "Macchinari a controllo numerico di nuova generazione garantiscono precisione nelle geometrie." },
  { t: "Rifinitura a mano", d: "I dettagli vengono rifiniti a mano: è qui che un'idea diventa oggetto di design." },
];

export default function StudioPage() {
  return (
    <>
      <main>
        <PageHero
          index="01"
          eyebrow="Lo studio"
          lines={["Esperienza artigianale,", "visione contemporanea."]}
          lead="FLOEMA nasce dall'incontro tra la storia di una falegnameria di montagna e un nuovo modo di interpretare il legno."
          image={{ src: "/images/studio-legno-bn.jpg", alt: "Trave di legno antico in bianco e nero, con venature e nodi" }}
        />

        <section className="section studio-story" data-theme="light">
          <div className="container">
            <div className="section__label" data-fade>
              <span>02</span>
              <span>La storia</span>
            </div>
            <ol className="timeline">
              {TAPPE.map((t, i) => (
                <li key={t.year} className="timeline__item" data-fade={String(i * 0.08)}>
                  {/^\d+$/.test(t.year) ? (
                    <CountUp to={Number(t.year)} className="timeline__year" />
                  ) : (
                    <span className="timeline__year timeline__year--text">{t.year}</span>
                  )}
                  <h2 className="timeline__t">{t.t}</h2>
                  <p className="body">{t.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section studio-team" data-theme="dark">
          <div className="container">
            <div className="section__label section__label--light" data-fade>
              <span>03</span>
              <span>Le persone</span>
            </div>
            <Lines as="h2" className="display" lines={["Le mani", "di FLOEMA."]} />
            <figure className="studio-team__img" data-img-reveal>
              <Image
                src="/images/team-falegnameria-panoramica.jpg"
                alt="Il team della Falegnameria Galli in laboratorio, con le magliette FLOEMA"
                fill
                sizes="(max-width: 900px) 92vw, 84vw"
              />
            </figure>
            <p className="studio-team__caption" data-fade>
              Il team della Falegnameria Galli, nel laboratorio di Livigno.
            </p>
          </div>
        </section>

        <section className="section studio-method" data-theme="dark">
          <div className="container studio-method__grid">
            <div className="studio-method__intro">
              <div className="section__label section__label--light" data-fade>
                <span>04</span>
                <span>Il metodo</span>
              </div>
              <Lines as="h2" className="display" lines={["Prima della forma,", "c'è il progetto."]} />
              <figure className="studio-method__img" data-img-reveal>
                <Slideshow slides={METODO_FOTO} sizes="(max-width: 900px) 92vw, 36vw" />
              </figure>
            </div>
            <ol className="steps">
              {METODO.map((m, i) => (
                <li key={m.t} className="step" data-fade={String(i * 0.06)}>
                  <span className="step__n">0{i + 1}</span>
                  <div>
                    <h3 className="step__t">{m.t}</h3>
                    <p className="body body--light">{m.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section studio-pro" data-theme="light">
          <div className="container studio-pro__grid">
            <div>
              <div className="section__label" data-fade>
                <span>05</span>
                <span>Per i professionisti</span>
              </div>
              <Lines as="h2" className="display display--dark" lines={["Architetti e", "interior designer."]} />
            </div>
            <div className="studio-pro__copy">
              <p className="lead" data-fade>
                Progettazione su misura, dal piccolo arredo alle grandi strutture ricettive.
              </p>
              <p className="body" data-fade="0.1">
                Pezzi dal carattere deciso per progetti residenziali, hospitality e retail, con disegni tecnici e simulazioni
                fotorealistiche. Legno, metallo, pietra e vetro come dettagli distintivi.
              </p>
              <div data-fade="0.2">
                <Magnetic>
                  <Link href="/contatti" className="btn btn--solid">
                    Scrivici
                  </Link>
                </Magnetic>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <RevealAnimations />
    </>
  );
}
