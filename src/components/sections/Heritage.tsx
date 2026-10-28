"use client";
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { onReady } from "../Preloader";
import { Lines } from "../Lines";

export function Heritage() {
  const root = useRef<HTMLElement>(null);
  const year = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let ctx: gsap.Context | undefined;
    const off = onReady(() => {
      ctx = gsap.context(() => {
        const n = { v: 1900 };
        gsap.to(n, {
          v: 1984,
          duration: 2.2,
          ease: "expo.out",
          onUpdate: () => {
            if (year.current) year.current.textContent = String(Math.round(n.v));
          },
          scrollTrigger: { trigger: year.current, start: "top 85%" },
        });
      }, root);
    });
    return () => {
      off();
      ctx?.revert();
    };
  }, []);

  return (
    <section id="studio" ref={root} className="section heritage" data-theme="light">
      <div className="container">
        <div className="section__label" data-fade>
          <span>05</span>
          <span>Lo studio</span>
        </div>

        <div className="heritage__grid">
          <div className="heritage__year">
            <span className="heritage__since" data-fade>
              Dal
            </span>
            <span ref={year} className="heritage__num">
              1984
            </span>
            <span className="heritage__place" data-fade>
              Livigno — SO
            </span>
            <p className="body heritage__body" data-fade="0.1">
              Oggi l&apos;attività è guidata dai figli Alex, Nadir ed Emanuele, con una squadra di abili falegnami che segue ogni fase:
              dalla progettazione alla scelta del legno, fino alla rifinitura a mano dei dettagli. Da questa esperienza prende vita un
              nuovo modo di interpretare il legno.
            </p>
          </div>

          <div className="heritage__copy">
            <Lines as="h2" className="display display--dark" lines={["Esperienza artigianale,", <>visione contemporanea.</>]} />
            <p className="lead" data-fade>
              FLOEMA nasce dalla Falegnameria Galli, bottega di paese fondata a Livigno nel 1984 dalle sapienti mani di Giovanbattista
              Galli.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
