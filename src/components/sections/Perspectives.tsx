"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const CARDS = [
  { img: "/images/prospettiva-progetto.jpg", alt: "Mano che traccia a matita una linea sul legno", tag: "Progetto", title: "Prima della forma, c'è il progetto.", text: "Uno studio di proporzioni, inclinazioni e geometrie, dove ogni elemento viene pensato in relazione agli altri." },
  { img: "/images/prospettiva-geometria.jpg", alt: "Incastro tra piano e tavola in legno vissuto", tag: "Geometria", title: "Una linea incontra un'altra.", text: "Le geometrie si intrecciano, la materia trova il proprio equilibrio. Estetica e funzione dialogano." },
  { img: "/images/prospettiva-materia.jpg", alt: "Venature e nodi di una tavola di legno vissuto", tag: "Materia", title: "Nessuna venatura è uguale a un'altra.", text: "Ogni nodo, ogni sfumatura, ogni segno racconta la storia di una materia viva." },
];

export function Perspectives() {
  const track = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });
  // Con poche schede che entrano tutte nello schermo, frecce e barra di avanzamento non servono.
  const [scrollable, setScrollable] = useState(true);

  // La galleria scorre solo in orizzontale (frecce, trackpad, swipe): la rotella continua a scendere nella pagina.
  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
    setEdges({ start: el.scrollLeft <= 2, end: el.scrollLeft >= max - 2 });
    setScrollable(max > 2);
  }, []);

  useEffect(() => {
    const el = track.current!;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const go = (dir: 1 | -1) => {
    const el = track.current!;
    const card = el.querySelector<HTMLElement>(".persp__card");
    const step = card ? card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0") : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section id="materia" className="section persp" data-theme="light">
      <div className="container persp__head">
        <div className="persp__intro">
          <div className="section__label" data-fade>
            <span>04</span>
            <span>Prospettive</span>
          </div>
          <h2 className="display display--dark" data-lines>
            <span className="mask"><span className="mask__in">Ogni prospettiva racconta</span></span>
            <span className="mask"><span className="mask__in">un dettaglio diverso.</span></span>
          </h2>
          <p className="body" data-fade>
            Vista dall&apos;alto, la nostra prima creazione rivela la naturale bellezza del legno. Sotto, le geometrie si incontrano in una
            struttura dal carattere deciso.
          </p>
        </div>
        <div className="persp__nav" data-fade hidden={!scrollable}>
          <button className="persp__arrow" onClick={() => go(-1)} disabled={edges.start} aria-label="Scheda precedente">
            <span aria-hidden>←</span>
          </button>
          <button className="persp__arrow" onClick={() => go(1)} disabled={edges.end} aria-label="Scheda successiva">
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>

      <div className="persp__track" ref={track} tabIndex={0} aria-label="Galleria prospettive">
        {CARDS.map((c, i) => (
          <article key={c.tag} className="persp__card">
            <div className="persp__img">
              <Image src={c.img} alt={c.alt} fill sizes="(max-width: 900px) 78vw, 30vw" />
            </div>
            <div className="persp__meta">
              <span>0{i + 1}</span>
              <span>{c.tag}</span>
            </div>
            <h3 className="persp__title">{c.title}</h3>
            <p className="body">{c.text}</p>
          </article>
        ))}
      </div>

      <div className="container">
        <div className="persp__progress" aria-hidden hidden={!scrollable}>
          <i style={{ transform: `scaleX(${0.12 + progress * 0.88})` }} />
        </div>
      </div>
    </section>
  );
}
