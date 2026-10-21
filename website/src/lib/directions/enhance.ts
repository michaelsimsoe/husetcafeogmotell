/**
 * Progressive enhancement for directions links. The server renders plain
 * HTTPS anchors that work without JavaScript; this upgrades them to the
 * visitor's saved map app or the platform default, and wires «Velg kartapp».
 *
 * Markup contract (destination comes from data attributes, never from here):
 * - `a[data-directions][data-lat][data-lon][data-label]`: a simple link.
 * - `[data-directions-widget][data-lat][data-lon][data-label]` containing
 *   `a[data-dir-primary]`, `[data-dir-app]`, `[data-dir-item=<provider>]`
 *   wrapping `a[data-dir-option=<provider>]` and `[data-dir-mark]`,
 *   `[data-dir-note]` and `button[data-dir-forget]`.
 *
 * No timers, no app detection, no location requests. A tap on a choice saves
 * it and then lets the browser follow the link as normal.
 */

import { toLocale } from '../../i18n/locales.ts';
import { isLatLon } from './links.ts';
import { availableProviders, DEFAULT_CAPABILITIES, detectPlatform, type Capabilities } from './platform.ts';
import { clearPreference, getStorage, isProvider, PREFERENCE_KEY, readPreference, savePreference } from './preferences.ts';
import { hrefFor, resolveDirections, type Destination } from './resolve.ts';
import { directionsText } from './text.ts';

function destinationOf(el: HTMLElement): Destination | null {
  const { lat, lon, label = '' } = el.dataset;
  if (!lat || !lon) return null;
  const point = { lat: Number(lat), lon: Number(lon) };
  return isLatLon(point) ? { point, label } : null;
}

export function mountDirections(root: ParentNode = document, caps: Capabilities = DEFAULT_CAPABILITIES): void {
  const links = [...root.querySelectorAll<HTMLAnchorElement>('a[data-directions]')];
  const widgets = [...root.querySelectorAll<HTMLElement>('[data-directions-widget]')];
  if (!links.length && !widgets.length) return;

  const platform = detectPlatform({ userAgent: navigator.userAgent, maxTouchPoints: navigator.maxTouchPoints });
  const storage = getStorage(window);
  let canRemember = storage !== null;

  const renderWidget = (w: HTMLElement) => {
    const dest = destinationOf(w);
    if (!dest) return;
    // The widget speaks the language of the page (or of the block it sits in).
    const t = directionsText[toLocale(w.closest('[lang]')?.getAttribute('lang'))];
    const saved = readPreference(storage);
    const r = resolveDirections(dest, saved, platform, caps);
    const available = availableProviders(platform, caps);

    const primary = w.querySelector<HTMLAnchorElement>('a[data-dir-primary]');
    if (primary) primary.href = r.href;
    const app = w.querySelector('[data-dir-app]');
    if (app) app.textContent = t.inSentence[r.provider];
    w.dataset.reason = r.reason;

    for (const item of w.querySelectorAll<HTMLElement>('[data-dir-item]')) {
      const p = item.dataset.dirItem;
      if (!isProvider(p)) continue;
      item.hidden = !available.includes(p);
      const a = item.querySelector<HTMLAnchorElement>('a[data-dir-option]');
      if (a) a.href = hrefFor(p, dest, platform, caps);
      // Only the visitor's own choice is marked; a platform default is not a choice.
      const chosen = r.reason === 'saved' && p === r.provider;
      item.toggleAttribute('data-active', chosen);
      const mark = item.querySelector<HTMLElement>('[data-dir-mark]');
      if (mark) mark.hidden = !chosen;
    }

    const note = w.querySelector('[data-dir-note]');
    if (note) {
      note.textContent = !canRemember
        ? t.noMemory
        : r.reason === 'fallback' && saved
          ? t.unavailable(t.names[saved], t.names[r.provider])
          : r.reason === 'saved'
            ? t.remembered
            : t.willRemember;
    }
    const forget = w.querySelector<HTMLButtonElement>('button[data-dir-forget]');
    if (forget) forget.hidden = !saved;
  };

  const render = () => {
    const saved = readPreference(storage);
    for (const a of links) {
      const dest = destinationOf(a);
      if (dest) a.href = resolveDirections(dest, saved, platform, caps).href;
    }
    widgets.forEach(renderWidget);
  };

  for (const w of widgets) {
    w.addEventListener('click', (e) => {
      const target = e.target as Element;
      const option = target.closest<HTMLAnchorElement>('a[data-dir-option]');
      if (option) {
        const p = option.dataset.dirOption;
        if (isProvider(p) && !savePreference(storage, p)) canRemember = false;
        render();
        return; // no preventDefault: the browser follows the link in the same tap
      }
      if (target.closest('button[data-dir-forget]')) {
        clearPreference(storage);
        render();
        w.querySelector<HTMLElement>('summary')?.focus();
      }
    });
  }

  // Keep other open tabs in step with a choice made elsewhere.
  window.addEventListener('storage', (e) => {
    if (e.key === PREFERENCE_KEY || e.key === null) render();
  });

  render();
}
