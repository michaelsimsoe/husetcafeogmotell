/**
 * Builds src/data/norway-map.json for concept A's «Her ligger Korgen» section.
 *
 *   node scripts/build-map.mjs
 *
 * - Land: Natural Earth 1:10m admin-0 countries (public domain), Norway plus Sweden and Finland for context.
 * - Road: the driving route Trondheim – Korgen – Bodø from OSRM on OpenStreetMap data (© OpenStreetMap contributors, ODbL).
 * - The Mosjøen – Mo i Rana stretch reuses src/data/route-e6.json point for point, so it can unroll into the height profile.
 *
 * Everything is projected to transverse Mercator on a sphere, central meridian 15° E (the UTM 33 view of Norway),
 * in kilometres, with y growing southwards and the origin at the top left of the whole-Norway frame.
 */
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const cache = path.join(os.tmpdir(), 'huset-map-cache');

const NE_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries.geojson';
const HUSET = [13.8257, 66.0808];
const TRONDHEIM = [10.3951, 63.4305];
const BODO = [14.4049, 67.2804];
const OSRM_URL = `https://router.project-osrm.org/route/v1/driving/${[TRONDHEIM, HUSET, BODO].map((p) => p.join(',')).join(';')}?overview=full&geometries=geojson`;

// ——— Projection ———
const R = 6371;
const D = Math.PI / 180;
const LON0 = 15;
function tm([lon, lat]) {
  const l = (lon - LON0) * D;
  const p = lat * D;
  const b = Math.cos(p) * Math.sin(l);
  return [R * 0.5 * Math.log((1 + b) / (1 - b)), -R * Math.atan2(Math.tan(p), Math.cos(l))];
}

// ——— Geometry helpers ———
function perpDist([px, py], [ax, ay], [bx, by]) {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  if (!len2) return Math.hypot(px - ax, py - ay);
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

/** Douglas–Peucker, iterative, endpoints kept. */
function simplify(pts, tol) {
  if (pts.length < 3) return pts.slice();
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    let max = 0;
    let idx = -1;
    for (let i = a + 1; i < b; i++) {
      const d = perpDist(pts[i], pts[a], pts[b]);
      if (d > max) {
        max = d;
        idx = i;
      }
    }
    if (max > tol && idx > 0) {
      keep[idx] = 1;
      stack.push([a, idx], [idx, b]);
    }
  }
  return pts.filter((_, i) => keep[i]);
}

/** Simplify a closed ring with a tolerance that depends on where each run of points lies. */
function simplifyRing(ring, tolAt) {
  const tols = ring.map(tolAt);
  const out = [];
  let start = 0;
  for (let i = 1; i <= ring.length; i++) {
    if (i === ring.length || tols[i] !== tols[start]) {
      const run = ring.slice(start, Math.min(i + 1, ring.length));
      const s = simplify(run, tols[start]);
      out.push(...(out.length ? s.slice(1) : s));
      start = i;
    }
  }
  return out;
}

const area = (ring) => {
  let s = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) s += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
  return Math.abs(s / 2);
};

const bboxOf = (pts) => {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of pts) {
    if (x < x0) x0 = x;
    if (y < y0) y0 = y;
    if (x > x1) x1 = x;
    if (y > y1) y1 = y;
  }
  return { x0, y0, x1, y1 };
};

