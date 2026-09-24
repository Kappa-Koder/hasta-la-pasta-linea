# Hasta la Pasta · Línea Pasta

Proposta di sito per Hasta la Pasta (pasta fresca italiana, Valencia e Madrid): uno spaghetto rosso disegnato dallo scroll come una linea della metro, dalle tre "paradas" del banco alla carta, alle sedi e fino a "Tu casa", dove si ordina.

**Anteprima di revisione:** la pagina è marcata "Propuesta de diseño · no es la web oficial" e `noindex`.

## Comandi

```bash
npm install
npm run dev       # http://localhost:5174/hasta-la-pasta-linea/
npm run build     # dist/, con base /hasta-la-pasta-linea/ (BASE_PATH per cambiarla)
npm run deploy    # build + pubblicazione sul branch gh-pages
```

Il sito è servito da GitHub Pages dal branch `gh-pages`: https://kappa-koder.github.io/hasta-la-pasta-linea/

## Contenuti

- Tutti i testi, orari, sedi e link d'ordine sono in `src/shared/data.js`, dal ticket di ricerca del 24/09/2026. Nessun prezzo.
- I dati mancanti o in conflitto compaiono come "por confirmar": orari Valencia Centro, telefono Cabanyal, Glovo Madrid, formati di pasta, allergeni, "Alfredo", dati legali.
- Il wordmark è una ricostruzione vettoriale provvisoria: va sostituito col file originale del cliente.

## Stack

Vite, GSAP + ScrollTrigger, Lenis. Il tracciato della linea è SVG calcolato dalle fermate nel DOM (`src/linea/rail.js`).

Estratto dal progetto `Fog-coder/hasta-la-pasta` (cartella `sito/`), che contiene anche la ricerca, il brief e la seconda proposta.
