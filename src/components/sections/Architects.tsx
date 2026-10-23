import { Lines } from "../Lines";

export function Architects() {
  return (
    <section id="architetti" className="section arch" data-theme="dark">
      <div className="container arch__inner">
        <div className="section__label section__label--light" data-fade>
          <span>06</span>
          <span>Per i professionisti</span>
        </div>
        <Lines as="h2" className="display" lines={["Architetti e", <>interior designer.</>]} />
        <div className="arch__cols">
          <p className="lead lead--light" data-fade>
            Pezzi dal carattere deciso, pensati per progetti residenziali, hospitality e retail. Aggiungono identità senza occupare
            spazio.
          </p>
          <ul className="arch__list" data-fade="0.1">
            <li>Progettazione su misura, dal piccolo arredo alle strutture ricettive</li>
            <li>Disegni tecnici e simulazioni fotorealistiche</li>
            <li>Legno, metallo, pietra e vetro come dettagli distintivi</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
