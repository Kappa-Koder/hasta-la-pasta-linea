// Frammenti HTML condivisi, generati in fase di build (plugin in vite.config.js).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BRAND, SEDES, LEGAL_TBC, PRENSA } from './data.js';
import { weekRows } from './status.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const IMAGES = JSON.parse(fs.readFileSync(path.join(here, 'images.json'), 'utf8'));
const svg = (name) => fs.readFileSync(path.join(here, '../assets/logo', name), 'utf8').replace(/<!--[\s\S]*?-->/g, '').trim();

// base del sito (GitHub Pages: /<repo>/), impostata da vite.config.js
const BASE = () => globalThis.HLP_BASE || '/';

export const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Il wordmark è inserito una volta come <symbol> e richiamato con <use>: i colori passano per
// variabili CSS (--wm-1 rosso, --wm-2 oro, --wm-3 verde) così ogni contesto può ricolorarlo.
export function wordmarkSymbol() {
  const src = svg('wordmark-full.svg');
  const viewBox = src.match(/viewBox="([^"]+)"/)[1];
  const vars = { '#DC152B': '--wm-1', '#FEAB03': '--wm-2', '#2E7F39': '--wm-3' };
  const paths = [...src.matchAll(/<path fill="([^"]+)" fill-rule="evenodd" d="([^"]+)"\/>/g)]
    .map(([, fill, d]) => `<path style="fill:var(${vars[fill]},${fill})" fill-rule="evenodd" d="${d.replace(/(\d+\.\d)\d/g, '$1')}"/>`)
    .join('');
  return `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><symbol id="hlp-wordmark" viewBox="${viewBox}">${paths}</symbol></svg>`;
}

export const wordmark = (cls = 'wordmark') =>
  `<svg class="${cls}" viewBox="0 0 332 100" role="img" aria-label="Hasta la Pasta · Est. 2020 · Sempre fresca" focusable="false"><use href="#hlp-wordmark"/></svg>`;

// Anteprima per la revisione: nessuno deve scambiarla per il sito ufficiale del ristorante
export const propuesta = () =>
  '<p class="propuesta">Propuesta de diseño · no es la web oficial</p>';

export const tbc = (text) => `<span class="tbc" title="${esc(text)}"><span class="tbc__dot" aria-hidden="true"></span>${esc(text)}</span>`;

export function picture(name, { alt = '', sizes = '100vw', cls = '', eager = false, imgCls = '' } = {}) {
  const img = IMAGES[name];
  if (!img) throw new Error(`immagine mancante: ${name}`);
  const set = (ext) => img.sizes.map((w) => `${BASE()}img/${name}-${w}.${ext} ${w}w`).join(', ');
  const largest = img.sizes[img.sizes.length - 1];
  const h = Math.round((img.h / img.w) * largest);
  return `<picture class="${cls}"><source type="image/avif" srcset="${set('avif')}" sizes="${sizes}"><source type="image/webp" srcset="${set('webp')}" sizes="${sizes}"><img class="${imgCls}" src="${BASE()}img/${name}-${img.sizes[0]}.webp" width="${largest}" height="${h}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></picture>`;
}

export const sedeNombre = (s) => `${s.ciudad} · ${s.zona}`;

export function horarioTable(s, cls = 'horario') {
  const rows = weekRows(s.horario)
    .map((r) => `<tr><th scope="row">${r.dias}</th><td>${r.horas}</td></tr>`)
    .join('');
  return `<table class="${cls}"><caption class="sr-only">Horario de ${esc(sedeNombre(s))}</caption><tbody>${rows}</tbody></table>`;
}

export const statusBadge = (s) =>
  `<p class="status" data-status="${s.id}" aria-live="polite"><span class="status__dot" aria-hidden="true"></span><span class="status__text">Horario</span></p>`;

export function pedirLinks(s, cls = 'btn-plat') {
  const links = s.pedir
    .map((p) => `<a class="${cls}" href="${p.url}" target="_blank" rel="noopener" data-plat="${esc(p.plataforma)}">${esc(p.plataforma)}<span class="sr-only"> (se abre en otra pestaña)</span><svg aria-hidden="true" viewBox="0 0 16 16"><path d="M4 12 12 4M6 4h6v6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></a>`)
    .join('');
  return links + (s.pedirTbc ? tbc(s.pedirTbc) : '');
}

