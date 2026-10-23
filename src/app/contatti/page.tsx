import type { Metadata } from "next";
import { PageHero } from "@/components/pages/PageHero";
import { ContactForm } from "@/components/pages/ContactForm";
import { Footer } from "@/components/Footer";
import { RevealAnimations } from "@/components/RevealAnimations";

export const metadata: Metadata = {
  title: "Contatti — FLOEMA Wood Studio",
  description: "Scrivi a FLOEMA Wood Studio: Via All 138, 23041 Livigno (SO).",
};

const MAPS = "https://www.google.com/maps/search/?api=1&query=Via+All+138+23041+Livigno+SO";

export default function ContattiPage() {
  return (
    <>
      <main>
        <PageHero
          index="01"
          eyebrow="Contatti"
          lines={["Parliamo del", "tuo progetto."]}
          lead="Per una creazione FLOEMA, un progetto su misura o una collaborazione professionale."
        />

        <section className="section contact" data-theme="light">
          <div className="container contact__grid">
            <div className="contact__info">
              <div className="contact__block" data-fade>
                <span className="eyebrow eyebrow--dark">Studio</span>
                <address className="contact__big">
                  Via All, 138
                  <br />
                  23041 Livigno (SO)
                </address>
                <a className="link-line contact__map" href={MAPS} target="_blank" rel="noopener noreferrer">
                  Apri in Maps ↗
                </a>
              </div>
              <div className="contact__block" data-fade="0.05">
                <span className="eyebrow eyebrow--dark">Email</span>
                <a className="link-line contact__big" href="mailto:info@falegnameriagalli.com">
                  info@falegnameriagalli.com
                </a>
              </div>
              <div className="contact__block" data-fade="0.1">
                <span className="eyebrow eyebrow--dark">Telefono</span>
                <a className="link-line contact__big" href="tel:+390342979296">
                  +39 0342 979296
                </a>
              </div>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
      <RevealAnimations />
    </>
  );
}
