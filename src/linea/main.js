import '../shared/base.css';
import './linea.css';
import { gsap, ScrollTrigger, EASE, reduced, initScroll } from '../shared/motion.js';
import { initPedir } from '../shared/order.js';
import { initLiveStatus } from '../shared/live-status.js';
import { rounded, route, ringArc, pathEl, sample, reach, pointAt, draw, clear } from './rail.js';

const root = document.documentElement;
if (!reduced) root.classList.add('motion');
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

const head = document.querySelector('[data-head]');
const cajita = document.querySelector('[data-cajita]');
const desk = window.matchMedia('(min-width: 900px)');
const lenis = initScroll({ headerOffset: () => head.offsetHeight });
initPedir();
initLiveStatus();

const TIP = 0.72;       // quota della punta della linea nel viewport
const CORNER = 56;      // raggio delle curve del binario
let rails = [];
let intro = reduced ? 1 : 0;
let heroRingLen = 0;
let heroGeo = null;
let dirty = true;

const cssNum = (name) => parseFloat(getComputedStyle(document.body).getPropertyValue(name)) || 0;

function box(el, origin) {
  const a = el.getBoundingClientRect(), o = origin.getBoundingClientRect();
  return { x: a.left - o.left + a.width / 2, y: a.top - o.top + a.height / 2, top: a.top - o.top, bottom: a.bottom - o.top, left: a.left - o.left, w: a.width, h: a.height };
}

function prep(svg, host) {
  clear(svg);
  const w = host.offsetWidth, h = host.offsetHeight;
  svg.setAttribute('width', w);
  svg.setAttribute('height', h);
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  return { w, h };
}

const nodes = (host) => [...host.querySelectorAll('[data-stop],[data-way]')].filter((el) => el.offsetParent !== null);

function stopRecords(host, list) {
  return list.filter((el) => el.hasAttribute('data-stop')).map((el) => {
    const b = box(el, host);
    const scope = el.closest('.l-step, .l-hist__grid');
    return { el, x: b.x, y: b.y, reveal: scope ? scope.querySelector('[data-reveal]') : null };
  });
}

function addPath(rec, d, color) {
  const el = pathEl(rec.svg, d, `rail__line${color && color !== 'red' ? ` rail__line--${color}` : ''}`);
  rec.paths.push({ el, samp: sample(el) });
}

/* ---- Costruzione per sezione: ognuna parte dalla X d'uscita della precedente ---- */

function buildHero() {
  const host = document.querySelector('.l-hero');
  const svg = host.querySelector(':scope > .rail');
  const { w, h } = prep(svg, host);
  const ring = box(host.querySelector('[data-ring="hero"]'), host);
  const rw = cssNum('--rail-w');
  const R = ring.w / 2 + (desk.matches ? 18 : 10) + rw / 2;
  const { x: cx, y: cy } = ring;
  const top = cy - R;
  let approach, exitX, tail;
  if (desk.matches) {
    const y0 = head.offsetHeight + 34;
    const drop = Math.max(0, top - y0);
    const x1 = Math.max(w * 0.2, cx - R - drop - 90);
    approach = rounded([[-40, y0], [x1, y0], [x1 + drop, top], [cx, top]], CORNER);
    tail = ` L${cx + R} ${h}`;
    exitX = cx + R;
  } else {
    const rail = cssNum('--rail-x');
    const yb = cy + R + 40;
    approach = rounded([[-40, top], [cx, top]], CORNER);
    tail = rounded([[cx + R, cy], [cx + R, yb], [rail, yb], [rail, h]], 36, false);
    exitX = rail;
  }
  const ringD = approach + ringArc(cx, cy, R, 5);
  const probe = pathEl(svg, ringD);
  heroRingLen = probe.getTotalLength();
  probe.remove();
  const rec = { kind: 'hero', host, origin: host, svg, paths: [], stops: [] };
  addPath(rec, ringD + tail);
  rails.push(rec);
  heroGeo = { R, rw };
  return exitX;
}

function buildVertical(host, entryX, svg = host.querySelector(':scope > .rail')) {
  const { h } = prep(svg, host);
  const list = nodes(host);
  const pts = list.map((el) => { const b = box(el, host); return [b.x, b.y]; });
  const lastX = pts.length ? pts[pts.length - 1][0] : entryX;
  const d = rounded(route([[entryX, 0], ...pts, [lastX, h]]), CORNER);
  const rec = { kind: 'v', host, origin: host, svg, paths: [], stops: stopRecords(host, list) };
  addPath(rec, d);
  rails.push(rec);
  return lastX;
}

function buildCartaDesk(entryX) {
  const track = document.querySelector('[data-track]');
  const svg = track.querySelector('.rail');
  const { w, h } = prep(svg, track);
  const list = nodes(track);
  const stops = stopRecords(track, list);
  const lineY = stops[0].y;
  const vw = window.innerWidth;
  const endX = w - vw * 0.5;
  const pts = [[entryX, 0], [entryX, lineY], ...stops.map((s) => [s.x, lineY]), [endX, lineY], [endX, h]];
  const rec = { kind: 'track', host: track, origin: track, svg, paths: [], stops };
  addPath(rec, rounded(pts, CORNER));
  rails.push(rec);
  return vw * 0.5;
}

