"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

type Slide = { src: string; alt: string };

// Immagini in dissolvenza una dopo l'altra; con «riduci movimento» attivo restano ferme sulla prima.
export function Slideshow({ slides, interval = 4500, sizes }: { slides: Slide[]; interval?: number; sizes: string }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setCurrent((i) => (i + 1) % slides.length), interval);
    return () => window.clearInterval(id);
  }, [slides.length, interval, current]);

  return (
    <>
      {slides.map((s, i) => (
        <Image key={s.src} src={s.src} alt={s.alt} fill sizes={sizes} className={`slideshow__img ${i === current ? "is-active" : ""}`} aria-hidden={i !== current} />
      ))}
      <div className="slideshow__dots" role="tablist" aria-label="Immagini del metodo">
        {slides.map((s, i) => (
          <button key={s.src} role="tab" aria-selected={i === current} aria-label={`Immagine ${i + 1} di ${slides.length}`} className={i === current ? "is-active" : ""} onClick={() => setCurrent(i)}>
            <span style={i === current ? { animationDuration: `${interval}ms` } : undefined} />
          </button>
        ))}
      </div>
    </>
  );
}
