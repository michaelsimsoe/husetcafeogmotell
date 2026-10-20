import { mountHours, hoursStatus } from '@lib/hours';
import { mountDirections } from '@lib/directions/enhance';

/** Weekday name for the masthead, plus un-hiding the bits that only make sense with live data. */
function mountDay() {
  const run = () => {
    const s = hoursStatus();
    document.querySelectorAll<HTMLElement>('[data-a-day]').forEach((el) => {
      el.textContent = s.today.label;
    });
    document.querySelectorAll<HTMLElement>('[data-a-live]').forEach((el) => el.removeAttribute('hidden'));
  };
  run();
  window.setInterval(run, 60_000);
}

/*
 * The skyline rule draws itself once, when it comes into view.
 * It is only armed when motion is welcome; otherwise (and without JS) every line is simply there.
 * The path is rewritten in pixel units first so the dash length is exact.
 */
function arm(svg: SVGSVGElement) {
  const path = svg.querySelector('path');
  if (!path) return false;
  const r = svg.getBoundingClientRect();
  const vb = svg.viewBox.baseVal;
  if (!r.width || !r.height || !vb.width || !vb.height) return false;
  const sx = r.width / vb.width;
  const sy = r.height / vb.height;
  const nums = (path.getAttribute('d') ?? '').match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  const pts: string[] = [];
  for (let i = 0; i + 1 < nums.length; i += 2) pts.push(`${(nums[i] * sx).toFixed(2)} ${(nums[i + 1] * sy).toFixed(2)}`);
  svg.setAttribute('viewBox', `0 0 ${r.width.toFixed(2)} ${r.height.toFixed(2)}`);
  path.setAttribute('d', 'M' + pts.join(' L'));
  const len = Math.ceil(path.getTotalLength()) + 2;
  path.style.strokeDasharray = `${len} ${len}`;
  path.style.strokeDashoffset = String(len);
  return true;
}

function draw(svg: SVGSVGElement) {
  const path = svg.querySelector('path');
  if (!path) return;
  requestAnimationFrame(() => {
    path.classList.add('is-drawing');
    requestAnimationFrame(() => {
      path.style.strokeDashoffset = '0';
    });
  });
  const done = () => {
    path.classList.remove('is-drawing');
    path.style.strokeDasharray = '';
    path.style.strokeDashoffset = '';
  };
  path.addEventListener('transitionend', done, { once: true });
  window.setTimeout(done, 2600);
}

function mountRidges() {
  if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        draw(e.target as SVGSVGElement);
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  document.querySelectorAll<SVGSVGElement>('[data-ridge] svg').forEach((svg) => {
    if (arm(svg)) io.observe(svg);
  });
}

/** A credit that is longer than its photo is tall is set flat under the photo instead of being cut off. */
function mountCredits() {
  const figs = [...document.querySelectorAll<HTMLElement>('.ph')];
  if (!figs.length || !('ResizeObserver' in window)) return;
  const fit = (fig: HTMLElement) => {
    const credit = fig.querySelector<HTMLElement>('.ph-credit');
    if (!credit) return;
    fig.classList.remove('ph--flat');
    if (getComputedStyle(credit).position !== 'absolute') return;
    if (credit.scrollHeight > credit.clientHeight + 1) fig.classList.add('ph--flat');
  };
  const ro = new ResizeObserver((entries) => entries.forEach((e) => fit(e.target.closest<HTMLElement>('.ph')!)));
  figs.forEach((fig) => {
    const img = fig.querySelector('img');
    if (img) ro.observe(img);
  });
  document.fonts?.ready.then(() => figs.forEach(fit));
}

/*
 * «Her ligger Korgen»: one authored moment, and again only the line moves.
 * The map zooms from all of Norway to Helgeland, the road draws north from Trondheim to Bodø,
 * then the stretch from Mosjøen to Mo i Rana lifts off the map and lays itself down as the height profile.
 * Armed only when motion is welcome and the map starts below the fold; otherwise (and without JS) the final state just shows.
 */
type XY = [number, number];
const nums = (s: string) => s.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
const pairs = (s: string): XY[] => {
  const n = nums(s);
  const out: XY[] = [];
  for (let i = 0; i + 1 < n.length; i += 2) out.push([n[i], n[i + 1]]);
  return out;
};
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));
const pathOf = (pts: XY[]) => 'M' + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L');