function buildSedes(entryX) {
  const host = document.querySelector('.l-sedes');
  if (!desk.matches) return buildVertical(host, entryX);
  const svg = host.querySelector(':scope > .rail');
  const { w, h } = prep(svg, host);
  const boards = [...host.querySelectorAll('.l-board')];
  const grid = box(host.querySelector('.l-sedes__grid'), host);
  const jx = w / 2, jy = grid.top - 120;
  const rec = { kind: 'v', host, origin: host, svg, paths: [], stops: stopRecords(host, nodes(host)) };
  addPath(rec, rounded(route([[entryX, 0], [jx, jy]]), CORNER));
  const legs = boards.map((b) => {
    const stop = box(b.querySelector('[data-stop]'), host);
    const card = box(b, host);
    return { color: b.dataset.color, stop, card };
  });
  legs.forEach((l) => addPath(rec, rounded(route([[jx, jy], [l.stop.x, l.stop.y]], { lead: 40 }), 44), l.color));
  // al ritorno le linee si riuniscono al centro; il rosso resta sopra
  [...legs].sort((a) => (a.color === 'red' ? 1 : -1)).forEach((l) =>
    addPath(rec, rounded(route([[l.stop.x, l.card.top + l.card.h + 10], [jx, h]], { lead: 64 }), 44), l.color));
  rails.push(rec);
  return jx;
}

function buildPide(entryX) {
  const host = document.querySelector('.l-pide');
  const svg = host.querySelector(':scope > .rail');
  prep(svg, host);
  const ring = box(host.querySelector('[data-ring="end"]'), host);
  const R = ring.w / 2 + (desk.matches ? 18 : 10) + heroGeo.rw / 2;
  const top = ring.y - R;
  const d = rounded([[entryX, 0], [entryX, top], [ring.x, top]], CORNER) + ringArc(ring.x, ring.y, R, 4);
  const rec = { kind: 'v', host, origin: host, svg, paths: [], stops: [] };
  addPath(rec, d);
  rails.push(rec);
}

function build() {
  rails = [];
  let x = buildHero();
  x = buildVertical(document.querySelector('.l-rec'), x);
  x = desk.matches ? buildCartaDesk(x) : buildVertical(document.querySelector('[data-track]'), x, document.querySelector('[data-track] .rail'));
  x = buildVertical(document.querySelector('.l-hist'), x);
  x = buildSedes(x);
  buildPide(x);
  if (reduced) rails.forEach((r) => { r.paths.forEach((p) => draw(p.el, p.samp, p.samp.L)); r.stops.forEach((s) => { s.el.classList.add('is-reached'); s.reveal?.classList.add('is-in'); }); });
  dirty = true;
}

/* ---- Disegno a ogni frame: la linea arriva fin dove è arrivata la lettura ---- */
let lastY = -1;
function update() {
  const y = window.scrollY;
  if (y !== lastY) head.classList.toggle('is-scrolled', y > 40);
  if (reduced || (!dirty && y === lastY && intro >= 1)) return;
  lastY = y;
  dirty = false;
  const vw = window.innerWidth, vh = window.innerHeight, tipY = TIP * vh;
  let tip = null;
  // prima tutte le letture di layout, poi tutte le scritture: niente reflow forzati (PDF cap. 8)
  const rects = rails.map((r) => r.origin.getBoundingClientRect());
  for (let ri = 0; ri < rails.length; ri++) {
    const r = rails[ri];
    const o = rects[ri];
    const tipX = r.kind === 'track' ? vw * 0.62 : Infinity;
    r.paths.forEach((p, i) => {
      let len = reach(p.samp, o.left, o.top, tipX, tipY);
      if (r.kind === 'hero') len = Math.min(Math.max(len, heroRingLen), intro * heroRingLen + (intro >= 1 ? p.samp.L : 0));
      draw(p.el, p.samp, len);
      // la cajita segue la punta della linea principale visibile
      if (i === 0 && len > 2 && len < p.samp.L - 2) {
        const [x, y] = pointAt(p.samp, len);
        const vx = x + o.left, vy = y + o.top;
        if (vy > 0 && vy < vh && vx > 0 && vx < vw && (!tip || Math.abs(vy - tipY) < Math.abs(tip[1] - tipY))) tip = [vx, vy];
      }
    });
    for (const s of r.stops) {
      const hit = s.x + o.left <= tipX && s.y + o.top <= tipY;
      s.el.classList.toggle('is-reached', hit);
      if (hit && s.reveal) s.reveal.classList.add('is-in');
    }
  }
  if (tip && intro >= 1) {
    cajita.style.transform = `translate3d(${tip[0].toFixed(1)}px, ${tip[1].toFixed(1)}px, 0)`;
    cajita.classList.add('is-on');
  } else cajita.classList.remove('is-on');
  if (intro < 1) dirty = true;
}

