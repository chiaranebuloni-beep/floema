"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { LogoMark, LogoWord } from "./Logo";
import { useCart } from "./cart/CartProvider";
import { onReady } from "./Preloader";

const NAV = [
  { href: "#creazione", label: "Collezione" },
  { href: "#materia", label: "Materia" },
  { href: "#studio", label: "Studio" },
  { href: "#architetti", label: "Architetti" },
  { href: "#contatti", label: "Contatti" },
];

export function Header() {
  const { count, setOpen } = useCart();
  const [menu, setMenu] = useState(false);
  const [light, setLight] = useState(false);
  const [hidden, setHidden] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const off = onReady(() => {
      gsap.fromTo(ref.current, { yPercent: -100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.2, ease: "expo.out", delay: 0.5 });
    });

    // Il colore dell'header segue il tema della sezione sotto di esso.
    const triggers = Array.from(document.querySelectorAll<HTMLElement>("[data-theme]")).map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 40px",
        end: "bottom 40px",
        onToggle: (self) => self.isActive && setLight(el.dataset.theme === "light"),
      }),
    );
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 200 && y > last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      off();
      triggers.forEach((t) => t.kill());
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (menu) window.__lenis?.stop();
    else window.__lenis?.start();
    document.documentElement.classList.toggle("menu-open", menu);
  }, [menu]);

  return (
    <>
      <header
        ref={ref}
        className={`header ${light && !menu ? "header--light" : ""} ${hidden && !menu ? "header--hidden" : ""}`}
      >
        <a href="#top" className="header__logo" aria-label="FLOEMA Wood Studio, torna all'inizio">
          <LogoMark className="header__mark" />
          <LogoWord className="header__word" />
        </a>
        <nav className="header__nav" aria-label="Principale">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="link-roll">
              <span data-text={n.label}>{n.label}</span>
            </a>
          ))}
        </nav>
        <div className="header__actions">
          <button className="header__cart link-roll" onClick={() => setOpen(true)}>
            <span data-text={`Carrello (${count})`}>Carrello ({count})</span>
          </button>
          <button
            className={`burger ${menu ? "is-open" : ""}`}
            aria-label={menu ? "Chiudi menu" : "Apri menu"}
            aria-expanded={menu}
            onClick={() => setMenu((m) => !m)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`menu ${menu ? "is-open" : ""}`} aria-hidden={!menu}>
        <nav className="menu__nav" aria-label="Menu mobile">
          {NAV.map((n, i) => (
            <a key={n.href} href={n.href} onClick={() => setMenu(false)} style={{ transitionDelay: `${0.1 + i * 0.06}s` }} tabIndex={menu ? 0 : -1}>
              <span className="menu__idx">0{i + 1}</span>
              {n.label}
            </a>
          ))}
        </nav>
        <p className="menu__foot">Livigno · Valtellina · dal 1984</p>
      </div>
    </>
  );
}
