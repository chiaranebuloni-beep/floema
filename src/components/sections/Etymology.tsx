"use client";
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { LogoSeed } from "../Logo";
import { onReady } from "../Preloader";
import { Lines } from "../Lines";

export function Etymology() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let ctx: gsap.Context | undefined;
    const off = onReady(() => {
      ctx = gsap.context(() => {
        gsap.fromTo(
          ".etym__seed",
          { yPercent: 15, rotate: -8, scale: 0.9 },
          { yPercent: -15, rotate: 8, scale: 1.05, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
        gsap.from(".etym__phon span", {
          opacity: 0,
          y: 30,
          filter: "blur(8px)",
          stagger: 0.12,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: { trigger: ".etym__phon", start: "top 85%" },
        });
      }, root);
    });
    return () => {
      off();
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={root} className="section etym" data-theme="dark">
      <LogoSeed className="etym__seed" />
      <div className="container etym__inner">
        <div className="section__label section__label--light" data-fade>
          <span>04</span>
          <span>Il nome</span>
        </div>
        <p className="etym__phon" aria-label="flo-è-ma">
          <span>/flo</span>
          <span>·è·</span>
          <span>ma/</span>
        </p>
        <p className="etym__gram" data-fade>
          s.m. — botanica
        </p>
        <Lines as="h2" className="display etym__def" lines={["Tessuto vitale delle piante,", "attraverso cui scorre", "il nutrimento."]} />
        <div className="etym__cols">
          <p className="body body--light" data-fade>
            In botanica, il floema è il tessuto attraverso cui le piante trasportano le sostanze nutritive necessarie alla loro crescita. Un
            elemento vitale, che custodisce il legame tra le diverse parti della pianta.
          </p>
          <p className="body body--light" data-fade="0.1">
            Abbiamo scelto questo nome perché racchiude ciò che ci ispira: la natura, la materia e la capacità di trasformarle in nuove
            forme. <strong>Dalla natura, l&apos;essenza del nostro design.</strong>
          </p>
        </div>
      </div>
    </section>
  );
}
