// Stack del PDF (cap. 1 e 4): GSAP + ScrollTrigger + Lenis, una sola grammatica di movimento (cap. 6).
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const EASE = { move: 'power3.inOut', out: 'expo.out', in: 'power3.in' };
export const DUR = { fast: 0.3, base: 0.6, slow: 1.1 };
export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isTouch = window.matchMedia('(hover: none)').matches;

gsap.defaults({ ease: EASE.move, duration: DUR.base });

let lenis = null;
export function initScroll({ headerOffset = 0 } = {}) {
  if (!reduced) {
    lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    const target = id.length > 1 && document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = typeof headerOffset === 'function' ? headerOffset() : headerOffset;
    if (lenis) lenis.scrollTo(target, { offset: -offset, duration: 1.4 });
    else target.scrollIntoView();
    // niente #ancora nell'URL: al ricaricamento il browser (Safari) ci saltava dopo l'intro
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
  return lenis;
}
export const getLenis = () => lenis;
export { gsap, ScrollTrigger };
