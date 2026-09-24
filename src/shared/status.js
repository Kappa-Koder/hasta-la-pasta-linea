// Stato "abierto / cerrado" calcolato sull'ora di Madrid, dagli orari in data.js.
import { DIAS } from './data.js';

const toMin = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
const fmt = (hhmm) => (hhmm === '24:00' ? '00:00' : hhmm);

export function madridNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(date);
  const get = (t) => parts.find((p) => p.type === t).value;
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { day, min: Number(get('hour')) * 60 + Number(get('minute')) };
}

// { open, label, short }
export function sedeStatus(horario, date = new Date()) {
  const { day, min } = madridNow(date);
  const today = horario[day] || [];
  for (const [a, b] of today) {
    if (min >= toMin(a) && min < toMin(b)) {
      const left = toMin(b) - min;
      return { open: true, closingSoon: left <= 30, short: 'Abierto', label: `Abierto · cierra a las ${fmt(b)}` };
    }
  }
  const later = today.find(([a]) => toMin(a) > min);
  if (later) return { open: false, short: 'Cerrado', label: `Cerrado · abre hoy a las ${later[0]}` };
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    const slots = horario[d] || [];
    if (slots.length) {
      const when = i === 1 ? 'mañana' : `el ${DIAS[d].toLowerCase()}`;
      return { open: false, short: 'Cerrado', label: `Cerrado · abre ${when} a las ${slots[0][0]}` };
    }
  }
  return { open: false, short: 'Cerrado', label: 'Cerrado' };
}

// Righe settimanali compatte, lunedì per primo: [{ dias: 'Martes – Domingo', horas: '11:30 – 23:30' }]
export function weekRows(horario) {
  const order = [1, 2, 3, 4, 5, 6, 0];
  const label = (slots) => (slots.length ? slots.map(([a, b]) => `${a}–${fmt(b)}`).join(' · ') : 'Cerrado');
  const rows = [];
  for (const d of order) {
    const h = label(horario[d] || []);
    const last = rows[rows.length - 1];
    if (last && last.horas === h) last.to = d;
    else rows.push({ from: d, to: d, horas: h });
  }
  const short = (d) => DIAS[d].slice(0, 3);
  return rows.map((r) => ({ dias: r.from === r.to ? DIAS[r.from] : `${short(r.from)} – ${short(r.to)}`, horas: r.horas }));
}
