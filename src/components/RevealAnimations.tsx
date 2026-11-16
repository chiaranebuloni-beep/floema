"use client";
import { useEffect } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { onReady } from "./Preloader";

// Animazioni condivise, dichiarate nel markup con attributi data-*.
export function RevealAnimations() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let ctx: gsap.Context | undefined;
    const off = onReady(() => {
      ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-lines]:not([data-manual])").forEach((el) => {
          gsap.from(el.querySelectorAll(".mask__in"), {
            yPercent: 110,
            rotate: 2,
            duration: 1,
            ease: "expo.out",
            stagger: 0.06,
            scrollTrigger: { trigger: el, start: "top 95%" },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-fade]").forEach((el) => {
          gsap.from(el, {
            y: 24,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: Number(el.dataset.fade) || 0,
            scrollTrigger: { trigger: el, start: "top 96%" },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-img-reveal]").forEach((el) => {
          const img = el.querySelector("img");
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 95%" } });
          tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "expo.inOut" });
          if (img) tl.from(img, { scale: 1.2, duration: 1.4, ease: "expo.out" }, 0.1);
        });

        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const amount = Number(el.dataset.parallax) || 10;
          gsap.fromTo(
            el,
            { yPercent: -amount },
            { yPercent: amount, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-rule]").forEach((el) => {
          gsap.from(el, { scaleX: 0, transformOrigin: "left", duration: 1.1, ease: "expo.inOut", scrollTrigger: { trigger: el, start: "top 92%" } });
        });
      });
      ScrollTrigger.refresh();
    });
    return () => {
      off();
      ctx?.revert();
    };
  }, []);
  return null;
}
