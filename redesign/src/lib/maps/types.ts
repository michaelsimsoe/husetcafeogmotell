import type { LatLon } from '@lib/directions/links';

export type { LatLon };

/** What a map shows and where its links lead. Never hard-coded: the caller passes it in. */
export interface Place {
  /** Full name, used in the popup, the fallback and accessible labels. */
  name: string;
  /** One-line address, e.g. «Meieriveien 7, 8646 Korgen». */
  addressLine: string;
  /** Where the marker sits and the map centres. */
  marker: LatLon;
  /** Where directions links end. */
  destination: LatLon;
  /** Short text on the marker plate, e.g. «Huset». */
  label: string;
}

export interface PlaceLinks {
  google: string;
  apple: string;
  osm: string;
}

/** «To fingre» (cooperative gestures) or «Trykk for å aktivere». */
export type GestureMode = 'cooperative' | 'tap';

export type MapStatus =
  | { state: 'loading' }
  | { state: 'ready'; ms: number }
  | { state: 'error'; reason: string };

export type HintKind = 'wheel' | 'touch' | 'activate';

/** Handed to an adapter by the frame. The adapter owns everything it creates inside `host`. */
export interface AdapterContext {
  host: HTMLElement;
  place: Place;
  /** Zoom in the 256 px raster convention (OSM tiles, Leaflet, the embed). MapLibre subtracts one. */
  rasterZoom: number;
  styleUrl?: string;
  gestures: GestureMode;
  /** Make the real error path run: a missing style, unresolvable tiles or no iframe. */
  simulateFailure: boolean;
  /** Accessible name for the map region. */
  title: string;
  /** The branded marker button, built by the frame. Adapters position it. */
  marker: HTMLButtonElement;
  /** The map has drawn (call again after a style swap). The frame owns the load timeout. */
  ready(): void;
  fail(reason: string): void;
  hint(kind: HintKind): void;
  /** A click or tap on the map itself (not the marker or popup). */
  mapClick(): void;
  /** Reports the current zoom (raster convention) and centre latitude, for the scale bar. */
  viewChanged(rasterZoom: number, lat: number): void;
}

export interface AdapterHandle {
  /** False for the embed: the iframe draws its own marker and has no popup hook. */
  readonly supportsMarker: boolean;
  /** False for the embed: only tap-to-activate is possible over a cross-origin iframe. */
  readonly supportsCooperative: boolean;
  zoomBy(delta: number): void;
  reset(): void;
  setInteractive(on: boolean): void;
  showPopup(content: HTMLElement): void;
  hidePopup(): void;
  setStyle?(url: string): void;
  destroy(): void;
}

export interface AdapterModule {
  mount(ctx: AdapterContext): Promise<AdapterHandle>;
}

export type AdapterLoader = () => Promise<AdapterModule>;
