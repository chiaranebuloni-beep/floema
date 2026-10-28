import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/pages/PageHero";
import { Footer } from "@/components/Footer";
import { RevealAnimations } from "@/components/RevealAnimations";
import { Lines } from "@/components/Lines";

export const metadata: Metadata = {
  title: "Materia — FLOEMA Wood Studio",
  description: "Le essenze, le lavorazioni e i toni del legno con cui nasce ogni creazione FLOEMA.",
};

// Essenze e toni indicati dal cliente (ottobre 2026); lavorazioni dal catalogo materiali della Falegnameria Galli.
const ESSENZE = [
  { name: "Legno antico", note: "Bruno caldo e miele scuro, con sfumature dal dorato intenso al grigiastro" },
  { name: "Rovere", note: "Marrone chiaro, color nocciola o miele" },
  { name: "Cirmolo", note: "Dal bianco-giallastro al miele rossiccio" },
  { name: "Abete", note: "Laccato o bruciato, nero intenso" },
];

const LAVORAZIONI = ["Effetto asciato", "Piallato a mano", "Piano sega", "Spazzolato", "Incisioni e lavorazioni 3D"];

export default function MateriaPage() {
  return (
    <>
      <main>
        <PageHero
          index="01"
          eyebrow="Materia"
          lines={["Tutto nasce", "dalla materia."]}
          lead="Dalle sue caratteristiche, dalle sue imperfezioni, dalle possibilità che racchiude."
          image={{ src: "/images/manifesto-legno-naturale.jpg", alt: "Superficie di legno con anelli di crescita e venature" }}
        />

        <section className="section mat-intro" data-theme="light">
          <div className="container mat-intro__grid">
            <Lines as="h2" className="display display--dark" lines={["Nessuna venatura segue", "lo stesso percorso."]} />
            <div className="mat-intro__copy">
              <p className="lead" data-fade>
                Ogni nodo, ogni sfumatura, ogni segno racconta la storia di una materia viva.
              </p>
              <p className="body" data-fade="0.1">
                È questa unicità a rendere il legno così affascinante: una bellezza autentica, che scegliamo di valorizzare in ogni nostra
                creazione. Per noi progettare significa ascoltare il legno, rispettarne la natura e trasformarlo in qualcosa che va oltre
                la sua funzione.
              </p>
            </div>
          </div>
          <div className="container mat-duo">
            <figure className="mat-duo__img" data-img-reveal>
              <Image src="/images/materia-venature.jpg" alt="Venature di legno antico in luce radente" fill sizes="(max-width: 900px) 92vw, 44vw" />
            </figure>
            <figure className="mat-duo__img mat-duo__img--low" data-img-reveal>
              <Image src="/images/dettaglio-piano.jpg" alt="Nodi e venature sul piano dello sgabello" fill sizes="(max-width: 900px) 92vw, 44vw" />
            </figure>
          </div>
        </section>

        <section className="section mat-list" data-theme="dark">
          <div className="container">
            <div className="section__label section__label--light" data-fade>
              <span>02</span>
              <span>Le essenze</span>
            </div>
            <ul className="mat-rows">
              {ESSENZE.map((e, i) => (
                <li key={e.name} className="mat-row" data-fade={String(i * 0.04)}>
                  <span className="mat-row__n">0{i + 1}</span>
                  <span className="mat-row__name">{e.name}</span>
                  <span className="mat-row__note">{e.note}</span>
                </li>
              ))}
            </ul>

            <div className="mat-craft">
              <div className="section__label section__label--light" data-fade>
                <span>03</span>
                <span>Le lavorazioni</span>
              </div>
              <ul className="mat-tags" data-fade>
                {LAVORAZIONI.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <RevealAnimations />
    </>
  );
}
