"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { onReady } from "../Preloader";
import { Lines } from "../Lines";

export function Etymology() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let ctx: gsap.Context | undefined;
    const off = onReady(() => {
      ctx = gsap.context(() => {
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
      {/* Il nome scritto direttamente sul legno, con una velatura scura sfumata per la leggibilità. */}
      <figure className="etym__bg" aria-hidden>
        <div className="etym__bg-in" data-parallax="8">
          <Image src="/images/manifesto-legno-naturale.jpg" alt="" fill sizes="100vw" />
        </div>
      </figure>
      <div className="container etym__inner">
        <div className="etym__head">
          <div className="section__label section__label--light" data-fade>
            <span>02</span>
            <span>Il nome</span>
          </div>
          <p className="etym__phon" aria-label="flo-e-ma">
          <span>/flo</span>
          <span>·e·</span>
          <span>ma/</span>
        </p>
          <p className="etym__gram" data-fade>
            s.m. — botanica
          </p>
          <Lines as="h2" className="display etym__def" lines={["Tessuto vitale delle piante,", "attraverso cui scorre", <>il nutrimento.</>]} />
        </div>
      </div>
    </section>
  );
}
