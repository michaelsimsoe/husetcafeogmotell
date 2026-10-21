/**
 * The map frame: one live map inside `root`, with the controls, gesture hints,
 * popup wiring and failure fallback that every implementation shares. The
 * renderer itself comes from an adapter module that is loaded on demand.
 *
 * `root` should already contain a server-rendered fallback
 * (`[data-hm-fallback]`, see `MapFallback.astro`) so the address and links
 * are there before and without JavaScript; one is built if it is missing.
 *
 * Styles live in `map-ui.css`. The host page or component imports it (as
 * `MapFallback.astro` does) so the build emits it once.
 */
import { createFallback, createMarker, createPopupContent, icon, isMac } from './dom';
import { placeLinks } from './place';
import { isCoarsePointer, prefersReducedMotion } from './view';
import { DEFAULT_RASTER_ZOOM, LOAD_TIMEOUT_MS } from './config';
import type { AdapterContext, AdapterHandle, AdapterLoader, GestureMode, HintKind, MapStatus, Place } from './types';

export interface FrameOptions {
  load: AdapterLoader;
  place: Place;
  /** Raster-convention zoom (Leaflet/OSM). MapLibre uses one less. */
  rasterZoom?: number;
  styleUrl?: string;
  gestures?: GestureMode;
  /** Open zoomed out and glide in to the marker once the map is half on screen. Skipped under reduced motion. */
  intro?: boolean;
  timeoutMs?: number;
  /** Accessible name for the map. */
  title?: string;
  onStatus?(status: MapStatus): void;
  onView?(rasterZoom: number, lat: number): void;
}

export interface FrameController {
  readonly status: MapStatus['state'];
  reset(): void;
  destroy(): void;
}

/** A beat between the map arriving on screen and the glide starting, so the wide view registers. */
const GLIDE_DELAY_MS = 350;

const HINTS: Record<HintKind, () => string> = {
  wheel: () => (isMac() ? 'Hold ⌘ og rull for å zoome' : 'Hold Ctrl og rull for å zoome'),
  touch: () => 'Bruk to fingre for å flytte kartet',
  activate: () => (isCoarsePointer() ? 'Trykk på kartet for å bruke det' : 'Klikk på kartet for å bruke det'),
};

function button(cls: string, label: string, iconName: Parameters<typeof icon>[0], text?: string): HTMLButtonElement {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = cls;
  b.append(icon(iconName));
  if (text) {
    const span = document.createElement('span');
    span.textContent = text;
    b.append(span);
  } else {
    b.setAttribute('aria-label', label);
  }
  return b;
}

