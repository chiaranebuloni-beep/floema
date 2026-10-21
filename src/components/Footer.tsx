import { LogoMark, LogoWord } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer id="contatti" className="footer" data-theme="dark">
      <div className="container">
        <div className="footer__top">
          <p className="footer__claim" data-fade>
            Per chi cerca oggetti con anima,
            <br />
            non semplici arredi.
          </p>
          <LogoMark className="footer__mark" />
        </div>

        <div className="footer__cols">
          <div>
            <p className="eyebrow">Studio</p>
            <address>
              Via All, 138
              <br />
              23041 Livigno (SO)
            </address>
          </div>
          <div>
            <p className="eyebrow">Contatti</p>
            <a className="link-line" href="mailto:info@falegnameriagalli.com">
              info@falegnameriagalli.com
            </a>
            <a className="link-line" href="tel:+390342979296">
              +39 0342 979296
            </a>
          </div>
          <div>
            <p className="eyebrow">Esplora</p>
            <a className="link-line" href="#creazione">Collezione</a>
            <a className="link-line" href="#studio">Lo studio</a>
            <a className="link-line" href="#architetti">Professionisti</a>
          </div>
          <div>
            <p className="eyebrow">Social</p>
            {/* Da sostituire con i profili FLOEMA quando saranno attivi. */}
            <a className="link-line" href="#">Instagram</a>
            <a className="link-line" href="#">Pinterest</a>
          </div>
        </div>

        <div className="footer__word" aria-hidden>
          <LogoWord />
        </div>

        <div className="footer__bottom">
          <span>© {year} FLOEMA Wood Studio — una realtà Falegnameria Galli</span>
          <span>
            <a href="#">Privacy</a> · <a href="#">Cookie</a> · <a href="#">Termini di vendita</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
