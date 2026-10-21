"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { LogoSeed } from "./Logo";

declare global {
  interface Window {
    __floemaReady?: boolean;
  }
}

export const READY_EVENT = "floema:ready";

export function onReady(cb: () => void) {
  if (window.__floemaReady) {
    cb();
    return () => {};
  }
  window.addEventListener(READY_EVENT, cb, { once: true });
  return () => window.removeEventListener(READY_EVENT, cb);
}

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const finish = () => {
      window.__floemaReady = true;
      window.dispatchEvent(new Event(READY_EVENT));
      setDone(true);
    };
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    if (prefersReducedMotion()) {
      finish();
      return;
    }
    window.__lenis?.stop();
    const count = { v: 0 };
    const num = root.current!.querySelector(".preloader__count")!;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.inOut" } })
        .from(".preloader__seed", { clipPath: "inset(100% 0 0 0)", duration: 1.1 })
        .to(count, { v: 100, duration: 1.3, ease: "power2.inOut", onUpdate: () => (num.textContent = String(Math.round(count.v)).padStart(3, "0")) }, 0)
        .from(".preloader__line", { scaleX: 0, duration: 1.3 }, 0)
        .to(".preloader__inner", { opacity: 0, y: -20, duration: 0.5 }, "+=0.1")
        .to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "expo.inOut" }, "-=0.2")
        .add(() => {
          window.__lenis?.start();
          finish();
        }, "-=0.55");
    }, root);
    return () => ctx.revert();
  }, []);

  if (done) return null;
  return (
    <div ref={root} className="preloader" aria-hidden>
      <div className="preloader__inner">
        <LogoSeed className="preloader__seed" />
        <div className="preloader__bar">
          <span className="preloader__line" />
        </div>
        <span className="preloader__count">000</span>
      </div>
    </div>
  );
}
