// Aggiorna "abierto / cerrado" di ogni sede ogni minuto, sull'ora di Madrid.
import { SEDES } from './data.js';
import { sedeStatus } from './status.js';

export function initLiveStatus() {
  const byId = Object.fromEntries(SEDES.map((s) => [s.id, s]));
  const paint = () => {
    document.querySelectorAll('[data-status]').forEach((el) => {
      const s = byId[el.dataset.status];
      if (!s) return;
      const st = sedeStatus(s.horario);
      el.classList.toggle('is-open', st.open);
      el.classList.toggle('is-soon', !!st.closingSoon);
      el.querySelector('.status__text').textContent = st.label;
    });
  };
  paint();
  setInterval(paint, 60_000);
}
