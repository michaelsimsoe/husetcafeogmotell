/**
 * Decides where «Veibeskrivelse» goes: the visitor's saved choice when this
 * device can honour it, otherwise the platform default. A saved choice the
 * device cannot use is left in storage untouched, so it applies again on a
 * device that can.
 */

import { directionsHref, type LatLon, type Provider } from './links.ts';
import {
  availableProviders,
  DEFAULT_CAPABILITIES,
  defaultProvider,
  systemScheme,
  UNKNOWN_PLATFORM,
  usesUnifiedAppleUrls,
  type Capabilities,
  type Platform,
} from './platform.ts';

export interface Destination {
  /** Where the route should end: the vehicle arrival point. */
  point: LatLon;
  /** Name shown on the pin by Android's map handler. */
  label: string;
}

export interface Resolved {
  provider: Provider;
  href: string;
  /** `saved`: the visitor's choice. `default`: no choice yet. `fallback`: their choice is unavailable here. */
  reason: 'saved' | 'default' | 'fallback';
}

export function hrefFor(
  provider: Provider,
  dest: Destination,
  platform: Platform = UNKNOWN_PLATFORM,
  caps: Capabilities = DEFAULT_CAPABILITIES,
): string {
  return directionsHref(provider, dest.point, {
    label: dest.label,
    appleLegacy: !usesUnifiedAppleUrls(platform),
    systemScheme: systemScheme(platform, caps),
  });
}

export function resolveDirections(
  dest: Destination,
  saved: Provider | null,
  platform: Platform = UNKNOWN_PLATFORM,
  caps: Capabilities = DEFAULT_CAPABILITIES,
): Resolved {
  const usable = saved !== null && availableProviders(platform, caps).includes(saved);
  const provider = usable ? saved : defaultProvider(platform, caps);
  return {
    provider,
    href: hrefFor(provider, dest, platform, caps),
    reason: usable ? 'saved' : saved ? 'fallback' : 'default',
  };
}

/**
 * What the server renders before any script runs: an HTTPS Google Maps link
 * that works on every device and in every browser, with or without JavaScript.
 */
export function initialDirections(dest: Destination): Resolved {
  return resolveDirections(dest, null, UNKNOWN_PLATFORM, DEFAULT_CAPABILITIES);
}
