# FLOEMA — Backend (Django + Unfold)

Gestione di prodotti, ordini, clienti e iscritti alla newsletter del sito. È pensato per più prodotti, ognuno con le sue colorazioni.

## Avvio in locale

```bash
cd backend
.venv/bin/python manage.py runserver 8000
```

- Admin: http://127.0.0.1:8000/admin/. Le credenziali sono in `CREDENZIALI-LOCALI.txt`.
- Il sito usa il backend quando `.env.local` contiene `BACKEND_URL=http://127.0.0.1:8000`.

## Sezioni dell'admin

- **Ordini**: è la pagina iniziale.
  - Stato: Nuovo → In produzione → Spedito → Consegnato, oppure Annullato.
  - Pagamento, corriere e tracking, note interne.
  - Quando lo stato passa a «Spedito» il cliente riceve un'email.
- **Clienti**: creati in automatico dal checkout, con lo storico degli ordini.
- **Prodotti**:
  - dati e scheda tecnica;
  - varianti offerte, da spuntare tra quelle esistenti;
  - immagini della galleria;
  - modalità d'uso.
- **Varianti**: si creano e gestiscono tutte in un'unica pagina.
  - Ogni variante ha un tipo: Colore, Materiale o Dimensioni.
  - Può avere un supplemento di prezzo; i colori hanno anche il pallino e le tinte del 3D.
  - Sul sito il cliente sceglie un'opzione per ogni tipo offerto dal prodotto.
  - Dalla pagina di una variante si scelgono i prodotti che la offrono.
- **Contatti**: i messaggi inviati dal modulo della pagina Contatti del sito. La spunta «Risposto» si mette direttamente dall'elenco.
- **Utenti staff**: chi può entrare nell'admin.

## Dati di esempio

```bash
.venv/bin/python manage.py seed --esempi        # ordini, clienti, contatti, un prodotto in bozza e una variante
.venv/bin/python manage.py seed --togli-esempi  # li rimuove tutti
```

## Prima installazione

```bash
cd backend
python3 -m venv .bootstrap && .bootstrap/bin/pip install uv
.bootstrap/bin/uv python install 3.12 && .bootstrap/bin/uv venv --python 3.12 .venv
.bootstrap/bin/uv pip install --python .venv/bin/python -r requirements.txt
.venv/bin/python manage.py migrate
.venv/bin/python manage.py seed   # importa i prodotti da ../data/products.json e crea l'utente admin
```

## Pagamenti ed email

- **Stripe**: con `STRIPE_SECRET_KEY` in `.env` il checkout passa da Stripe. Senza chiave, gli ordini vengono salvati come «prova».
- **Email**: in locale vengono stampate nel terminale. Per inviarle davvero configura SMTP in `.env` (vedi `.env.example`).

## Online su Vercel

Il backend è un progetto Vercel separato (`floema-admin`, regione Francoforte) con database Postgres Neon (`floema-db`).

- `api/index.py` passa tutte le richieste a Django; `vercel.json` le instrada lì.
- Le variabili d'ambiente sono in `CHIAVI-VERCEL.txt`, un file locale da non condividere. Vanno inserite in Settings → Environment Variables.
- `DATABASE_URL` la aggiunge Vercel quando colleghi il database al progetto.
- Per creare le tabelle o caricare i prodotti sul database online, lancia i comandi in locale con `DATABASE_URL` impostata:
  `.venv/bin/python manage.py migrate` e `.venv/bin/python manage.py seed`.

