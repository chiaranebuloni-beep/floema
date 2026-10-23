"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// Cursore personalizzato solo su dispositivi con puntatore preciso.
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = dot.current!;
    document.documentElement.classList.add("has-cursor");
    const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });

    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      el.classList.toggle("is-hover", !!(e.target as HTMLElement).closest("a, button"));
    };
    const leave = () => el.classList.add("is-hidden");
    const enter = () => el.classList.remove("is-hidden");
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    document.addEventListener("pointerenter", enter);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerenter", enter);
    };
  }, []);

  return (
    <div ref={dot} className="cursor" aria-hidden />
  );
}
