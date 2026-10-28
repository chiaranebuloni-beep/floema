"use client";
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { onReady } from "./Preloader";

// Numero che scorre fino al valore finale quando entra nello schermo, come l'anno 1984 in home.
export function CountUp({ to, from = 1900, className }: { to: number; from?: number; className?: string }) {
  const el = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let tween: gsap.core.Tween | undefined;
    const off = onReady(() => {
      const n = { v: from };
      tween = gsap.to(n, {
        v: to,
        duration: 2.2,
        ease: "expo.out",
        onUpdate: () => {
          if (el.current) el.current.textContent = String(Math.round(n.v));
        },
        scrollTrigger: { trigger: el.current, start: "top 85%" },
      });
    });
    return () => {
      off();
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, [from, to]);

  return (
    <span ref={el} className={className}>
      {to}
    </span>
  );
}
