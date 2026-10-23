"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { LogoWord } from "../Logo";
import { onReady } from "../Preloader";
import { Magnetic } from "../Magnetic";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let ctx: gsap.Context | undefined;
    // Stato iniziale impostato subito, così nulla lampeggia prima del preloader.
    ctx = gsap.context(() => {
      gsap.set(".hero__word path", { yPercent: 120 });
      gsap.set(".hero__media", { scale: 1.3 });
      gsap.set(".hero [data-hero-fade]", { opacity: 0, y: 24 });
      gsap.set(".hero .mask__in", { yPercent: 110 });
    }, root);

    const off = onReady(() => {
      ctx?.add(() => {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .to(".hero__media", { scale: 1, duration: 2.6 }, 0)
          .to(".hero__word path", { yPercent: 0, duration: 1.8, stagger: 0.07 }, 0.15)
          .to(".hero .mask__in", { yPercent: 0, duration: 1.4, stagger: 0.08 }, 0.6)
          .to(".hero [data-hero-fade]", { opacity: 1, y: 0, duration: 1.2, stagger: 0.1 }, 0.9);

        gsap.to(".hero__media-inner", {
          yPercent: 18,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".hero__inner", {
          yPercent: -12,
          opacity: 0.2,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
    });
    return () => {
      off();
      ctx?.revert();
    };
  }, []);

  return (
    <section id="top" ref={root} className="hero" data-theme="dark">
      <div className="hero__media">
        <div className="hero__media-inner">
          <Image src="/images/hero-spigolo.jpg" alt="Spigolo in legno massello illuminato da luce radente" fill priority sizes="100vw" />
        </div>
      </div>
      <div className="hero__veil" />

      <div className="hero__inner">
        {/* Titolo e pulsante sulla stessa riga, centrati tra loro in verticale. */}
        <div className="hero__row">
          <h1 className="hero__claim" data-lines data-manual>
            <span className="mask"><span className="mask__in">Dalla natura,</span></span>
            <span className="mask"><span className="mask__in">l&apos;essenza del design.</span></span>
          </h1>
          <div data-hero-fade>
            <Magnetic>
              <a href="#creazione" className="btn btn--ghost-light">
                Scopri la prima creazione
              </a>
            </Magnetic>
          </div>
        </div>

        <h2 className="hero__word-wrap" aria-label="FLOEMA">
          <LogoWord className="hero__word" />
        </h2>
      </div>
    </section>
  );
}
