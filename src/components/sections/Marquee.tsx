"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { LogoMark } from "../Logo";

const WORDS = ["Essenza", "Forma", "Funzione", "Materia", "Equilibrio"];

export function Marquee() {
  const row = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = row.current!;
    const loop = gsap.to(el, { xPercent: -50, duration: 40, ease: "none", repeat: -1 });
    // La velocità di scroll accelera e inclina il nastro.
    const skew = gsap.quickTo(el, "skewX", { duration: 0.5, ease: "power3" });
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const v = self.getVelocity();
        loop.timeScale(1 + Math.min(Math.abs(v) / 300, 6) * (v < 0 ? -1 : 1));
        skew(gsap.utils.clamp(-8, 8, v / -300));
      },
    });
    const settle = setInterval(() => {
      if (Math.abs(loop.timeScale()) > 1.01) gsap.to(loop, { timeScale: 1, duration: 1 });
    }, 300);
    return () => {
      loop.kill();
      st.kill();
      clearInterval(settle);
    };
  }, []);

  const items = [...WORDS, ...WORDS];
  return (
    <div className="marquee" data-theme="dark" aria-hidden>
      <div className="marquee__row" ref={row}>
        {[0, 1].map((k) => (
          <div className="marquee__set" key={k}>
            {items.map((w, i) => (
              <span key={i} className="marquee__item">
                {w}
                <LogoMark className="marquee__mark" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