function mountLocator() {
  const sec = document.querySelector<HTMLElement>('[data-loc]');
  if (!sec) return;
  if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
  if (!('IntersectionObserver' in window)) return;
  const map = sec.querySelector<SVGSVGElement>('[data-loc-map]');
  const road = sec.querySelector<SVGPathElement>('[data-loc-road]');
  const stretch = sec.querySelector<SVGPathElement>('[data-loc-stretch]');
  const prof = sec.querySelector<SVGSVGElement>('[data-loc-profile]');
  const fly = sec.querySelector<SVGSVGElement>('[data-loc-fly]');
  const flyPath = fly?.querySelector('path');
  const box = map?.parentElement;
  if (!map || !road || !stretch || !prof || !fly || !flyPath || !box) return;
  if (box.getBoundingClientRect().top < window.innerHeight) return;

  const roadD = road.getAttribute('d') ?? '';
  const roadPts = pairs(roadD);
  const from = pairs(flyPath.dataset.from ?? '');
  const to = pairs(flyPath.dataset.to ?? '');
  const region = map.getAttribute('viewBox') ?? '';
  const r0 = nums(map.dataset.full ?? '');
  const r1 = nums(region);
  if (roadPts.length < 2 || from.length < 2 || from.length !== to.length || r0.length !== 4 || r1.length !== 4) return;

  const cum = [0];
  for (let i = 1; i < roadPts.length; i++) {
    const [ax, ay] = roadPts[i - 1];
    const [bx, by] = roadPts[i];
    cum.push(cum[i - 1] + Math.hypot(bx - ax, by - ay));
  }
  const total = cum[cum.length - 1];
  const marks = [...sec.querySelectorAll<Element>('[data-at]')].map((el) => ({ el, at: Number(el.getAttribute('data-at') ?? 0) }));
  const on = (sel: string) => sec.querySelectorAll(sel).forEach((el) => el.classList.add('is-on'));

  sec.classList.add('is-armed');
  map.setAttribute('viewBox', r0.join(' '));
  road.setAttribute('d', '');

  const zoom = (t: number) => {
    const e = easeInOut(t);
    const w = r0[2] * (r1[2] / r0[2]) ** e;
    const h = r0[3] * (r1[3] / r0[3]) ** e;
    const k = (r0[2] - w) / (r0[2] - r1[2]);
    const cx = r0[0] + r0[2] / 2 + (r1[0] + r1[2] / 2 - (r0[0] + r0[2] / 2)) * k;
    const cy = r0[1] + r0[3] / 2 + (r1[1] + r1[3] / 2 - (r0[1] + r0[3] / 2)) * k;
    map.setAttribute('viewBox', `${(cx - w / 2).toFixed(2)} ${(cy - h / 2).toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)}`);
  };

  const drawTo = (f: number) => {
    const L = f * total;
    let i = 1;
    while (i < cum.length && cum[i] < L) i++;
    const pts = roadPts.slice(0, i);
    if (i < roadPts.length) {
      const [ax, ay] = roadPts[i - 1];
      const [bx, by] = roadPts[i];
      const u = (L - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
      pts.push([ax + (bx - ax) * u, ay + (by - ay) * u]);
    }
    road.setAttribute('d', pathOf(pts));
    for (const m of marks) if (f >= m.at - 0.001) m.el.classList.add('is-on');
  };

  // Screen positions are taken once, relative to the overlay, so scrolling mid-flight does not matter.
  const project = (svg: SVGSVGElement, pts: XY[]): XY[] => {
    const m = svg.getScreenCTM();
    const o = fly.getBoundingClientRect();
    if (!m) return [];
    return pts.map(([x, y]) => {
      const p = new DOMPoint(x, y).matrixTransform(m);
      return [p.x - o.left, p.y - o.top];
    });
  };

  const ZOOM = 900, DRAW_AT = 850, DRAW = 950, FLY = 1250, STAGGER = 0.38;
  // 0 armed · 1 zooming and drawing · 2 drawn, waiting for the profile to be in view · 3 unrolling
  let phase = 0;
  const seen = { map: 0, prof: 0 };
  const profInView = () => seen.prof >= 0.85;

  const zoomAndDraw = (t0: number) => {
    let zoomed = false;
    const step = (now: number) => {
      const t = now - t0;
      if (t < ZOOM + 16) zoom(clamp01(t / ZOOM));
      if (t >= DRAW_AT) {
        if (!zoomed) {
          zoomed = true;
          map.setAttribute('viewBox', region);
          on('.loc-inset');
        }
        drawTo(easeInOut(clamp01((t - DRAW_AT) / DRAW)));
      }
      if (t < DRAW_AT + DRAW) return void requestAnimationFrame(step);
      road.setAttribute('d', roadD);
      phase = 2;
      if (profInView()) unroll();
    };
    requestAnimationFrame(step);
  };

  const unroll = () => {
    phase = 3;
    io.disconnect();
    const a = project(map, from);
    const b = project(prof, to);
    const n = a.length - 1;
    const lift = Math.min(64, Math.max(32, fly.getBoundingClientRect().width * 0.04));
    fly.style.opacity = '1';
    let t0 = 0;
    let lit = 0;
    const step = (now: number) => {
      t0 ||= now;
      const g = clamp01((now - t0) / FLY);
      const pts: XY[] = a.map(([ax, ay], i) => {
        const u = easeOutExpo(clamp01((g - (i / n) * STAGGER) / (1 - STAGGER)));
        const [bx, by] = b[i];
        return [ax + (bx - ax) * u, ay + (by - ay) * u - Math.sin(Math.PI * u) * lift];
      });
      flyPath.setAttribute('d', pathOf(pts));
      flyPath.style.strokeWidth = (4.5 - 2.5 * easeOutExpo(g)).toFixed(2);
      if (g > 0.45 && lit < 1) {
        lit = 1;
        on('.loc-terrain');
      }
      if (g > 0.7 && lit < 2) {
        lit = 2;
        on('.loc-pl, .loc-huset, .loc-600');
      }
      if (g < 1) return void requestAnimationFrame(step);
      on('.loc-open, .loc-tunnel');
      fly.style.transition = 'opacity 0.6s';
      fly.style.opacity = '0';
      window.setTimeout(() => {
        flyPath.removeAttribute('d');
        sec.classList.remove('is-armed');
      }, 1600);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) seen[e.target === prof ? 'prof' : 'map'] = e.intersectionRatio;
      if (phase === 0 && (seen.map >= 0.5 || profInView())) {
        phase = 1;
        requestAnimationFrame(zoomAndDraw);
      } else if (phase === 2 && profInView()) unroll();
    },
    { threshold: [0, 0.25, 0.5, 0.75, 0.85, 1] },
  );
  io.observe(box);
  io.observe(prof);
}

export function mountConceptA() {
  mountHours();
  mountDay();
  mountRidges();
  mountLocator();
  mountCredits();
  mountDirections();
}
