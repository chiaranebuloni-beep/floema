"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Foto di lavori reali della Falegnameria Galli (fornite dal cliente), senza didascalie.
const PHOTOS = [
  { src: "/images/progetto-cucina-isola.jpg", w: 733, h: 1100 },
  { src: "/images/progetto-tavolo-finestra.jpg", w: 1648, h: 1100 },
  { src: "/images/progetto-camera-quadro.jpg", w: 826, h: 1100 },
  { src: "/images/progetto-scrittoio-vista.jpg", w: 1426, h: 1100 },
  { src: "/images/progetto-angolo-bollitore.jpg", w: 825, h: 1100 },
  { src: "/images/progetto-bagno-nicchia.jpg", w: 1648, h: 1100 },
  { src: "/images/progetto-tavolo-panca.jpg", w: 733, h: 1100 },
  { src: "/images/progetto-esterno-blockbau.jpg", w: 886, h: 1100 },
];

export function ProjectGallery() {
  const track = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    // Con il mouse la galleria si trascina; su telefono e trackpad scorre da sola.
    let down = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      el.classList.add("is-dragging");
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      el.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      el.classList.remove("is-dragging");
    };
    const onClick = (e: MouseEvent) => {
      if (moved) e.preventDefault();
    };
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("click", onClick, true);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("click", onClick, true);
    };
  }, []);

  return (
    <div className="pgal" data-fade="0.1">
      <div ref={track} className="pgal__track" role="region" aria-label="Alcuni lavori del nostro laboratorio" tabIndex={0}>
        {PHOTOS.map((p) => (
          <div key={p.src} className="pgal__item" style={{ aspectRatio: `${p.w} / ${p.h}` }}>
            <Image src={p.src} alt="" fill sizes="(max-width: 700px) 80vw, 40vw" draggable={false} />
          </div>
        ))}
      </div>
      <div className="pgal__bar" aria-hidden>
        <span style={{ transform: `scaleX(${0.12 + progress * 0.88})` }} />
      </div>
    </div>
  );
}