// Selettore "Pide ahora": sede -> piattaforme. Logica in order.js.
export function pedirSelector(prefix = 'pedir') {
  const tabs = SEDES.map((s, i) =>
    `<button class="${prefix}__tab" role="tab" type="button" id="${prefix}-tab-${s.id}" aria-controls="${prefix}-panel-${s.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-color="${s.color}"><span class="${prefix}__ciudad">${s.ciudad}</span><span class="${prefix}__zona">${s.zona}</span></button>`).join('');
  const panels = SEDES.map((s, i) => `
    <div class="${prefix}__panel" role="tabpanel" id="${prefix}-panel-${s.id}" aria-labelledby="${prefix}-tab-${s.id}" ${i === 0 ? '' : 'hidden'}>
      <div class="${prefix}__info">
        ${statusBadge(s)}
        <p class="${prefix}__dir">${esc(s.direccion)}, ${esc(s.cp)}</p>
      </div>
      <div class="${prefix}__plats">${pedirLinks(s)}</div>
      <p class="${prefix}__alt">¿Prefieres recogerla? <a href="${s.maps}" target="_blank" rel="noopener">Cómo llegar</a> · <a href="tel:${s.telefono.replace(/\s/g, '')}">${esc(s.telefono)}</a></p>
    </div>`).join('');
  return `<div class="${prefix}" data-pedir><div class="${prefix}__tabs" role="tablist" aria-label="Elige tu sede">${tabs}</div>${panels}</div>`;
}

export function footer(prefix = 'foot') {
  const sedes = SEDES.map((s) => `<li><a href="${s.maps}" target="_blank" rel="noopener">${esc(sedeNombre(s))}</a><span>${esc(s.direccion)}</span></li>`).join('');
  return `
  <footer class="${prefix}" id="contacto">
    <div class="${prefix}__mark">${wordmark(`${prefix}__logo`)}</div>
    <div class="${prefix}__cols">
      <div><h2 class="${prefix}__h">Sedes</h2><ul class="${prefix}__list">${sedes}</ul></div>
      <div><h2 class="${prefix}__h">Contacto</h2><ul class="${prefix}__list">
        <li><a href="mailto:${BRAND.email}">${BRAND.email}</a></li>
        <li><a href="tel:${BRAND.telefonoGeneral.replace(/\s/g, '')}">${BRAND.telefonoGeneral}</a></li>
        <li><a href="${BRAND.instagram}" target="_blank" rel="noopener">Instagram ${BRAND.instagramHandle}</a></li>
        <li><a href="${BRAND.facebook}" target="_blank" rel="noopener">Facebook</a></li>
      </ul></div>
      <div><h2 class="${prefix}__h">En prensa</h2><p class="${prefix}__p"><a href="${PRENSA.url}" target="_blank" rel="noopener">${PRENSA.medio}</a>, ${PRENSA.fecha}: ${esc(PRENSA.texto)}.</p></div>
    </div>
    <div class="${prefix}__legal">
      <p>© ${BRAND.nombre} · Est. ${BRAND.desde} · Valoraciones de Google y horarios consultados el ${BRAND.fechaDatos}.</p>
      <p>${tbc(LEGAL_TBC)}</p>
      <p>Logotipo: reconstrucción vectorial provisional a partir de material publicado; pendiente del original.</p>
    </div>
  </footer>`;
}

const DAY_SCHEMA = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export function jsonLd() {
  const restaurants = SEDES.map((s) => ({
    '@type': 'Restaurant',
    name: `${BRAND.nombre} ${s.zona}`,
    servesCuisine: 'Italiana',
    telephone: s.telefono,
    address: {
      '@type': 'PostalAddress',
      streetAddress: s.direccion,
      postalCode: s.cp.split(' ')[0],
      addressLocality: s.ciudad,
      addressCountry: 'ES',
    },
    hasMap: s.maps,
    openingHoursSpecification: Object.entries(s.horario).flatMap(([d, slots]) =>
      slots.map(([a, b]) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: DAY_SCHEMA[d], opens: a, closes: b === '24:00' ? '23:59' : b }))),
  }));
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BRAND.nombre,
    slogan: BRAND.claim,
    email: BRAND.email,
    sameAs: [BRAND.instagram, BRAND.facebook],
    foundingDate: String(BRAND.desde),
    subOrganization: restaurants,
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}