/* ---- Carta orizzontale su desktop (pin + scrub, PDF cap. 4) ---- */
function initCarta() {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    const track = document.querySelector('[data-track]');
    const dist = () => track.offsetWidth - window.innerWidth;
    gsap.to(track, {
      x: () => -dist(),
      ease: 'none',
      scrollTrigger: { trigger: '[data-carta]', start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: true, invalidateOnRefresh: true },
    });
  });
}

/* ---- Loader (PDF cap. 5): l'anello del caricamento diventa l'anello della prima fermata ---- */
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function heroIntro() {
  const tl = gsap.timeline({ defaults: { ease: EASE.out } });
  tl.to('.l-hero__title .l-mask > span', { y: 0, yPercent: 0, duration: 1.1, stagger: 0.08 }, 0)
    .to('.l-plate, .l-hero__sub, .l-hero__ctas, .l-legend', { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.25)
    .to(head, { yPercent: 0, duration: 0.9 }, 0.35)
    .to({ v: 0 }, { v: 1, duration: 1.5, ease: 'power2.inOut', onUpdate() { intro = this.targets()[0].v; dirty = true; } }, 0);
  return tl;
}

async function runLoader() {
  const el = document.querySelector('[data-loader]');
  if (reduced || !el) { el?.remove(); root.classList.add('is-loaded'); intro = 1; return; }
  lenis?.stop();
  window.scrollTo(0, 0);
  // titolo e foto restano dipinti sotto il loader (LCP immediato), si muovono solo al reveal
  gsap.set('.l-plate, .l-hero__sub, .l-hero__ctas, .l-legend', { opacity: 0, y: 24 });
  gsap.set(head, { yPercent: -110 });
  const ringFig = document.querySelector('[data-ring="hero"]');
  const img = ringFig.querySelector('img');
  gsap.set(ringFig, { scale: 0.55 });

  const stage = el.querySelector('.l-loader__stage');
  const S = (heroGeo.R * 2) / 0.88;
  el.style.setProperty('--ls', `${S}px`);
  el.style.setProperty('--lsw', (heroGeo.rw * 200) / S);
  const arc = el.querySelector('.l-loader__arc');
  const count = el.querySelector('[data-count]');
  const st = { p: 0 };
  const paint = () => { arc.style.strokeDashoffset = 100 - st.p; count.textContent = Math.round(st.p); };
  const ready = Promise.all([document.fonts.ready, img.decode().catch(() => {}), wait(900)]);
  await gsap.to(st, { p: 88, duration: 0.95, ease: 'power2.out', onUpdate: paint });
  await Promise.race([ready, wait(1500)]); // il loader non supera mai ~2,5 s (PDF cap. 5)
  await gsap.to(st, { p: 100, duration: 0.3, ease: 'power2.inOut', onUpdate: paint });

  const r = ringFig.getBoundingClientRect();
  const dx = r.left + r.width / 2 - window.innerWidth / 2;
  const dy = r.top + r.height / 2 - window.innerHeight / 2;
  const tl = gsap.timeline();
  tl.to([count, el.querySelector('.l-loader__mark')], { opacity: 0, y: -16, duration: 0.35, ease: EASE.in })
    .to(stage, { x: dx, y: dy, duration: 1.05, ease: 'expo.inOut' }, 0.1)
    .to(el.querySelector('.l-loader__bg'), { opacity: 0, duration: 0.8, ease: 'power2.inOut' }, 0.35)
    .to(ringFig, { scale: 1, duration: 1.1, ease: EASE.out }, 0.75)
    .add(heroIntro(), 0.7)
    // scroll e tap tornano appena l'anello è al suo posto, senza aspettare la fine del reveal
    .add(() => { el.querySelector('.l-loader__bg').style.pointerEvents = 'none'; lenis?.start(); }, 1.15)
    .add(() => { el.remove(); root.classList.add('is-loaded'); }, 2.25);
}

/* ---- Avvio ---- */
async function start() {
  await document.fonts.ready;
  build();
  initCarta();
  ScrollTrigger.refresh();
  gsap.ticker.add(update);
  runLoader();
  let t;
  let lastW = window.innerWidth;
  const rebuild = () => { clearTimeout(t); t = setTimeout(() => { build(); ScrollTrigger.refresh(); }, 180); };
  // su mobile la barra degli indirizzi cambia l'altezza a ogni scroll: si ricostruisce solo se cambia la larghezza
  window.addEventListener('resize', () => { if (window.innerWidth !== lastW) { lastW = window.innerWidth; rebuild(); } });
  desk.addEventListener('change', rebuild);
  ScrollTrigger.addEventListener('refresh', () => { dirty = true; });
}
start();
