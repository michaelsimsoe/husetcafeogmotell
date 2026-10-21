/**
 * Client side of `HusetMap.astro`: starts each map when it comes near the
 * viewport and tears it down before an Astro view-transition swap. Safe to
 * call repeatedly; each map root is only started once.
 */
import { parsePlace } from '@lib/maps/place';
import { loadMapLibre } from '@lib/maps/loaders';
import type { FrameController } from '@lib/maps/frame';
import type { GestureMode } from '@lib/maps/types';

const live = new Map<HTMLElement, FrameController>();
let observer: IntersectionObserver | null = null;
let swapHooked = false;

async function start(root: HTMLElement) {
  let place;
  try {
    place = parsePlace(root.dataset.place);
  } catch (err) {
    console.error(err);
    return;
  }
  const { mountMapFrame } = await import('@lib/maps/frame');
  if (!root.isConnected) return;
  const zoom = Number(root.dataset.zoom);
  const gestures: GestureMode = root.dataset.gestures === 'tap' ? 'tap' : 'cooperative';
  const controller = mountMapFrame(root, {
    load: loadMapLibre,
    place,
    styleUrl: root.dataset.style,
    rasterZoom: root.dataset.zoom && Number.isFinite(zoom) ? zoom + 1 : undefined,
    gestures,
    intro: root.dataset.intro === 'glide',
    title: root.dataset.title || undefined,
  });
  live.set(root, controller);
}

export function destroyHusetMaps(): void {
  observer?.disconnect();
  observer = null;
  for (const controller of live.values()) controller.destroy();
  live.clear();
}

export function initHusetMaps(): void {
  const roots = document.querySelectorAll<HTMLElement>('[data-huset-map]:not([data-hm-started])');
  if (!roots.length) return;

  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer?.unobserve(entry.target);
        void start(entry.target as HTMLElement);
      }
    },
    { rootMargin: '300px 0px' },
  );
  for (const root of roots) {
    root.dataset.hmStarted = '';
    observer.observe(root);
  }

  if (!swapHooked) {
    swapHooked = true;
    document.addEventListener('astro:before-swap', destroyHusetMaps);
  }
}