export function mountMapFrame(root: HTMLElement, opts: FrameOptions): FrameController {
  const place = opts.place;
  const links = placeLinks(place);
  const timeoutMs = opts.timeoutMs ?? LOAD_TIMEOUT_MS;
  const title = opts.title ?? `Kart som viser ${place.name}`;
  const events = new AbortController();
  const on = { signal: events.signal };

  root.classList.add('hm-frame');
  let fallback = root.querySelector<HTMLElement>('[data-hm-fallback]');
  if (!fallback) {
    fallback = createFallback(place, links);
    root.append(fallback);
  }
  const fallbackTitle = fallback.querySelector<HTMLElement>('[data-hm-fallback-title]');
  if (fallbackTitle) fallbackTitle.hidden = true;

  const host = document.createElement('div');
  host.className = 'hm-host';

  const controls = document.createElement('div');
  controls.className = 'hm-ctl';
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-label', 'Kartvisning');
  const zoomIn = button('hm-btn', 'Zoom inn', 'plus');
  const zoomOut = button('hm-btn', 'Zoom ut', 'minus');
  const resetBtn = button('hm-btn', 'Tilbakestill visning', 'reset');
  controls.append(zoomIn, zoomOut, resetBtn);

  const activateBtn = button('hm-activate', '', 'hand', 'Aktiver kart');
  activateBtn.hidden = true;
  const activateText = activateBtn.querySelector('span')!;

  const hint = document.createElement('div');
  hint.className = 'hm-hint';
  hint.setAttribute('aria-hidden', 'true');
  const hintText = document.createElement('span');
  hint.append(hintText);

  const loading = document.createElement('p');
  loading.className = 'hm-loading';
  loading.textContent = 'Laster kart …';

  const marker = createMarker(place);
  const chrome = [activateBtn, host, controls, hint, loading];
  root.append(...chrome);

  let handle: AdapterHandle | null = null;
  let status: MapStatus['state'] = 'loading';
  let destroyed = false;
  let tapMode = false;
  let active = false;
  let popup: HTMLElement | null = null;
  const started = performance.now();
  let timer = 0;
  let hintTimer = 0;
  let glideTimer = 0;
  let lastHint = 0;
  const intro = (opts.intro ?? false) && !prefersReducedMotion();
  let halfInView = false;
  let glided = !intro;

  const setStatus = (s: MapStatus) => {
    status = s.state;
    root.dataset.state = s.state;
    opts.onStatus?.(s);
  };

  const armTimeout = () => {
    clearTimeout(timer);
    timer = window.setTimeout(() => fail(`Ingen kartdata etter ${Math.round(timeoutMs / 1000)} sekunder.`), timeoutMs);
  };

  /** Runs the glide once: the map has drawn, the adapter is mounted and half the frame is on screen. */
  const maybeGlide = () => {
    if (glided || destroyed || status !== 'ready' || !handle || !halfInView) return;
    glided = true;
    introIo?.disconnect();
    glideTimer = window.setTimeout(() => handle?.glideIn?.(), GLIDE_DELAY_MS);
  };
  const introIo = glided
    ? null
    : new IntersectionObserver(
        (entries) => {
          halfInView = entries.some((x) => x.isIntersecting);
          maybeGlide();
        },
        { threshold: 0.5 },
      );
  introIo?.observe(root);

  const showHint = (kind: HintKind) => {
    const now = performance.now();
    if (kind === hint.dataset.kind && hint.classList.contains('is-on') && now - lastHint < 400) return;
    lastHint = now;
    hint.dataset.kind = kind;
    hintText.textContent = HINTS[kind]();
    hint.classList.add('is-on');
    clearTimeout(hintTimer);
    hintTimer = window.setTimeout(() => hint.classList.remove('is-on'), 1600);
  };

  const closePopup = (returnFocus = false) => {
    if (!popup) return;
    const hadFocus = popup.contains(document.activeElement);
    handle?.hidePopup();
    popup = null;
    marker.setAttribute('aria-expanded', 'false');
    if (returnFocus || hadFocus) marker.focus({ preventScroll: true });
  };

  const openPopup = (fromKeyboard: boolean) => {
    if (!handle?.supportsMarker) return;
    popup = createPopupContent(place, links, () => closePopup(true));
    handle.showPopup(popup);
    marker.setAttribute('aria-expanded', 'true');
    if (fromKeyboard) popup.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
  };

  const setActive = (on: boolean) => {
    if (!tapMode) return;
    active = on;
    root.dataset.active = String(on);
    activateText.textContent = on ? 'Lås kartet' : 'Aktiver kart';
    activateBtn.replaceChild(icon(on ? 'lock' : 'hand'), activateBtn.firstChild!);
    handle?.setInteractive(on);
    if (!on) hint.classList.remove('is-on');
  };

  function fail(reason: string) {
    if (destroyed || status === 'error') return;
    clearTimeout(timer);
    closePopup();
    handle?.destroy();
    handle = null;
    host.replaceChildren();
    for (const node of chrome) node.hidden = true;
    fallback!.hidden = false;
    if (fallbackTitle) fallbackTitle.hidden = false;
    setStatus({ state: 'error', reason });
  }

  const ctx: AdapterContext = {
    host,
    place,
    rasterZoom: opts.rasterZoom ?? DEFAULT_RASTER_ZOOM,
    styleUrl: opts.styleUrl,
    gestures: opts.gestures ?? 'cooperative',
    intro,
    title,
    marker,
    ready() {
      if (destroyed || status !== 'loading') return;
      clearTimeout(timer);
      loading.hidden = true;
      setStatus({ state: 'ready', ms: Math.round(performance.now() - started) });
      maybeGlide();
    },
    fail,
    hint(kind) {
      if (!destroyed && status !== 'error') showHint(kind);
    },
    mapClick() {
      if (popup) closePopup();
      else if (tapMode && !active) setActive(true);
    },
    viewChanged(z, lat) {
      opts.onView?.(z, lat);
    },
  };

  marker.addEventListener('click', (e) => (popup ? closePopup() : openPopup(e.detail === 0)), on);
  zoomIn.addEventListener('click', () => handle?.zoomBy(1), on);
  zoomOut.addEventListener('click', () => handle?.zoomBy(-1), on);
  resetBtn.addEventListener('click', () => handle?.reset(), on);
  activateBtn.addEventListener('click', () => setActive(!active), on);

  // On the document: MapLibre cancels focus on mousedown, so after a click on the marker focus sits on <body>.
  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key !== 'Escape') return;
      const inside = root.contains(document.activeElement);
      if (popup && (inside || document.activeElement === document.body)) {
        closePopup(inside);
        e.stopPropagation();
      } else if (inside && tapMode && active) {
        setActive(false);
        activateBtn.focus({ preventScroll: true });
      }
    },
    on,
  );
  // While locked, scrolling over the map scrolls the page; tell people how to use it.
  root.addEventListener('wheel', () => tapMode && !active && showHint('activate'), { passive: true, signal: events.signal });
  root.addEventListener(
    'touchmove',
    (e) => tapMode && !active && e.touches.length === 1 && showHint('activate'),
    { passive: true, signal: events.signal },
  );

  // Lock again once the map has left the screen, so coming back never traps the scroll.
  const io = new IntersectionObserver((entries) => {
    if (entries.some((x) => !x.isIntersecting) && active) setActive(false);
  });
  io.observe(root);

  setStatus({ state: 'loading' });
  armTimeout();

  opts
    .load()
    .then((mod) => (destroyed || status === 'error' ? null : mod.mount(ctx)))
    .then((h) => {
      if (!h) return;
      if (destroyed || status === 'error') {
        h.destroy();
        return;
      }
      handle = h;
      fallback!.hidden = true;
      tapMode = ctx.gestures === 'tap' || !h.supportsCooperative;
      root.dataset.gestures = tapMode ? 'tap' : 'cooperative';
      activateBtn.hidden = !tapMode;
      if (tapMode) setActive(false);
      maybeGlide();
    })
    .catch((err: unknown) => fail(err instanceof Error ? err.message : String(err)));

  return {
    get status() {
      return status;
    },
    reset() {
      handle?.reset();
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      clearTimeout(timer);
      clearTimeout(hintTimer);
      clearTimeout(glideTimer);
      io.disconnect();
      introIo?.disconnect();
      events.abort();
      handle?.destroy();
      handle = null;
      popup = null;
      for (const node of chrome) node.remove();
      marker.remove();
      fallback!.hidden = false;
      if (fallbackTitle) fallbackTitle.hidden = true;
      delete root.dataset.state;
      delete root.dataset.active;
      delete root.dataset.gestures;
    },
  };
}
