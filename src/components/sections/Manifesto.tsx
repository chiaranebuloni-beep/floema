"use client";
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { onReady } from "../Preloader";
import Link from "next/link";
import { Magnetic } from "../Magnetic";

const TEXT = "Tutto nasce dalla materia. Dalle sue caratteristiche, dalle sue imperfezioni, dalle possibilità che racchiude.";

export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let ctx: gsap.Context | undefined;
    const off = onReady(() => {
      ctx = gsap.context(() => {
        gsap.fromTo(
          ".manifesto__word",
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: { trigger: ".manifesto__text", start: "top 80%", end: "bottom 45%", scrub: true },
          },
        );
      }, root);
    });
    return () => {
      off();
      ctx?.revert();
    };
  }, []);

  return (
    <section id="manifesto" ref={root} className="section manifesto" data-theme="light">
      <div className="container">
        <div className="section__label" data-fade>
          <span>01</span>
          <span>Manifesto</span>
        </div>
        <p className="manifesto__text">
          {TEXT.split(" ").map((w, i) => (
            <span key={i} className="manifesto__word">
              {w}{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

// Chiusura del manifesto, dopo la sezione «Il nome» sopra il legno.
export function ManifestoCopy() {
  return (
    <section className="section manifesto manifesto--copy" data-theme="light">
      <div className="container manifesto__copy">
        <p className="lead" data-fade>
          Per noi, progettare significa ascoltare il legno, rispettarne la natura e trasformarlo in qualcosa che va oltre la sua funzione.
        </p>
        <div className="manifesto__side">
          <p className="body" data-fade="0.1">
            FLOEMA nasce dall&apos;incontro tra esperienza artigianale, materia naturale e visione contemporanea. Ogni pezzo è progettato
            per durare nel tempo, rispettando la materia e la sua natura.
          </p>
          <ul className="values" data-fade="0.2">
            <li>Essenza</li>
            <li>Forma</li>
            <li>Funzione</li>
          </ul>
          <div className="home-cta" data-fade="0.3">
            <Magnetic>
              <Link href="/materia" className="btn btn--solid">
                Scopri la materia
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
