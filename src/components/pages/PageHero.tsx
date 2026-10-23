"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { onReady } from "../Preloader";

type Props = {
  index: string;
  eyebrow: string;
  lines: string[];
  lead?: string;
  image?: { src: string; alt: string };
};

// Apertura delle pagine interne: stesso linguaggio della hero in home, più compatta.
export function PageHero({ index, eyebrow, lines, lead, image }: Props) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.set(".phero .mask__in", { yPercent: 110 });
      gsap.set(".phero [data-phero-fade]", { opacity: 0, y: 20 });
      if (image) gsap.set(".phero__media", { scale: 1.2 });
    }, root);
    const off = onReady(() => {
      ctx.add(() => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        if (image) tl.to(".phero__media", { scale: 1, duration: 2.4 }, 0);
        tl.to(".phero .mask__in", { yPercent: 0, duration: 1.4, stagger: 0.08 }, 0.2).to(
          ".phero [data-phero-fade]",
          { opacity: 1, y: 0, duration: 1.1, stagger: 0.1 },
          0.5,
        );
        if (image)
          gsap.to(".phero__media-inner", {
            yPercent: 16,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
          });
      });
    });
    return () => {
      off();
      ctx.revert();
    };
  }, [image]);

  return (
    <section ref={root} className={`phero ${image ? "" : "phero--plain"}`} data-theme="dark">
      {image && (
        <>
          <div className="phero__media">
            <div className="phero__media-inner">
              <Image src={image.src} alt={image.alt} fill priority sizes="100vw" />
            </div>
          </div>
          <div className="phero__veil" />
        </>
      )}
      <div className="container phero__inner">
        <div className="section__label section__label--light" data-phero-fade>
          <span>{index}</span>
          <span>{eyebrow}</span>
        </div>
        <h1 className="phero__title">
          {lines.map((l, i) => (
            <span key={i} className="mask">
              <span className="mask__in">{l}</span>
            </span>
          ))}
        </h1>
        {lead && (
          <p className="lead lead--light phero__lead" data-phero-fade>
            {lead}
          </p>
        )}
      </div>
    </section>
  );
}
