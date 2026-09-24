// Concept A · LÍNEA PASTA — markup statico generato in build dai dati condivisi.
import { BRAND, FRASES, GIANFRANCO, RITUAL, EXTRAS, PASTAS, PICAR, POSTRE, ALERGENOS_TBC, SEDES } from '../shared/data.js';
import { esc, wordmark, wordmarkSymbol, propuesta, tbc, picture, horarioTable, statusBadge, pedirLinks, pedirSelector, footer, jsonLd as ld } from '../shared/render.js';

export const jsonLd = ld;

const rail = (extra = '') => `<svg class="rail ${extra}" aria-hidden="true" focusable="false"></svg>`;

export const loader = () => `
<noscript><style>.l-loader{display:none}</style></noscript>
<div class="l-loader" data-loader aria-hidden="true">
  <div class="l-loader__bg"></div>
  <div class="l-loader__stage">
    <svg class="l-loader__ring" viewBox="0 0 200 200"><circle class="l-loader__track" cx="100" cy="100" r="88"/><circle class="l-loader__arc" cx="100" cy="100" r="88" pathLength="100"/></svg>
    <p class="l-loader__count"><span data-count>0</span></p>
  </div>
  <div class="l-loader__mark">${wordmark('l-loader__logo')}</div>
</div>`;

const cajita = () => `
<div class="l-cajita" data-cajita aria-hidden="true">
  <svg viewBox="0 0 48 48"><path d="M9 16h30l-3.5 26h-23z" fill="#fab405" stroke="#0d0404" stroke-width="2.2" stroke-linejoin="round"/><path d="M9 16l-4-7 12 2 7 5M39 16l4-7-12 2-7 5" fill="#fff" stroke="#0d0404" stroke-width="2.2" stroke-linejoin="round"/><rect x="16" y="25" width="16" height="9" rx="2.5" fill="none" stroke="#dc152b" stroke-width="2"/><path d="M19 29.5h10" stroke="#dc152b" stroke-width="2" stroke-linecap="round"/></svg>
</div>`;

export const header = () => wordmarkSymbol() + propuesta() + cajita() + `
<header class="l-head" data-head>
  <a class="l-head__home" href="#inicio" aria-label="${BRAND.nombre}, volver al inicio">${wordmark('l-head__logo')}</a>
  <nav class="l-head__nav" aria-label="Principal">
    <a href="#carta">Carta</a><a href="#sedes">Sedes</a><a href="#historia">Historia</a>
  </nav>
  <a class="l-cta" href="#pide">Pide ahora</a>
</header>`;

const legendName = { centro: 'Valencia Centro', cabanyal: 'Cabanyal', madrid: 'Chamberí' };

export const hero = () => `
<section class="l-hero rail-sec" id="inicio" aria-labelledby="hero-t" data-rail="hero">
  ${rail()}
  <div class="l-hero__copy">
    <p class="l-plate"><span class="l-plate__line">Línea Pasta</span><span>Est. ${BRAND.desde} · Sempre fresca</span></p>
    <h1 id="hero-t" class="display l-hero__title">
      <span class="l-mask"><span>Sabor</span></span>
      <span class="l-mask"><span>italiano,</span></span>
      <span class="l-mask"><span>listo en</span></span>
      <span class="l-mask"><span>minutos</span></span>
    </h1>
    <p class="l-hero__sub">Pasta fresca italiana para llevar o a domicilio, en Valencia y Madrid.</p>
    <div class="l-hero__ctas">
      <a class="l-cta l-cta--big" href="#pide">Pide ahora</a>
      <a class="l-link" href="#carta">Ver la carta<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg></a>
    </div>
  </div>
  <figure class="l-ring" data-ring="hero">
    ${picture('guanciale', { alt: 'Primer plano de pasta cremosa con guanciale crujiente, pimienta y queso rallado', sizes: '(min-width: 900px) 40vw, 72vw', eager: true, cls: 'l-ring__pic' })}
  </figure>
  <ul class="l-legend" aria-label="Nuestras paradas">
    ${SEDES.map((s) => `<li class="l-legend__item" data-color="${s.color}"><span class="l-legend__sw" aria-hidden="true"></span><a href="#sede-${s.id}" class="l-legend__name">${legendName[s.id]}</a>${statusBadge(s)}</li>`).join('')}
  </ul>
</section>`;

