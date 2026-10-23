# FLOEMA Wood Studio — e-commerce

Next.js 16 (App Router) con frontend e backend nello stesso progetto.

```bash
npm install
npm run dev   # http://localhost:3100
```

### Font Groupe (obbligatorio)

Groupe è un font commerciale e non è incluso nel repository. Prima di avviare il sito copia in `src/fonts/` i file della licenza con questi nomi:

```
src/fonts/groupe-thin.otf      (GROUPE THIN.otf)
src/fonts/groupe-light.otf     (GROUPE LIGHT.otf)
src/fonts/groupe-regular.otf   (GROUPE REGULAR.otf)
src/fonts/groupe-medium.otf    (GROUPE MEDIUM.otf)
```

Su un Mac con il font installato:

```bash
for w in THIN LIGHT REGULAR MEDIUM; do cp ~/Library/Fonts/"GROUPE $w.otf" "src/fonts/groupe-$(echo $w | tr A-Z a-z).otf"; done
```

## Struttura

- `src/app/page.tsx` — home page
- `src/components/sections/` — sezioni della home (Hero, Manifesto, Capitolo prodotto, Prospettive, Il nome, Studio, Architetti, Newsletter)
- `src/app/api/` — backend
  - `GET /api/products`, `GET /api/products/[slug]` — catalogo
  - `POST /api/cart` — riprezza il carrello lato server (il client invia solo slug e quantità)
  - `POST /api/newsletter` — iscrizioni (privato / professionista)
- `data/products.json` — catalogo; `data/subscribers.json` — iscritti (non versionato)

L'archivio su file JSON vale solo per lo sviluppo locale: prima del go-live va sostituito con un database e il checkout collegato a un provider di pagamento.

## Brand

- Font Groupe in `src/fonts/`, non versionato (licenza commerciale)
- Titoli e testi: Helvetica Neue (font di sistema) · Groupe solo per i numeri (1984, prezzo) e "/flo·è·ma/"
- Palette: Sabbia `#D8C8B8`, Tortora `#A29686`, Fango `#6F665B`, Antracite `#1E1E1E`, Rovere `#6B4A2E`
- Foto dal Piano Editoriale; logo vettoriale estratto dalla brand identity
