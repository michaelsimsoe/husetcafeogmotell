/**
 * Pure URL builders for driving directions and map links. No DOM, no globals:
 * safe on the server and under `node --test`.
 *
 * Formats follow each provider's documentation, including how it writes the
 * coordinate pair (Google and Waze encode the comma, Apple and Android do not):
 * - Google Maps URLs: https://developers.google.com/maps/documentation/urls/get-started
 * - Apple unified Maps URLs (iOS 18.4+, macOS 15.4+): https://developer.apple.com/documentation/mapkit/unified-map-urls
 * - Apple legacy Map Links: https://developer.apple.com/library/archive/featuredarticles/iPhoneURLScheme_Reference/MapLinks/MapLinks.html
 * - Waze deep links: https://developers.google.com/waze/deeplinks
 * - Android geo: intents: https://developer.android.com/guide/components/intents-common#Maps
 * - Android google.navigation: https://developer.android.com/guide/components/google-maps-intents
 * - Apple geo-navigation: https://developer.apple.com/documentation/mapkit/preparing-your-app-to-be-the-default-navigation-app
 */

export interface LatLon {
  lat: number;
  lon: number;
}

/** `system` hands the destination to the operating system's own map handler. */
export type Provider = 'system' | 'google' | 'apple' | 'waze';
export const PROVIDERS: readonly Provider[] = ['system', 'google', 'apple', 'waze'];

export const PROVIDER_NAMES: Record<Provider, string> = {
  system: 'Standard kartapp',
  google: 'Google Maps',
  apple: 'Apple Maps',
  waze: 'Waze',
};

/** How the provider reads inside «Åpnes i …». */
export const PROVIDER_IN_SENTENCE: Record<Provider, string> = {
  system: 'kartappen din',
  google: 'Google Maps',
  apple: 'Apple Maps',
  waze: 'Waze',
};

export function isLatLon(value: unknown): value is LatLon {
  if (typeof value !== 'object' || value === null) return false;
  const { lat, lon } = value as Record<string, unknown>;
  return (
    typeof lat === 'number' &&
    typeof lon === 'number' &&
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180
  );
}

export function assertLatLon(value: unknown): LatLon {
  if (!isLatLon(value)) throw new RangeError(`Invalid destination coordinate: ${JSON.stringify(value)}`);
  return value;
}

/** Six decimals (about 0.1 m), trailing zeros trimmed, never exponent notation. */
function fixed(n: number): string {
  const s = n.toFixed(6).replace(/\.?0+$/, '');
  return s === '-0' ? '0' : s;
}

/** "66.081075,13.825683" */
export function formatLatLon(point: LatLon): string {
  const p = assertLatLon(point);
  return `${fixed(p.lat)},${fixed(p.lon)}`;
}

/** Percent-encodes everything outside the unreserved set, including ( ) ! ' * which encodeURIComponent leaves alone. */
function encodeStrict(text: string): string {
  return encodeURIComponent(text).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

function cleanLabel(label: unknown): string {
  if (typeof label !== 'string') return '';
  return label.replace(/\s+/g, ' ').trim().slice(0, 80);
}

/** Opens Google Maps (app or web) with driving directions from the visitor's own position. */
export function googleDirections(dest: LatLon): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeStrict(formatLatLon(dest))}&travelmode=driving&dir_action=navigate`;
}

/**
 * Apple Maps directions. The unified `/directions` form is documented for
 * iOS 18.4+ and macOS 15.4+; older systems understand the legacy `daddr` form.
 */
export function appleDirections(dest: LatLon, { legacy = false }: { legacy?: boolean } = {}): string {
  const ll = formatLatLon(dest);
  return legacy
    ? `https://maps.apple.com/?daddr=${ll}&dirflg=d`
    : `https://maps.apple.com/directions?destination=${ll}&mode=driving`;
}

/** Opens Waze when installed, otherwise its web live map. */
export function wazeDirections(dest: LatLon): string {
  return `https://waze.com/ul?ll=${encodeStrict(formatLatLon(dest))}&navigate=yes`;
}

/**
 * Android's provider-neutral map intent. It shows the place, not a route: the
 * visitor's default map app (or a chooser) opens with a labelled pin.
 */
export function systemGeoUri(dest: LatLon, label?: string): string {
  const name = cleanLabel(label);
  return `geo:0,0?q=${formatLatLon(dest)}${name ? `(${encodeStrict(name)})` : ''}`;
}

/** Google Maps' own Android navigation intent. Not provider-neutral; only works when Google Maps is installed. */
export function googleNavigationIntent(dest: LatLon): string {
  return `google.navigation:q=${formatLatLon(dest)}&mode=d`;
}

/**
 * Apple's default-navigation-app scheme. Documented for the EU (iOS 18.4+)
 * and Japan (iOS 26.2+) only, so it stays behind an off-by-default flag.
 */
export function appleSystemNavigation(dest: LatLon): string {
  return `geo-navigation:///directions?destination=${formatLatLon(dest)}`;
}

/** A pin on Google Maps, for «Se kartet». */
export function googleMapLink(point: LatLon): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeStrict(formatLatLon(point))}`;
}

/** A marker on openstreetmap.org. */
export function osmMapLink(point: LatLon, zoom = 17): string {
  const p = assertLatLon(point);
  const z = Math.min(19, Math.max(1, Math.round(zoom)));
  return `https://www.openstreetmap.org/?mlat=${fixed(p.lat)}&mlon=${fixed(p.lon)}#map=${z}/${fixed(p.lat)}/${fixed(p.lon)}`;
}

export interface HrefOptions {
  /** Pin label for the Android geo: intent. */
  label?: string;
  /** Use Apple's legacy `daddr` form. */
  appleLegacy?: boolean;
  /** Which system handler to use for `system`. Without one, `system` falls back to Google Maps. */
  systemScheme?: 'geo' | 'geo-navigation' | null;
}

export function directionsHref(provider: Provider, dest: LatLon, opts: HrefOptions = {}): string {
  switch (provider) {
    case 'apple':
      return appleDirections(dest, { legacy: opts.appleLegacy });
    case 'waze':
      return wazeDirections(dest);
    case 'system':
      if (opts.systemScheme === 'geo') return systemGeoUri(dest, opts.label);
      if (opts.systemScheme === 'geo-navigation') return appleSystemNavigation(dest);
      return googleDirections(dest);
    case 'google':
    default:
      return googleDirections(dest);
  }
}
