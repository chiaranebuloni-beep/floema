import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/pages/PageHero";
import { Footer } from "@/components/Footer";
import { RevealAnimations } from "@/components/RevealAnimations";
import { Lines } from "@/components/Lines";
import { ReelVideo } from "@/components/ReelVideo";

export const metadata: Metadata = {
  title: "Materia — FLOEMA Wood Studio",
  description: "Le essenze, le lavorazioni e i toni del legno con cui nasce ogni creazione FLOEMA.",
};

// Essenze e toni indicati dal cliente (ottobre 2026); lavorazioni dal catalogo materiali della Falegnameria Galli.
// Foto delle essenze fornite dal cliente (16 novembre 2026).
const ESSENZE = [
  { name: "Legno antico", note: "Bruno caldo e miele scuro, con sfumature dal dorato intenso al grigiastro", img: "/images/essenza-legno-antico-v3.jpg" },
  { name: "Rovere", note: "Marrone chiaro, color nocciola o miele", img: "/images/essenza-rovere-v3.jpg" },
  { name: "Cirmolo", note: "Dal bianco-giallastro al miele rossiccio", img: "/images/essenza-cirmolo-v3.jpg" },
  { name: "Abete", note: "Laccato o bruciato, nero intenso", img: "/images/essenza-abete-v3.jpg" },
];

const LAVORAZIONI = [
  { t: "Spazzolato", d: "La spazzolatura toglie le fibre più tenere e lascia in rilievo la venatura: il legno si riconosce anche al tatto." },
  { t: "Verniciato", d: "Una finitura protettiva, data in laboratorio, che difende il legno nell'uso di ogni giorno senza coprirne il disegno." },
];

export default function MateriaPage() {
  return (
    <>
      <main>
        <PageHero
          index="01"
          eyebrow="Materia"
          lines={["Scelto a mano,", "lavorato con rispetto."]}
          lead="Legno antico, rovere, cirmolo e abete: essenze selezionate una a una, per lasciar parlare venature, nodi e sfumature."
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
                creazione.
              </p>
            </div>
          </div>
          <div className="container mat-duo">
            <figure className="mat-duo__img" data-img-reveal>
              <Image src="/images/materia-venature.jpg" alt="Venature di legno antico in luce radente" fill sizes="(max-width: 900px) 92vw, 44vw" />
            </figure>
            <figure className="mat-duo__img mat-duo__img--low" data-img-reveal>
              <Image src="/images/dettaglio-spigolo.jpg" alt="Spigolo dello sgabello con gamba in legno scuro" fill sizes="(max-width: 900px) 92vw, 44vw" />
            </figure>
          </div>
        </section>

        <section className="section mat-list" data-theme="dark">
          <div className="container">
            <ul className="mat-rows">
              {ESSENZE.map((e, i) => (
                <li key={e.name} className="mat-row" data-fade={String(i * 0.04)}>
                  <span className="mat-row__n">0{i + 1}</span>
                  <h3 className="mat-row__name">{e.name}</h3>
                  <p className="mat-row__note">{e.note}</p>
                  <figure className="mat-row__img">
                    <Image src={e.img} alt={`Venature del legno: ${e.name.toLowerCase()}`} fill sizes="(max-width: 900px) 64px, 120px" />
                  </figure>
                </li>
              ))}
            </ul>

          </div>
        </section>

        {/* Le lavorazioni: sezione a parte su fondo sabbia. */}
        <section className="section mat-craft-sec" data-theme="light">
          <div className="container">
            <div className="mat-craft">
              <div className="mat-craft__text">
                <Lines as="h2" className="display display--dark" lines={["La superficie,", "finita a mano."]} />
                <ol className="steps mat-craft__steps">
                  {LAVORAZIONI.map((l, i) => (
                    <li key={l.t} className="step" data-fade={String(i * 0.06)}>
                      <span className="step__n">0{i + 1}</span>
                      <div>
                        <h3 className="step__t">{l.t}</h3>
                        <p className="body">{l.d}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="mat-craft__reelcell">
              <figure className="mat-craft__reel" data-img-reveal>
                <ReelVideo
                  src="/video/floema-legno-antico.mp4"
                  poster="/video/floema-legno-antico.jpg"
                  label="Lavorazione di un piano in legno antico in laboratorio"
                />
              </figure>
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
