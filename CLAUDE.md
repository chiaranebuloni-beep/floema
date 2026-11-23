# FLOEMA Wood Studio — recap del progetto

Leggi questo file prima di qualsiasi richiesta sul progetto FLOEMA. Ultimo aggiornamento: 23 novembre 2026 (database spostato su Railway).

## Cos'è

Sito e-commerce di **FLOEMA Wood Studio**, il brand di design della Falegnameria F.lli Galli di Livigno. Si vende un solo prodotto, **FLOEMA 01**: uno sgabello che si usa anche come tavolino d'appoggio o comodino. Il catalogo è comunque pronto per più prodotti e più varianti.

- **Sito**: Next.js 16 (App Router, Turbopack), GSAP + ScrollTrigger, Lenis, Three.js per il 3D del prodotto. Si trova in questa cartella.
- **Admin / backend**: Django 5.2 + Unfold, nella cartella `backend/`. Il menu ha **Ordini** (con la scheda Clienti), **Spedizioni** (ordini pagati da spedire e spediti; il corriere è un campo libero: non scrivere GLS o altri nomi, il corriere non è ancora scelto), **Prodotti** (con la scheda Varianti), **Lead dal sito** (richieste del modulo contatti, privati e professionisti) e Utenti staff. È volutamente minimale.
- **Lingua**: si risponde sempre in **italiano**.

## Dove sta e come si pubblica

| Cosa | Dove |
|---|---|
| Cartella | `/Users/chiara/Desktop/PROGETTI CLAUDE/floema` |
| Sito online | https://floema-orcin.vercel.app (progetto Vercel `floema`) |
| Admin online | https://floema-production.up.railway.app/admin/ (Railway, progetto `floema`, account del collega Matteo; Root Directory `backend`). Dal 23 novembre 2026 il sito usa questo. Il vecchio admin su Vercel (`floema-admin`) è stato cancellato |
| Database online | Postgres di Railway, nello stesso progetto (dal 23 novembre 2026). `DATABASE_URL` usa l'indirizzo interno `railway.internal`, gratuito; l'accesso pubblico è spento e va lasciato spento (il traffico pubblico si paga). Il vecchio Neon `floema-db` è stato cancellato il 23 novembre 2026; una copia dei suoi dati è in `backend/backup-neon-2026-11-23.json`, solo sul computer (esclusa da git) |
| GitHub | `chiaranebuloni-beep/floema`, branch `main` |
| Account Vercel | team `meraviglias-projects` |

- **Pubblicare il sito**: dalla cartella esegui `npx vercel deploy --prod --yes --scope meraviglias-projects`.
- **Pubblicare il backend**: su Railway si pubblica da solo a ogni push su `main` (vedi `backend/railway.json`: gunicorn, e prima di ogni avvio `migrate`, `copy_database` e `seed --online`). `copy_database` copia i dati da un altro database solo se c'è la variabile `SOURCE_DATABASE_URL` e il database è vuoto: è servito per lo spostamento da Neon, normalmente non fa nulla. Le variabili (database, chiavi) stanno nella scheda Variables del servizio su Railway.
- **GitHub**: commit su `main` e push.
- **Pubblica su Vercel e GitHub SOLO quando l'utente lo chiede.** Di solito chiede "pubblica su vercel e git". Se chiede solo Vercel, chiedi conferma prima di fare il commit.

**In locale** (configurazione in `.claude/launch.json`; se manca, va creata):
- sito: `npm run dev`, su http://localhost:3100;
- admin: `backend/.venv/bin/python backend/manage.py runserver 127.0.0.1:8000`, su http://localhost:8000/admin/.

