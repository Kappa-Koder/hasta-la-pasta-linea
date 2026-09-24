// Motore della "línea": costruisce i tracciati SVG stile metro a partire dalle fermate nel DOM
// e li disegna seguendo lo scroll (la punta della linea resta a una quota fissa del viewport).
const NS = 'http://www.w3.org/2000/svg';

// Percorso a spezzata con angoli arrotondati (curve quadratiche sul vertice).
export function rounded(pts, r, move = true) {
  if (pts.length < 2) return '';
  let d = move ? `M${pts[0][0]} ${pts[0][1]}` : '';
  for (let i = 1; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
    const l1 = Math.hypot(x1 - x0, y1 - y0), l2 = Math.hypot(x2 - x1, y2 - y1);
    const k = Math.min(r, l1 / 2, l2 / 2);
    if (!k) { d += `L${x1} ${y1}`; continue; }
    const ax = x1 + ((x0 - x1) / l1) * k, ay = y1 + ((y0 - y1) / l1) * k;
    const bx = x1 + ((x2 - x1) / l2) * k, by = y1 + ((y2 - y1) / l2) * k;
    d += `L${ax.toFixed(1)} ${ay.toFixed(1)}Q${x1} ${y1} ${bx.toFixed(1)} ${by.toFixed(1)}`;
  }
  const last = pts[pts.length - 1];
  return d + `L${last[0]} ${last[1]}`;
}

// Da un punto al successivo con la grammatica delle mappe metro: verticale, diagonale a 45°
// quando lo spazio basta, altrimenti corsa orizzontale.
export function route(points, { lead = 48 } = {}) {
  const out = [points[0]];
  for (let i = 1; i < points.length; i++) {
    const [x1, y1] = out[out.length - 1];
    const [x2, y2] = points[i];
    const dx = x2 - x1, dy = y2 - y1;
    if (Math.abs(dx) < 8 && dy > 0) { out.push([x1, y2]); continue; } // stesso binario: niente micro-diagonali
    if (Math.abs(dy) < 1) { out.push([x2, y2]); continue; }
    const a = Math.min(lead, dy / 3);
    if (Math.abs(dx) <= dy - 2 * a) {
      out.push([x1, y1 + a], [x2, y1 + a + Math.abs(dx)], [x2, y2]);
    } else {
      out.push([x1, y1 + a], [x2, y1 + a], [x2, y2]);
    }
  }
  return out;
}

// Cerchio completo che parte dal punto più alto e gira in senso orario per `turns` giri.
export function ringArc(cx, cy, R, quarterTurns) {
  const pts = [[cx, cy - R], [cx + R, cy], [cx, cy + R], [cx - R, cy]];
  let d = '';
  for (let q = 1; q <= quarterTurns; q++) {
    const [x, y] = pts[q % 4];
    d += `A${R} ${R} 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

export function pathEl(svg, d, cls = 'rail__line') {
  const p = document.createElementNS(NS, 'path');
  p.setAttribute('class', cls);
  p.setAttribute('d', d);
  svg.appendChild(p);
  return p;
}

// Campiona il tracciato una volta per ogni build: la regola di "raggiungimento" lavora sui campioni.
export function sample(path, step = 14) {
  const L = path.getTotalLength();
  const n = Math.max(2, Math.ceil(L / step));
  const s = new Float32Array((n + 1) * 3);
  for (let i = 0; i <= n; i++) {
    const l = (L * i) / n;
    const pt = path.getPointAtLength(l);
    s[i * 3] = pt.x; s[i * 3 + 1] = pt.y; s[i * 3 + 2] = l;
  }
  path.style.strokeDasharray = `${L} ${L}`;
  path.style.strokeDashoffset = L;
  return { L, s, n };
}

// Lunghezza del prefisso di tracciato i cui punti stanno sopra/prima della punta.
export function reach(samp, ox, oy, tipX, tipY) {
  const { s, n, L } = samp;
  for (let i = 0; i <= n; i++) {
    const x = s[i * 3] + ox, y = s[i * 3 + 1] + oy;
    if (x > tipX || y > tipY) {
      if (i === 0) return 0;
      // interpolazione dentro l'intervallo di campionamento: la punta avanza fluida, non a scatti
      const px = s[(i - 1) * 3] + ox, py = s[(i - 1) * 3 + 1] + oy, pl = s[(i - 1) * 3 + 2];
      const fx = x > px ? (tipX - px) / (x - px) : 1;
      const fy = y > py ? (tipY - py) / (y - py) : 1;
      const f = Math.max(0, Math.min(1, fx, fy));
      return pl + f * (s[i * 3 + 2] - pl);
    }
  }
  return L;
}

// Punto del tracciato a una data lunghezza, dai campioni (evita getPointAtLength a ogni frame).
export function pointAt(samp, len) {
  const { s, n, L } = samp;
  const i = Math.max(0, Math.min(n, Math.round((len / L) * n)));
  return [s[i * 3], s[i * 3 + 1]];
}

export function draw(path, samp, len) {
  path.style.strokeDashoffset = Math.max(0, samp.L - len);
}

export function clear(svg) {
  while (svg.firstChild) svg.removeChild(svg.firstChild);
}
