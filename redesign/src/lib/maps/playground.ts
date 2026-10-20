/**
 * Client for /dev/maps. Keeps exactly one live map: switching implementation,
 * gestures or the simulated failure destroys the frame and mounts a new one;
 * switching between OpenFreeMap styles swaps the style on the live MapLibre
 * map; layouts are pure CSS on the stage, so the map node never moves.
 */
import { mountMapFrame, type FrameController } from './frame';
import { HUSET_STYLE_URL, OFM_STYLES, type OfmStyleId } from './config';
import { loadEmbed, loadLeaflet, loadMapLibre } from './loaders';
import { IMPLS, IMPL_ORDER, STYLE_ORDER, TREATMENT_ORDER, TREATMENTS, type ImplId, type TreatmentId } from './options';
import { parsePlace } from './place';
import { scaleBar } from './view';
import type { AdapterLoader, GestureMode, MapStatus } from './types';

const LOADERS: Record<ImplId, AdapterLoader> = { a: loadMapLibre, b: loadLeaflet, c: loadMapLibre, d: loadEmbed };

interface State {
  impl: ImplId;
  style: OfmStyleId;
  treatment: TreatmentId;
  gestures: GestureMode;
  fail: boolean;
}

const DEFAULTS: State = { impl: 'c', style: 'positron', treatment: 'editorial', gestures: 'cooperative', fail: false };

