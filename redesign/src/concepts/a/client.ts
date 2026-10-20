import { mountHours, hoursStatus } from '@lib/hours';

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

export function mountConceptA() {
  mountHours();
  mountDay();
  mountRidges();
  mountCredits();
}