async function cached(name, url) {
  await fs.mkdir(cache, { recursive: true });
  const file = path.join(cache, name);
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url}: ${res.status}`);
    const text = await res.text();
    await fs.writeFile(file, text);
    return JSON.parse(text);
  }
}

// ——— Inputs ———
const ne = await cached('ne_10m_admin_0_countries.geojson', NE_URL);
const osrm = await cached('osrm-trondheim-korgen-bodo.json', OSRM_URL);
const e6 = JSON.parse(await fs.readFile(path.join(root, 'src/data/route-e6.json'), 'utf8'));

const country = (name) => {
  const f = ne.features.find((x) => x.properties.ADMIN === name);
  if (!f) throw new Error(`No ${name} in Natural Earth`);
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  // Mainland Scandinavia only: drops Svalbard, Jan Mayen and Bouvet Island.
  return polys
    .map((poly) => poly[0])
    .filter((ring) => ring.every(([lon, lat]) => lat < 71.5 && lat > 54 && lon > 3));
};

const route = osrm.routes[0];
const routeLL = route.geometry.coordinates;
const routeXY = routeLL.map(tm);

// ——— Frames ———
const norwayRings = country('Norway').map((r) => r.map(tm));
const nb = bboxOf(norwayRings.flat());
const PAD_FULL = 40;
const ox = nb.x0 - PAD_FULL;
const oy = nb.y0 - PAD_FULL;
const shift = ([x, y]) => [x - ox, y - oy];
const full = { x: 0, y: 0, w: nb.x1 - nb.x0 + 2 * PAD_FULL, h: nb.y1 - nb.y0 + 2 * PAD_FULL };

// Trondheim–Bodø, nudged east so Korgen's label has room inside the frame, with fixed proportions.
const rb = bboxOf(routeXY.map(shift));
const ASPECT = 0.74; // width / height
const regionH = rb.y1 - rb.y0 + 2 * 34;
const regionW = regionH * ASPECT;
const cx = (rb.x0 + rb.x1) / 2 + 2;
const region = { x: cx - regionW / 2, y: rb.y0 - 34, w: regionW, h: regionH };
const inRegion = ([x, y], m = 30) =>
  x > region.x - m && x < region.x + region.w + m && y > region.y - m && y < region.y + region.h + m;

// ——— Paths ———
const f1 = (n) => (Math.round(n * 10) / 10).toString();
const f2 = (n) => (Math.round(n * 100) / 100).toString();
const ringPath = (ring, fmt = f1) => {
  let d = '';
  let last = '';
  ring.forEach(([x, y], i) => {
    const s = `${fmt(x)} ${fmt(y)}`;
    if (s === last) return;
    d += (i ? 'L' : 'M') + s;
    last = s;
  });
  return d + 'Z';
};

function landPath(rings, { near, far, minNear, minFar }) {
  const parts = [];
  for (const raw of rings) {
    const ring = raw.map(shift);
    const touches = ring.some((p) => inRegion(p));
    if (area(ring) < (touches ? minNear : minFar)) continue;
    const s = simplifyRing(ring, (p) => (inRegion(p) ? near : far));
    if (s.length >= 4) parts.push(ringPath(s));
  }
  return parts.join('');
}

const norway = landPath(country('Norway').map((r) => r.map(tm)), { near: 0.6, far: 3, minNear: 6, minFar: 80 });
const neighbours = landPath([...country('Sweden'), ...country('Finland')].map((r) => r.map(tm)), {
  near: 0.6,
  far: 2.5,
  minNear: 20,
  minFar: 200,
});
const inset = landPath(country('Norway').map((r) => r.map(tm)), { near: 12, far: 12, minNear: 1500, minFar: 1500 });

// Road: Trondheim → Korgen → Bodø.
const roadXY = simplify(routeXY.map(shift), 0.12);
const cum = [0];
for (let i = 1; i < roadXY.length; i++) cum.push(cum[i - 1] + Math.hypot(roadXY[i][0] - roadXY[i - 1][0], roadXY[i][1] - roadXY[i - 1][1]));
const total = cum[cum.length - 1];
const fracAt = (pt) => {
  let best = 0;
  let bd = Infinity;
  roadXY.forEach((p, i) => {
    const d = Math.hypot(p[0] - pt[0], p[1] - pt[1]);
    if (d < bd) {
      bd = d;
      best = i;
    }
  });
  return cum[best] / total;
};

const e6pts = e6.points;
const mosjoen = [e6pts[0][2], e6pts[0][3]];
const moirana = [e6pts[e6pts.length - 1][2], e6pts[e6pts.length - 1][3]];
const cities = [
  { id: 'trondheim', name: 'Trondheim', ll: TRONDHEIM },
  { id: 'mosjoen', name: 'Mosjøen', ll: mosjoen },
  { id: 'korgen', name: 'Korgen', ll: HUSET },
  { id: 'moirana', name: 'Mo i Rana', ll: moirana },
  { id: 'bodo', name: 'Bodø', ll: BODO },
].map((c) => {
  const [x, y] = shift(tm(c.ll));
  return { id: c.id, name: c.name, lon: c.ll[0], lat: c.ll[1], x: +f2(x), y: +f2(y), at: +fracAt([x, y]).toFixed(4) };
});

// Where to set the small «E6» tag: on the road at about 64.85° N.
const tagIdx = routeLL.reduce((best, p, i) => (Math.abs(p[1] - 64.85) < Math.abs(routeLL[best][1] - 64.85) ? i : best), 0);
const [tagX, tagY] = shift(routeXY[tagIdx]);

const legs = route.legs.map((l) => ({ km: Math.round(l.distance / 100) / 10, min: Math.round(l.duration / 60) }));

const out = {
  source: {
    land: 'Natural Earth 1:10m admin 0 countries (public domain)',
    road: 'OpenStreetMap-data via OSRM (© OpenStreetMap-bidragsytere, ODbL)',
    projection: 'Transversal Mercator (kule), sentralmeridian 15° Ø, km; y øker sørover.',
  },
  full: { x: 0, y: 0, w: +f1(full.w), h: +f1(full.h) },
  region: { x: +f1(region.x), y: +f1(region.y), w: +f1(region.w), h: +f1(region.h) },
  norway,
  neighbours,
  inset,
  road: ringPath(roadXY).replace(/Z$/, ''),
  roadKm: Math.round(route.distance / 100) / 10,
  legs: { trondheim: legs[0], bodo: legs[1] },
  e6Tag: { x: +f1(tagX), y: +f1(tagY) },
  cities,
  /** route-e6.json points, one for one, in map coordinates. */
  stretch: e6pts.map((p) => shift(tm([p[2], p[3]])).map((n) => +f2(n))),
};

const file = path.join(root, 'src/data/norway-map.json');
await fs.writeFile(file, JSON.stringify(out));
const kb = (s) => (Buffer.byteLength(s) / 1024).toFixed(1) + ' kB';
console.log(`wrote ${path.relative(root, file)} (${kb(JSON.stringify(out))})`);
console.log(`  norway ${kb(norway)} · neighbours ${kb(neighbours)} · inset ${kb(inset)} · road ${kb(out.road)} (${roadXY.length} pts)`);
console.log(`  full ${out.full.w}×${out.full.h} km · region ${out.region.w}×${out.region.h} km at ${out.region.x},${out.region.y}`);
console.log(`  legs`, out.legs, `total ${out.roadKm} km`);
console.log(`  cities`, cities.map((c) => `${c.name} ${c.x},${c.y} @${c.at}`).join(' · '));