function pick<T extends string>(value: string | null, allowed: readonly T[], fallback: T): T {
  return value && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

function readUrl(): State {
  const q = new URLSearchParams(location.search);
  return {
    impl: pick(q.get('impl'), IMPL_ORDER, DEFAULTS.impl),
    style: pick(q.get('style'), STYLE_ORDER, DEFAULTS.style),
    treatment: pick(q.get('layout'), TREATMENT_ORDER, DEFAULTS.treatment),
    gestures: pick(q.get('gestures'), ['cooperative', 'tap'] as const, DEFAULTS.gestures),
    fail: q.get('fail') === '1',
  };
}

function writeUrl(s: State) {
  const q = new URLSearchParams();
  if (s.impl !== DEFAULTS.impl) q.set('impl', s.impl);
  if (s.impl === 'a') q.set('style', s.style);
  if (s.treatment !== DEFAULTS.treatment) q.set('layout', s.treatment);
  if (s.gestures !== DEFAULTS.gestures) q.set('gestures', s.gestures);
  if (s.fail) q.set('fail', '1');
  const search = q.toString();
  history.replaceState(history.state, '', `${location.pathname}${search ? `?${search}` : ''}${location.hash}`);
}

function styleUrlFor(s: State): string | undefined {
  if (s.impl === 'a') return OFM_STYLES[s.style].url;
  if (s.impl === 'c') return HUSET_STYLE_URL;
  return undefined;
}

function styleLabel(s: State): string {
  if (s.impl === 'a') return `OpenFreeMap ${OFM_STYLES[s.style].name}`;
  if (s.impl === 'c') return 'Huset (egen, i prosjektet)';
  return 'OSM standard (fast)';
}

export function mountPlayground(page: HTMLElement): void {
  const q = <T extends Element = HTMLElement>(sel: string) => page.querySelector<T>(sel);
  const form = q<HTMLFormElement>('[data-pg-controls]')!;
  const stage = q('[data-pg-stage]')!;
  const mapRoot = q('[data-pg-map]')!;
  const statusEl = q('[data-pg-status]')!;
  const styleField = q<HTMLFieldSetElement>('[data-pg-style-field]')!;
  const coopInput = q<HTMLInputElement>('input[name="gestures"][value="cooperative"]')!;
  const gestureNote = q('[data-pg-gesture-note]');
  const scale = q('[data-pg-scale]');
  const scaleBarEl = q('[data-pg-scale-bar]');
  const scaleLabel = q('[data-pg-scale-label]');
  const treatmentNote = q('[data-pg-treatment-note]');
  const spec = {
    name: q('[data-pg-name]'),
    renderer: q('[data-pg-renderer]'),
    tiles: q('[data-pg-tiles]'),
    style: q('[data-pg-style]'),
    credit: q('[data-pg-credit]'),
    download: q('[data-pg-download]'),
    production: q('[data-pg-production]'),
  };

  const place = parsePlace(mapRoot.dataset.place);
  let state = readUrl();
  let controller: FrameController | null = null;

  const setChecked = (name: string, value: string | boolean) => {
    for (const input of form.querySelectorAll<HTMLInputElement>(`input[name="${name}"]`)) {
      input.checked = typeof value === 'boolean' ? value : input.value === value;
    }
  };

  const syncControls = () => {
    setChecked('impl', state.impl);
    setChecked('style', state.style);
    setChecked('treatment', state.treatment);
    setChecked('fail', state.fail);
    const embed = state.impl === 'd';
    coopInput.disabled = embed;
    setChecked('gestures', embed ? 'tap' : state.gestures);
    if (gestureNote) gestureNote.hidden = !embed;
    styleField.hidden = state.impl !== 'a';
  };

  const syncInfo = () => {
    const info = IMPLS[state.impl];
    if (spec.name) spec.name.textContent = `${info.letter} · ${info.name}`;
    if (spec.renderer) spec.renderer.textContent = info.renderer;
    if (spec.tiles) spec.tiles.textContent = info.tiles;
    if (spec.style) spec.style.textContent = styleLabel(state);
    if (spec.credit) spec.credit.textContent = info.credit;
    if (spec.download) spec.download.textContent = info.download;
    if (spec.production) spec.production.textContent = info.production;
    for (const el of page.querySelectorAll<HTMLElement>('[data-pg-desc]')) el.hidden = el.dataset.pgDesc !== state.impl;
    for (const el of page.querySelectorAll<HTMLElement>('[data-pg-style-note]')) {
      el.hidden = state.impl !== 'a' || el.dataset.pgStyleNote !== state.style;
    }
    page.dataset.impl = state.impl;
  };

  const syncTreatment = () => {
    stage.dataset.treatment = state.treatment;
    stage.classList.toggle('on-spruce', state.treatment === 'side');
    if (treatmentNote) treatmentNote.textContent = TREATMENTS[state.treatment].note;
  };

  const describe = (s: MapStatus): string => {
    const info = IMPLS[state.impl];
    const what = `${info.letter} · ${info.name}${state.impl === 'a' ? ` · ${OFM_STYLES[state.style].name}` : ''}`;
    if (s.state === 'loading') return `${what}: laster …`;
    if (s.state === 'ready') return `${what}: klar etter ${s.ms.toLocaleString('nb-NO')} ms.`;
    return `${what}: feilet. ${s.reason} Reservevisningen med adresse og lenker vises.`;
  };

  const onStatus = (s: MapStatus) => {
    statusEl.textContent = describe(s);
    statusEl.dataset.state = s.state;
  };

  const onView = (rasterZoom: number, lat: number) => {
    if (!scale || !scaleBarEl || !scaleLabel) return;
    const bar = scaleBar(lat, rasterZoom, 96);
    scaleBarEl.style.width = `${bar.px}px`;
    scaleLabel.textContent = bar.label;
    scale.hidden = false;
  };

  const mount = () => {
    controller?.destroy();
    controller = null;
    if (scale) scale.hidden = true;
    const info = IMPLS[state.impl];
    controller = mountMapFrame(mapRoot, {
      load: LOADERS[state.impl],
      place,
      styleUrl: styleUrlFor(state),
      gestures: state.impl === 'd' ? 'tap' : state.gestures,
      simulateFailure: state.fail,
      title: `Kart over ${place.name}: ${info.name}`,
      onStatus,
      onView,
    });
  };

  const apply = (next: State) => {
    const prev = state;
    state = next;
    writeUrl(state);
    syncControls();
    syncInfo();
    syncTreatment();
    const remount =
      !controller ||
      prev.impl !== next.impl ||
      prev.gestures !== next.gestures ||
      prev.fail !== next.fail;
    if (remount) {
      mount();
    } else if (prev.style !== next.style && next.impl === 'a') {
      const url = styleUrlFor(next)!;
      if (!controller!.setStyle(url)) mount();
    }
  };

  form.addEventListener('change', (e) => {
    const input = e.target as HTMLInputElement;
    const next = { ...state };
    switch (input.name) {
      case 'impl':
        next.impl = input.value as ImplId;
        break;
      case 'style':
        next.style = input.value as OfmStyleId;
        break;
      case 'treatment':
        next.treatment = input.value as TreatmentId;
        break;
      case 'gestures':
        next.gestures = input.value as GestureMode;
        break;
      case 'fail':
        next.fail = input.checked;
        break;
      default:
        return;
    }
    apply(next);
  });
  form.addEventListener('submit', (e) => e.preventDefault());
  q('[data-pg-reset]')?.addEventListener('click', () => controller?.reset());

  syncControls();
  syncInfo();
  syncTreatment();
  mount();

  // The page is a static route, but be tidy if it is ever swapped by a client router.
  document.addEventListener('astro:before-swap', () => controller?.destroy(), { once: true });
}
