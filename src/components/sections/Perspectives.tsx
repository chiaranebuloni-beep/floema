"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { onReady } from "../Preloader";

const CARDS = [
  { img: "/images/progetto-schizzo.jpg", tag: "Progetto", title: "Prima della forma, c'è il progetto.", text: "Uno studio di proporzioni, inclinazioni e geometrie, dove ogni elemento viene pensato in relazione agli altri." },
  { img: "/images/dettaglio-geometria.jpg", tag: "Geometria", title: "Una linea incontra un'altra.", text: "Le geometrie si intrecciano, la materia trova il proprio equilibrio. Estetica e funzione dialogano." },
  { img: "/images/dettaglio-piano.jpg", tag: "Dettaglio", title: "Il design si rivela nei dettagli.", text: "Nella precisione delle geometrie, nell'incontro tra le superfici, nell'equilibrio tra materia e struttura." },
  { img: "/images/materia-venature.jpg", tag: "Materia", title: "Nessuna venatura è uguale a un'altra.", text: "Ogni nodo, ogni sfumatura, ogni segno racconta la storia di una materia viva." },
  { img: "/images/sgabello-alto.jpg", tag: "Unicità", title: "Una bellezza autentica.", text: "Vista dall'alto, venature, nodi e sfumature rendono ogni superficie unica. La valorizziamo in ogni nostra creazione." },
];

export function Perspectives() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let mm: gsap.MatchMedia | undefined;
    const off = onReady(() => {
      mm = gsap.matchMedia();
      // Scorrimento orizzontale fissato solo su schermi ampi; su mobile resta uno swipe nativo.
      mm.add("(min-width: 900px)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray<HTMLElement>(".persp__card img").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: "none",
              scrollTrigger: { trigger: img.closest(".persp__card"), containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            },
          );
        });
        gsap.to(".persp__progress i", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true },
        });
      });
    });
    return () => {
      off();
      mm?.revert();
    };
  }, []);

  return (
    <section id="materia" ref={root} className="persp" data-theme="light">
      <div className="persp__track" ref={track}>
        <div className="persp__intro">
          <div className="section__label" data-fade>
            <span>03</span>
            <span>Prospettive</span>
          </div>
          <h2 className="display display--dark" data-lines>
            <span className="mask"><span className="mask__in">Ogni prospettiva</span></span>
            <span className="mask"><span className="mask__in">racconta un</span></span>
            <span className="mask"><span className="mask__in">dettaglio diverso.</span></span>
          </h2>
          <p className="body" data-fade>
            Vista dall&apos;alto, la nostra prima creazione rivela la naturale bellezza del legno. Sotto, le geometrie si incontrano in una
            struttura dal carattere deciso.
          </p>
        </div>
        {CARDS.map((c, i) => (
          <article key={c.tag} className="persp__card" data-cursor={c.tag}>
            <div className="persp__img">
              <Image src={c.img} alt={c.title} fill sizes="(max-width: 900px) 78vw, 30vw" />
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
      <div className="persp__progress" aria-hidden>
        <i />
      </div>
    </section>
  );
}
