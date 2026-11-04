# FLOEMA Wood Studio — recap del progetto

Leggi questo file prima di qualsiasi richiesta sul progetto FLOEMA. Ultimo aggiornamento: 4 novembre 2026.

## Cos'è

Sito e-commerce di **FLOEMA Wood Studio**, il brand di design della Falegnameria F.lli Galli di Livigno. Si vende un solo prodotto, **FLOEMA 01**: uno sgabello che si usa anche come tavolino d'appoggio o comodino. Il catalogo è comunque pronto per più prodotti e più varianti.

- **Sito**: Next.js 16 (App Router, Turbopack), GSAP + ScrollTrigger, Lenis, Three.js per il 3D del prodotto. Si trova in questa cartella.
- **Admin / backend**: Django 5.2 + Unfold, nella cartella `backend/`. Ha Ordini, Clienti, Prodotti, Varianti, Contatti e Utenti staff, ed è volutamente minimale.
- **Lingua**: si risponde sempre in **italiano**.

## Dove sta e come si pubblica

| Cosa | Dove |
|---|---|
| Cartella | `/Users/chiara/Desktop/floema` |
| Sito online | https://floema-orcin.vercel.app (progetto Vercel `floema`) |
| Admin online | https://floema-admin.vercel.app/admin/ (progetto Vercel `floema-admin`, cartella `backend/`) |
| Database online | Neon Postgres `floema-db` (variabile `DATABASE_URL`) |
| GitHub | `chiaranebuloni-beep/floema`, branch `main` |
| Account Vercel | team `meraviglias-projects` |

- **Pubblicare il sito**: dalla cartella esegui `npx vercel deploy --prod --yes --scope meraviglias-projects`.
- **Pubblicare il backend**: lo stesso comando, lanciato da `backend/`. Durante la build vengono eseguiti `migrate` e `seed --online` con Python 3.14 (vedi `backend/vercel.json`).
- **GitHub**: commit su `main` e push.
- **Pubblica su Vercel e GitHub SOLO quando l'utente lo chiede.** Di solito chiede "pubblica su vercel e git". Se chiede solo Vercel, chiedi conferma prima di fare il commit.

**In locale** (configurazione in `.claude/launch.json` della sessione):
- sito: `npm run dev`, su http://localhost:3100;
- admin: `backend/.venv/bin/python backend/manage.py runserver 127.0.0.1:8000`, su http://localhost:8000/admin/.

`.env.local` contiene `BACKEND_URL=http://127.0.0.1:8000` e `BACKEND_API_KEY`. Se il backend non risponde, il sito usa `data/products.json`.

**Credenziali.** Stanno in file locali esclusi da git: `backend/CREDENZIALI-LOCALI.txt`, `backend/CREDENZIALI-ONLINE.txt` e `backend/CHIAVI-VERCEL.txt`. **Non scrivere mai chiavi o password in chat.** Le variabili sensibili di Vercel non si leggono da CLI.

## Come modificare i dati

- **Dati del prodotto** (prezzo, testi, varianti, foto): si cambiano in **tre posti insieme**:
  - `data/products.json`;
  - `backend/core/data/products.json`;
  - una **migrazione dati** in `backend/catalog/migrations/`, per aggiornare il database online.

  Le migrazioni modificano un valore solo se è ancora quello vecchio, così non sovrascrivono le modifiche fatte a mano nell'admin. L'ultima è la `0010`.
- **Dati aziendali** del footer: `src/lib/company.ts`.
- **Indirizzo del sito**: `src/lib/site.ts`. Si usa per sitemap, anteprime e dati per Google. Quando ci sarà il dominio basta impostare `NEXT_PUBLIC_SITE_URL` su Vercel.
- **Foto nuove**: vanno ottimizzate in `public/images`. Se sostituisci una foto, dai al file un **nome nuovo**, altrimenti la cache delle immagini continua a mostrare quella vecchia. Gli originali del cliente stanno in `foto nuove/`, `il metodo/` e `prospettive/` e sono esclusi da git.
- **Cache**: home e Shop rileggono il catalogo al massimo ogni 60 secondi. Carrello e checkout leggono sempre i prezzi aggiornati.

## Preferenze dell'utente (da rispettare)

- **Titoli**: sempre **MAIUSCOLI**, Helvetica con peso sottile; anche i testi sono in Helvetica.
- **Groupe**: si usa **solo** per i numeri (1984, 2026, prezzo) e per "/flo·e·ma/". Niente Montserrat, Cinzel o Haas.
- **Pittogramma**: è il logo tondo con le venature, non quello ovale.
- **Colori del sito**: avorio, sabbia, carbone e rovere. Il marrone non piace: l'hover dei pulsanti è color sabbia.
- **Modifiche**: fai **solo quelle richieste**, senza togliere sezioni non richieste.
- **Verifica**: controlla sempre in locale nel pannello Browser, a desktop e su mobile, e mostra uno screenshot.
- **Niente contenuti finti o provvisori sul sito**:
  - niente avvisi "contenuti provvisori" o "da confermare": sono stati tolti apposta;
  - **mai recensioni, progetti o articoli inventati**;
  - l'utente ha detto anche di **non preparare** la sezione "prove di fiducia" (progetti, certificazioni, recensioni): non farla se non la chiede di nuovo.