export const recorrido = () => `
<section class="l-rec rail-sec" id="como" aria-labelledby="rec-t" data-rail="rec">
  ${rail()}
  <header class="l-sec-head">
    <h2 id="rec-t" class="display">Tres paradas<br>y listo</h2>
    <p>Así se pide en el mostrador, igual que en el cartel del local: pasta, salsa y extra.</p>
  </header>
  <ol class="l-rec__list">
    ${RITUAL.map((r, i) => `
    <li class="l-step" data-side="${i % 2 ? 'right' : 'left'}">
      <div class="l-step__text">
        <p class="l-kicker">Parada ${i + 1}</p>
        <h3 class="display l-step__title">${esc(r.paso)}</h3>
        <p class="l-step__p">${esc(r.texto)}</p>
        ${i === 2 ? `<ul class="l-chips" aria-label="Extras">${EXTRAS.map((e) => `<li>${esc(e)}</li>`).join('')}</ul>` : ''}
        ${r.tbc ? tbc(r.tbc) : ''}
      </div>
      <span class="l-stop l-stop--big" data-stop aria-hidden="true"><span>${i + 1}</span></span>
      <figure class="l-step__img" data-reveal>${picture(r.img, { alt: r.alt, sizes: '(min-width: 900px) 34vw, 86vw' })}</figure>
    </li>`).join('')}
  </ol>
</section>`;

const dish = (d, n) => `
  <li class="l-dish" data-dish>
    <span class="l-stop" data-stop aria-hidden="true"></span>
    <p class="l-dish__n" aria-hidden="true">${String(n).padStart(2, '0')}</p>
    <figure class="l-dish__img">${picture(d.img, { alt: `${d.nombre} en su caja`, sizes: '(min-width: 900px) 20vw, 30vw' })}</figure>
    <div class="l-dish__body">
      <h3 class="l-dish__name">${esc(d.nombre)}</h3>
      <p class="l-dish__ing">${esc(d.ing)}</p>
      ${d.aviso ? `<p class="l-dish__aviso">${esc(d.aviso)}</p>` : ''}
      ${d.nota ? `<p class="l-dish__nota">${esc(d.nota)}</p>` : ''}
    </div>
  </li>`;

const interchange = (label, sub) => `
  <li class="l-dish l-dish--group" aria-hidden="false">
    <span class="l-stop l-stop--change" data-stop aria-hidden="true"></span>
    <h3 class="display l-group">${esc(label)}</h3>
    <p class="l-group__sub">${esc(sub)}</p>
  </li>`;

export const carta = () => {
  let n = 0;
  return `
<section class="l-carta" id="carta" aria-labelledby="carta-t" data-carta>
  <div class="l-carta__pin" data-pin>
    <div class="l-carta__viewport">
      <div class="l-carta__track" data-track>
        ${rail('rail--track')}
        <header class="l-carta__head">
          <h2 id="carta-t" class="display">La carta</h2>
          <p>Ocho pastas, dos para picar y un postre. Los nombres, en italiano; el sabor, también.</p>
          ${tbc(ALERGENOS_TBC)}
        </header>
        <ol class="l-carta__stops">
          ${interchange('Pastas', 'Ocho recetas')}
          ${PASTAS.map((d) => dish(d, ++n)).join('')}
          ${interchange('Para picar', 'Entrantes')}
          ${PICAR.map((d) => dish(d, ++n)).join('')}
          ${interchange('Postre', 'Para terminar')}
          ${dish(POSTRE, ++n)}
        </ol>
      </div>
    </div>
  </div>
</section>`;
};

