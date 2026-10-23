"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { LogoMark, LogoWord } from "./Logo";
import { useCart } from "./cart/CartProvider";
import { onReady } from "./Preloader";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/materia", label: "Materia" },
  { href: "/studio", label: "Studio" },
  { href: "/contatti", label: "Contatti" },
];

export function Header() {
  const { count, setOpen } = useCart();
  const [menu, setMenu] = useState(false);
  const [light, setLight] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    return onReady(() => {
      gsap.fromTo(ref.current, { yPercent: -100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.2, ease: "expo.out", delay: 0.5 });
    });
  }, []);

  useEffect(() => {
    setMenu(false);
    // Il colore dell'header segue il tema della sezione sotto di esso.
    const triggers = Array.from(document.querySelectorAll<HTMLElement>("[data-theme]")).map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 40px",
        end: "bottom 40px",
        onToggle: (self) => self.isActive && setLight(el.dataset.theme === "light"),
      }),
    );
    // Al cambio pagina il tema va letto subito dalla sezione sotto la barra.
    const current = triggers.find((t) => t.isActive);
    setLight(current ? (current.trigger as HTMLElement).dataset.theme === "light" : false);
    // La barra resta sempre visibile; scendendo prende uno sfondo per restare leggibile.
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      triggers.forEach((t) => t.kill());
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    if (menu) window.__lenis?.stop();
    else window.__lenis?.start();
    document.documentElement.classList.toggle("menu-open", menu);
  }, [menu]);

  return (
    <>
      <header
        ref={ref}
        className={`header ${light && !menu ? "header--light" : ""} ${scrolled && !menu ? "header--scrolled" : ""}`}
      >
        <Link href="/" className="header__logo" aria-label="FLOEMA Wood Studio, home">
          <LogoMark className="header__mark" />
          <LogoWord className="header__word" />
        </Link>
        <nav className="header__nav" aria-label="Principale">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={`link-roll ${pathname === n.href ? "is-active" : ""}`}>
              <span data-text={n.label}>{n.label}</span>
            </Link>
          ))}
        </nav>
        <div className="header__actions">
          <button className="header__cart" onClick={() => setOpen(true)} aria-label={`Apri il carrello, ${count} articoli`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M2.5 3.5h2.2l2.3 11.2a1.5 1.5 0 0 0 1.5 1.2h9.1a1.5 1.5 0 0 0 1.5-1.1l1.6-6.8H6" />
              <circle cx="9.5" cy="20" r="1.2" />
              <circle cx="17" cy="20" r="1.2" />
            </svg>
            {count > 0 && <span className="header__count">{count}</span>}
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
            <Link key={n.href} href={n.href} onClick={() => setMenu(false)} style={{ transitionDelay: `${0.1 + i * 0.06}s` }} tabIndex={menu ? 0 : -1}>
              <span className="menu__idx">0{i + 1}</span>
              {n.label}
            </Link>
          ))}
        </nav>
        <p className="menu__foot">Livigno · Valtellina · dal 1984</p>
      </div>
    </>
  );
}