**Porte occupate.** Sul computer girano anche altri progetti, che spesso occupano la 3100 e la 8000. Prima di avviare, controlla: se sono occupate, usa porte libere (per esempio 3101 per il sito e 8010 per l'admin) e aggiorna `BACKEND_URL` in `.env.local`. Non chiudere i processi degli altri progetti.

`.env.local` contiene solo `BACKEND_URL=http://127.0.0.1:8000`. `BACKEND_API_KEY` non serve in locale, perché nemmeno l'admin locale richiede una chiave. Se il backend non risponde, il sito usa `data/products.json`.

**Credenziali.** Stanno in file locali esclusi da git: `backend/CREDENZIALI-LOCALI.txt`, `backend/CREDENZIALI-ONLINE.txt` e `backend/CHIAVI-VERCEL.txt`. **Non scrivere mai chiavi o password in chat.** Le variabili sensibili di Vercel non si leggono da CLI.

## Come modificare i dati

- **Dati del prodotto** (prezzo, testi, varianti, foto): si cambiano in **tre posti insieme**:
  - `data/products.json`;
  - `backend/core/data/products.json`;
  - una **migrazione dati** in `backend/catalog/migrations/`, per aggiornare il database online.

  Le migrazioni modificano un valore solo se è ancora quello vecchio, così non sovrascrivono le modifiche fatte a mano nell'admin. L'ultima è la `0011` (prezzo pieno).
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
- **Prezzo**: prezzo di lancio 490 € con il prezzo pieno 590 € barrato (campo «prezzo pieno» del prodotto nell'admin, `fullPrice` nel JSON; il cliente paga sempre il «prezzo»). Spedizione esclusa; il pulsante dice "Pre-ordina". Sotto il pulsante: "Sei un professionista o ti servono 5 pezzi o più? Chiedi un'offerta dedicata" (link a Contatti).
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
- Le essenze: Legno antico, Rovere, Cirmolo, Abete, una riga ciascuna con un pallino tondo con la foto del legno a destra, come i colori dello Shop. Le foto (`essenza-*-v3.jpg`) sono state fornite dall'utente il 16 novembre 2026. Non usare foto prese da internet senza licenza;
- Le lavorazioni: **solo Spazzolato e Verniciato**.

**Studio**: slideshow delle foto del metodo, foto del team panoramica in bianco e nero, anni con contatore animato.

**Email ai clienti** (`backend/core/templates/emails/`, inviate con Brevo): conferma d'ordine e avviso di spedizione su fondo bianco, logo scuro (`public/email/logo-floema-scuro.png`), riquadri grigi con numero ordine, data o corriere e tracking, tre tappe (Ordine confermato, Ordine spedito, Consegnato), riepilogo con la foto della colorazione scelta. Il pulsante «Segui la spedizione» usa il campo **Link di tracking** dell'ordine nell'admin (da compilare alla spedizione). Il link «Segui l'ordine» apre la pagina **`/ordine`** del sito (stato dell'ordine, protetta dal codice dell'ordine, non indicizzata).

**Footer**: "© FLOEMA Wood Studio — Falegnameria Galli di Galli Alex · Via All, 138, 23041 Livigno (SO) · P.IVA 01019410149 · REA SO 74467" (dati del cliente, 13 novembre 2026; il REA viene da una ricerca online ed è da confermare sulla visura).

**Testo dello studio in home**: l'attività è guidata dal figlio Alex (non più "i figli Alex, Nadir ed Emanuele").

**Font Groupe**: licenza Envato Elements intestata a Reddoak Srl per il progetto "sito web floemawoodstudio.it". Il sito usa i file `.woff2` in `src/fonts/`, esclusi da git come gli `.otf`: prima di pubblicare, controlla che ci siano nella cartella da cui lanci il deploy (si creano dagli `.otf`, vedi README).

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
   - Servizi da indicare su iubenda: Vercel (sito), Railway (admin e database), Stripe (pagamenti), modulo contatti, email degli ordini, corriere.
   - I testi vanno fatti validare dal commercialista o da un legale.
2. **Confermare il REA** SO 74467 sulla visura camerale (oggi viene da una ricerca online).
3. **Stripe e Brevo** (in corso dal 23 novembre 2026). Il codice è pronto: si attivano con le variabili del servizio su Railway, che inserisce l'utente (mai le chiavi in chat). Railway ripubblica da solo.
   - **Stripe: collegato in modalità test (Sandbox di Falegnameria Galli) il 23 novembre 2026**; prova d'acquisto con la carta 4242 riuscita, email di conferma arrivata. Webhook `floema-railway` (formato Snapshot, solo `checkout.session.completed`). Per incassare davvero: attivazione dell'account da parte di Alex (documento, IBAN), poi chiave `sk_live_` e un nuovo webhook in modalità live con lo stesso URL, e sostituire le due variabili su Railway. Se l'admin cambia indirizzo, aggiornare l'URL del webhook su Stripe.
   - **Stripe** (variabili): `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET`. Webhook su `https://floema-production.up.railway.app/api/stripe/webhook/`, evento `checkout.session.completed`. Prima in modalità test, poi live. Il sito chiede all'admin se i pagamenti sono attivi (`/api/config/`): non serve la chiave sul progetto del sito.
   - **Brevo: collegato e funzionante il 23 novembre 2026** (prova di conferma d'ordine arrivata). Mittente `info@floemawoodstudio.it`, verificato nella scheda Mittenti di Brevo (senza mittente verificato Brevo rifiuta l'invio: «sender is not valid»). Non usare il mittente Gmail dell'account (casella Aruba del dominio floemawoodstudio.it, comprato dal cliente). Dominio autenticato su Brevo con i record DNS su Aruba: codice Brevo (TXT @), DKIM `brevo1`/`brevo2._domainkey` (CNAME), un solo `_dmarc`. Le email usano la chiave API di Brevo (`BREVO_API_KEY`), non la chiave SMTP `floema-railway`, che si può eliminare. Non attivare su Brevo il blocco degli IP non autorizzati: Railway non ha un IP fisso.
   - **Brevo** (variabili su Railway): Railway nel piano Hobby **blocca le porte SMTP**, quindi le email passano dall'API web di Brevo (`backend/core/brevo.py`): `EMAIL_BACKEND=core.brevo.BrevoAPIBackend`, `BREVO_API_KEY` (chiave API di Brevo, `xkeysib-…`, da *SMTP e API → Chiavi API*), `DEFAULT_FROM_EMAIL=FLOEMA Wood Studio <info@floemawoodstudio.it>`, `STORE_EMAIL=info@floemawoodstudio.it`. Le variabili `EMAIL_HOST*`/`EMAIL_PORT` non servono più. Gli errori di invio compaiono nei Deploy Logs di Railway.
   - Prima dei pagamenti veri servono le condizioni di vendita e la privacy (punto 1) e il costo di spedizione (punto 4).
4. **Prezzo, spedizione e tempi** (decisioni del cliente, 19 novembre 2026; prezzo e riga per i professionisti già sul sito):
   - prezzo pieno **590 € IVA inclusa**, con **prezzo di lancio 490 €** (590 € barrato); manca il limite del lancio (data o numero di pezzi);
   - richiesta a parte per **professionisti e ordini da 5–10 pezzi in su**;
   - costi a pezzo secondo il cliente: materiale 90 €, mano d'opera 120 €, imballo 10 € (stima), varie 30 €;
   - lo sgabello viaggia **montato**, circa 10–12 kg imballato; scatola su misura e pluriball ancora da trovare;
   - **corriere**: nessuno contattato; il cliente sentirà quelli di Livigno. Va chiarito con loro come funzionano IVA e dogana in uscita da Livigno (zona extradoganale);
   - produzione: un paio di giorni a pezzo, con alcuni pezzi sempre pronti in magazzino.
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
