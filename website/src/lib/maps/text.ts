/**
 * Everything the map says, per language: the controls, hints, marker, popup
 * and fallback. The frame picks the table from the page language and hands it
 * to the DOM builders and the adapter.
 */
import type { Locale } from '../../i18n/locales.ts';

export interface MapText {
  /** Accessible name of the map region. */
  region: (name: string) => string;
  /** Accessible name of the marker button. */
  marker: (name: string) => string;
  close: string;
  failed: string;
  loading: string;
  controls: string;
  zoomIn: string;
  zoomOut: string;
  reset: string;
  activate: string;
  lock: string;
  wheel: (mac: boolean) => string;
  touch: string;
  tap: (coarse: boolean) => string;
  google: string;
  apple: string;
  osm: string;
  toggleAttribution: string;
  mapFeedback: string;
}

export const mapText: Record<Locale, MapText> = {
  nb: {
    region: (name) => `Kart som viser ${name}`,
    marker: (name) => `${name}. Vis adresse og veibeskrivelse`,
    close: 'Lukk',
    failed: 'Kartet kunne ikke lastes',
    loading: 'Laster kart …',
    controls: 'Kartvisning',
    zoomIn: 'Zoom inn',
    zoomOut: 'Zoom ut',
    reset: 'Tilbakestill visning',
    activate: 'Aktiver kart',
    lock: 'Lås kartet',
    wheel: (mac) => `Hold ${mac ? '⌘' : 'Ctrl'} og rull for å zoome`,
    touch: 'Bruk to fingre for å flytte kartet',
    tap: (coarse) => `${coarse ? 'Trykk' : 'Klikk'} på kartet for å bruke det`,
    google: 'Veibeskrivelse i Google Maps',
    apple: 'Veibeskrivelse i Apple Maps',
    osm: 'Se stedet på OpenStreetMap',
    toggleAttribution: 'Vis eller skjul kreditering',
    mapFeedback: 'Meld fra om feil i kartet',
  },
  en: {
    region: (name) => `Map showing ${name}`,
    marker: (name) => `${name}. Show address and directions`,
    close: 'Close',
    failed: 'The map couldn’t load',
    loading: 'Loading map …',
    controls: 'Map view',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    reset: 'Reset view',
    activate: 'Use the map',
    lock: 'Lock the map',
    wheel: (mac) => `Hold ${mac ? '⌘' : 'Ctrl'} and scroll to zoom`,
    touch: 'Use two fingers to move the map',
    tap: (coarse) => `${coarse ? 'Tap' : 'Click'} the map to use it`,
    google: 'Directions in Google Maps',
    apple: 'Directions in Apple Maps',
    osm: 'See the place on OpenStreetMap',
    toggleAttribution: 'Show or hide credits',
    mapFeedback: 'Report a map error',
  },
};
