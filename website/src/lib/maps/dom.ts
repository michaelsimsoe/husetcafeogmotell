/**
 * DOM for the parts every implementation shares: the branded marker, the
 * popup body, the static fallback and the control icons. Built once here so
 * MapLibre and Leaflet show exactly the same thing.
 */
import { mapText, type MapText } from './text';
import type { Place, PlaceLinks } from './types';

const SVG_NS = 'http://www.w3.org/2000/svg';

export const ICONS = {
  arrow: 'M2.75 8h10.5M8.75 3.5 13.25 8l-4.5 4.5',
  plus: 'M8 3v10M3 8h10',
  minus: 'M3 8h10',
  close: 'M4 4l8 8M12 4l-8 8',
  // A sight: the view snaps back to the marker.
  reset: 'M8 1.5v3M8 11.5v3M1.5 8h3M11.5 8h3M8 5.25a2.75 2.75 0 1 1 0 5.5 2.75 2.75 0 0 1 0-5.5Z',
  lock: 'M4.5 7.25V5.5a3.5 3.5 0 0 1 7 0v1.75M3.5 7.25h9v6.25h-9z',
  hand: 'M5.5 8.5V3.75a1.25 1.25 0 0 1 2.5 0V7.5m0-.75V2.75a1.25 1.25 0 0 1 2.5 0V7.5m0-3a1.25 1.25 0 0 1 2.5 0v4.25a5 5 0 0 1-5 5h-.4a4.5 4.5 0 0 1-3.5-1.7L2.6 10.4a1.2 1.2 0 0 1 1.8-1.55l1.1 1.15',
} as const;

export type IconName = keyof typeof ICONS;

export function icon(name: IconName, cls = 'hm-icon'): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', cls);
  svg.setAttribute('viewBox', '0 0 16 16');
  svg.setAttribute('width', '16');
  svg.setAttribute('height', '16');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.5');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', ICONS[name]);
  svg.append(path);
  return svg;
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = cls;
  if (text != null) node.textContent = text;
  return node;
}

/**
 * The here-mark from concept A: a copper dot with a copper ring, a hairline
 * stem and the place's short name in italic on a whitewash plate. The 44 px
 * button is centred on the coordinate; the plate sits above-right of it.
 */
export function createMarker(place: Place, t: MapText = mapText.nb): HTMLButtonElement {
  const button = el('button', 'hm-marker');
  button.type = 'button';
  button.setAttribute('aria-label', t.marker(place.name));
  button.setAttribute('aria-expanded', 'false');
  const stem = el('span', 'hm-marker__stem');
  const plate = el('span', 'hm-marker__plate', place.label);
  const dot = el('span', 'hm-marker__dot');
  for (const part of [stem, plate, dot]) part.setAttribute('aria-hidden', 'true');
  button.append(stem, plate, dot);
  return button;
}

/** The three onward links, in order. Shared with `MapFallback.astro`. */
export function linkItems(links: PlaceLinks, t: MapText = mapText.nb): [text: string, href: string][] {
  return [
    [t.google, links.google],
    [t.apple, links.apple],
    [t.osm, links.osm],
  ];
}

function linkRows(links: PlaceLinks, cls: string, t: MapText): HTMLUListElement {
  const list = el('ul', cls);
  for (const [text, href] of linkItems(links, t)) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = href;
    a.append(el('span', '', text), icon('arrow', 'hm-arr'));
    li.append(a);
    list.append(li);
  }
  return list;
}

/** Popup body: name, address, three links and a close button (last in DOM so focus lands on the first link). */
export function createPopupContent(place: Place, links: PlaceLinks, onClose: () => void, t: MapText = mapText.nb): HTMLElement {
  const box = el('div', 'hm-pop');
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-label', place.name);
  box.append(el('p', 'hm-pop__name', place.name), el('p', 'hm-pop__addr', place.addressLine), linkRows(links, 'hm-links', t));
  const close = el('button', 'hm-pop__close');
  close.type = 'button';
  close.setAttribute('aria-label', t.close);
  close.append(icon('close'));
  close.addEventListener('click', onClose);
  box.append(close);
  return box;
}

/** Same content as `MapFallback.astro`, for frames that were not server-rendered with one. */
export function createFallback(place: Place, links: PlaceLinks, t: MapText = mapText.nb): HTMLElement {
  const box = el('div', 'hm-fallback');
  box.dataset.hmFallback = '';
  const title = el('p', 'hm-fallback__title', t.failed);
  title.dataset.hmFallbackTitle = '';
  title.hidden = true;
  box.append(title, el('p', 'hm-fallback__name', place.name), el('p', 'hm-fallback__addr', place.addressLine), linkRows(links, 'hm-links', t));
  return box;
}

export function isMac(): boolean {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = nav.userAgentData?.platform ?? navigator.platform ?? '';
  return /mac|iphone|ipad/i.test(platform);
}

/**
 * Adds a map library's CSS when its adapter mounts, so the page never links it
 * up front. It goes first in <head> so the project's own map styles still win.
 */
export function injectCss(id: string, css: string): void {
  if (document.querySelector(`style[data-hm-css="${id}"]`)) return;
  const style = document.createElement('style');
  style.dataset.hmCss = id;
  style.textContent = css;
  document.head.prepend(style);
}