- **Admin**: il più semplice possibile, con solo ciò che serve al sito di oggi.

## Stato attuale (tutto online e su GitHub, ultimo commit `a4b5d74`)

**Home**, in quest'ordine:
1. Hero; su mobile usa una foto verticale apposita (`hero-spigolo-mobile.jpg`).
2. 01 Manifesto.
3. 02 Il nome: testo sopra il legno, con un velo.
4. Testo "Per noi, progettare…", con il pulsante **Scopri la materia**.
5. 03 La prima creazione, con il pulsante **Scopri lo sgabello**.
6. 04 Lo studio, con il pulsante **Scopri lo studio**. I due paragrafi sono allineati e il titolo è in linea con "LIVIGNO — SO".
7. 05 Per i professionisti, con il pulsante **Parliamo del tuo progetto**.

La sezione Prospettive è stata **tolta**. Il componente `Perspectives.tsx` e le sue foto restano nel progetto, ma non sono usati.

**Shop** (pagina del prodotto FLOEMA 01):
- **Prezzo**: 490 €, spedizione esclusa; il pulsante dice "Pre-ordina".
- **Colorazioni**: **Naturale, Miele, Fumé** (codici `naturale`, `miele`, `fume`). La riga "Legno" cambia con la colorazione: Cirmolo, Rovere, Legno antico con gamba in abete nero. Il testo sta nel campo `Variant.wood` dell'admin.
- **Accanto a "Colorazione"**: niente nome, va lasciato così.
- **Altri dati**:
  - spessore 3,8 cm, portata 150 kg; **non mostrare i pesi**;
  - finitura spazzolata e verniciata;
  - certificazioni PEFC, DIN 53160-1/-2, ÖNORM EN 71-3.
- **Sezione scura**: c'è solo "Utilizzo", centrata rispetto al titolo.
- **Su mobile**:
  - l'apertura è una striscia bassa;
  - c'è una **barra fissa in basso** con nome, prezzo e Pre-ordina, che si nasconde quando il pulsante della pagina è visibile.
- **Dati per Google**: lo Shop contiene i dati strutturati del prodotto (JSON-LD).

**Materia**:
- l'apertura è "Scelto a mano, lavorato con rispetto.", diversa dalla home;
- Le essenze: Legno antico, Rovere, Cirmolo, Abete;
- Le lavorazioni: **solo Spazzolato e Verniciato**.

**Studio**: slideshow delle foto del metodo, foto del team panoramica in bianco e nero, anni con contatore animato.

**Footer**: "© FLOEMA Wood Studio — Falegnameria F.lli Galli di Galli Stefano e C. S.a.s. · Via Ostaria 357, 23041 Livigno (SO) · P.IVA 92003670145 · REA SO 39225". Lo studio e i contatti indicano Via All, 138.

**Tecnica**:
- icona del sito (`src/app/icon.svg`) e icona per iPhone;
- anteprima di condivisione (`opengraph-image.tsx`): logo FLOEMA e foto Fumé;
- `sitemap.xml` e `robots.txt`;
- l'animazione d'ingresso dura circa 1,5 s e compare solo alla prima pagina di ogni visita.

## Prossimi passi

### Servono prima di poter vendere: dipendono dal cliente
1. **Privacy, Cookie e Termini di vendita con iubenda.**
   - Li genera l'utente su iubenda; poi si collegano i link del footer, che oggi sono `href="#"` in `src/components/Footer.tsx`.
   - Le pagine `/privacy`, `/cookie` e `/termini` sono state **tolte su richiesta**: non ricrearle.
   - Il sito non usa cookie di profilazione né statistiche, quindi **non serve il banner dei cookie**.
   - Servizi da indicare su iubenda: Vercel (hosting), Neon (database), Stripe (pagamenti), modulo contatti, email degli ordini, corriere.
   - I testi vanno fatti validare dal commercialista o da un legale.
2. **Ricontrollare la P.IVA** `92003670145` sulla visura: inizia con 9, che di solito indica un codice fiscale di un ente.
3. **Stripe del cliente**: oggi il checkout è in modalità demo. Servono `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET` sul progetto `floema-admin`.
4. **Costo di spedizione e tempi di produzione**: ancora mancanti. Oggi ci sono solo "Spedizione esclusa" e "Prodotto su ordinazione".
5. **Dominio** (per esempio floema.it). Quando arriva:
   - impostare `NEXT_PUBLIC_SITE_URL`;
   - configurare un servizio email per le conferme d'ordine, che oggi partirebbero da `ordini@floema.it`;
   - registrare il sito su **Google Search Console** e inviare la sitemap.
6. **Link social veri** nel footer: oggi sono `#`.

### Per alzare il livello (proposte, solo se l'utente le chiede)
- **Versione in inglese**, e magari in tedesco: è il salto più grande, per i turisti di Livigno e gli architetti stranieri.
- **Statistiche delle visite** senza cookie.
- **Pagina prodotto più ricca**: disegno con le misure, una foto in scala, poche domande frequenti.
- **Contenuti veri dal cliente**: un breve video, le prime recensioni reali.

### Voto attuale dato all'utente
- **8,5/10** complessivo: vetrina 9,5, negozio 5.
- Con i punti 1–6 si arriva a 9,5.
- Con l'inglese e i contenuti veri si arriva a 10.