export const historia = () => `
<section class="l-hist rail-sec" id="historia" aria-labelledby="hist-t" data-rail="hist">
  ${rail()}
  <div class="l-hist__grid">
    <figure class="l-hist__img" data-reveal>
      ${picture('gianfranco', { alt: 'Gianfranco Rucco sonriendo delante de un puesto con el rótulo Hasta la Pasta', sizes: '(min-width: 900px) 46vw, 90vw' })}
      <figcaption>Gianfranco Rucco. Foto publicada por Hasta la Pasta.</figcaption>
    </figure>
    <div class="l-hist__text">
      <span class="l-stop" data-stop aria-hidden="true"></span>
      <p class="l-kicker">Origen · Est. ${BRAND.desde}</p>
      <h2 id="hist-t" class="display l-hist__title">Quién está detrás</h2>
      <blockquote class="l-quote">
        ${GIANFRANCO.cita.map((c) => `<p>${esc(c)}</p>`).join('')}
        <footer>— ${GIANFRANCO.nombre}, <a href="${GIANFRANCO.fuente}" target="_blank" rel="noopener">en Instagram</a></footer>
      </blockquote>
    </div>
  </div>
  <div class="l-hist__ways" aria-hidden="true"><span class="l-way" data-way></span><span class="l-way l-way--b" data-way></span></div>
  <p class="display l-hist__big" aria-label="${esc(FRASES.herencia)}"><span>La pasta italiana</span> <span>no solo se come.</span> <span class="l-hist__em">Se hereda.</span></p>
</section>`;

export const sedes = () => `
<section class="l-sedes rail-sec" id="sedes" aria-labelledby="sedes-t" data-rail="sedes">
  ${rail()}
  <header class="l-sec-head">
    <h2 id="sedes-t" class="display">Tres paradas,<br>dos ciudades</h2>
    <p>Horarios según Google Maps el ${BRAND.fechaDatos}. El estado se calcula con la hora de Madrid.</p>
  </header>
  <div class="l-sedes__grid">
    ${SEDES.map((s) => `
    <article class="l-board" id="sede-${s.id}" data-color="${s.color}" aria-labelledby="sede-${s.id}-t">
      <span class="l-stop l-stop--sede" data-stop aria-hidden="true"></span>
      <header class="l-board__head">
        <p class="l-board__city">${esc(s.ciudad)}${s.nombreLocal ? ` · ${esc(s.nombreLocal)}` : ''}</p>
        <h3 id="sede-${s.id}-t" class="display l-board__name">${esc(s.zona)}</h3>
        <p class="l-board__barrio">${esc(s.barrio)}</p>
      </header>
      ${statusBadge(s)}
      <p class="l-board__dir"><a href="${s.maps}" target="_blank" rel="noopener">${esc(s.direccion)}<br>${esc(s.cp)}</a></p>
      ${horarioTable(s, 'horario l-board__hours')}
      ${s.horarioTbc ? tbc(s.horarioTbc) : ''}
      <p class="l-board__tel"><a href="tel:${s.telefono.replace(/\s/g, '')}">${esc(s.telefono)}</a></p>
      ${s.telefonoTbc ? tbc(s.telefonoTbc) : ''}
      ${s.especiales ? `<div class="l-board__solo"><h4>Solo en ${esc(s.zona)}</h4><ul>${s.especiales.map((e) => `<li><strong>${esc(e.nombre)}</strong>${e.ing ? ` — ${esc(e.ing)}` : ''}${e.tbc ? ` ${tbc(e.tbc)}` : ''}</li>`).join('')}</ul></div>` : ''}
      <p class="l-board__rating">Google ${s.google.nota} de 5 · ${s.google.resenas} reseñas</p>
      <div class="l-board__actions">${pedirLinks(s, 'btn-plat btn-plat--sm')}</div>
    </article>`).join('')}
  </div>
</section>`;

export const pide = () => `
<section class="l-pide rail-sec" id="pide" aria-labelledby="pide-t" data-rail="pide">
  ${rail()}
  <div class="l-pide__copy">
    <p class="l-kicker">Última parada · Tu casa</p>
    <h2 id="pide-t" class="display l-pide__title">${esc(FRASES.delivery)}</h2>
    <p class="l-pide__p">Elige tu sede y abre Uber Eats o Glovo. También puedes pasar a recogerla.</p>
    ${pedirSelector('l-pedir')}
  </div>
  <figure class="l-ring l-ring--end" data-ring="end">
    ${picture('takeaway', { alt: 'Chica sonriente ofreciendo una caja amarilla de Hasta la Pasta con pasta y tenedor', sizes: '(min-width: 900px) 34vw, 72vw', cls: 'l-ring__pic' })}
  </figure>
</section>`;

export const pie = () => footer('l-foot');
