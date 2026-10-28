import Link from "next/link";
import { LogoMark, LogoWord } from "./Logo";
import { COMPANY } from "@/lib/company";

// Da sostituire con i profili FLOEMA quando saranno attivi.
const SOCIAL = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" aria-hidden>
        <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8.2v3h2.5V21" />
      </svg>
    ),
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer id="contatti" className="footer" data-theme="dark">
      <div className="container">
        <div className="footer__main">
          <div className="footer__cols">
            <div>
              <p className="eyebrow">Studio e contatti</p>
              <address>
                Via All, 138 · 23041 Livigno (SO)
              </address>
              <a className="link-line" href="mailto:info@falegnameriagalli.com">
                info@falegnameriagalli.com
              </a>
              <a className="link-line" href="tel:+390342979296">
                +39 0342 979296
              </a>
            </div>
            <div>
              <p className="eyebrow">Esplora</p>
              <Link className="link-line" href="/shop">Shop</Link>
              <Link className="link-line" href="/materia">Materia</Link>
              <Link className="link-line" href="/studio">Studio</Link>
              <Link className="link-line" href="/contatti">Contatti</Link>
            </div>
            <div>
              <p className="eyebrow">Social</p>
              <div className="footer__social">
                {SOCIAL.map((s) => (
                  <a key={s.label} href={s.href} className="footer__icon" aria-label={s.label}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <Link href="/" className="footer__brand" aria-label="FLOEMA Wood Studio, home">
            <LogoMark className="footer__mark" />
            <LogoWord className="footer__word" />
          </Link>
        </div>

        <div className="footer__bottom">
          <span>
            © {year} FLOEMA Wood Studio — {COMPANY.name} · {COMPANY.address} · P.IVA {COMPANY.vat} · REA {COMPANY.rea}
          </span>
          <span>
            {/* Da collegare ai testi di iubenda. */}
            <a href="#">Privacy</a> · <a href="#">Cookie</a> · <a href="#">Termini di vendita</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
