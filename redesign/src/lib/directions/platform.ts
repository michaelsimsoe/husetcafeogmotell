/**
 * Platform classification for choosing a sensible default map app.
 *
 * Everything here is a heuristic read from the user agent. A website cannot
 * see which map apps are installed or which one the visitor set as default,
 * so this only decides where the first tap goes. The visitor can always pick
 * another app.
 */

import type { Provider } from './links.ts';

export type OS = 'ios' | 'android' | 'macos' | 'windows' | 'linux' | 'other';

export interface Platform {
  os: OS;
  /** [major, minor] for iOS/iPadOS when the user agent reveals it. */
  version: readonly [number, number] | null;
  /** Embedded browser inside another app (Facebook, Instagram, Android WebView …). */
  inApp: boolean;
}

export interface PlatformHints {
  userAgent?: string;
  /** navigator.maxTouchPoints: separates iPadOS (which reports a Mac user agent) from a Mac. */
  maxTouchPoints?: number;
}

export interface Capabilities {
  /**
   * Apple's `geo-navigation:` default-navigation-app scheme. Apple documents
   * it for the EU (iOS 18.4+) and Japan (iOS 26.2+), not for Norway. Keep it
   * off until it has been confirmed on a real Norwegian device.
   */
  appleSystemHandler: boolean;
}

export const DEFAULT_CAPABILITIES: Capabilities = { appleSystemHandler: false };

/** Before any user agent is known (server render, no JS): treat as a desktop browser. */
export const UNKNOWN_PLATFORM: Platform = { os: 'other', version: null, inApp: false };

const IN_APP = /FBAN|FBAV|FB_IAB|FBIOS|Instagram|LinkedInApp|Snapchat|musical_ly|BytedanceWebview|Line\/|; wv\)/;

function pair(match: RegExpMatchArray | null): [number, number] | null {
  return match ? [Number(match[1]), Number(match[2] ?? 0)] : null;
}

function newer(a: [number, number] | null, b: [number, number] | null): [number, number] | null {
  if (!a) return b;
  if (!b) return a;
  return atLeast(a, b) ? a : b;
}

export function atLeast(v: readonly [number, number] | null, min: readonly [number, number]): boolean {
  if (!v) return false;
  return v[0] > min[0] || (v[0] === min[0] && v[1] >= min[1]);
}

export function detectPlatform({ userAgent = '', maxTouchPoints = 0 }: PlatformHints = {}): Platform {
  const ua = userAgent;
  const inApp = IN_APP.test(ua);

  if (/Android/i.test(ua)) return { os: 'android', version: null, inApp };

  // Safari 26 freezes the OS token at 18_6, so also read Safari's own Version/ token and keep the newer.
  const safari = pair(ua.match(/Version\/(\d+)(?:\.(\d+))?/));
  if (/iPhone|iPad|iPod/.test(ua)) {
    return { os: 'ios', version: newer(pair(ua.match(/OS (\d+)_(\d+)/)), safari), inApp };
  }
  if (/Macintosh|Mac OS X/.test(ua)) {
    // iPadOS asks for desktop sites with a Mac user agent; touch support gives it away.
    if (maxTouchPoints > 1) return { os: 'ios', version: safari, inApp };
    return { os: 'macos', version: null, inApp };
  }
  if (/Windows/.test(ua)) return { os: 'windows', version: null, inApp };
  if (/Linux|X11|CrOS/.test(ua)) return { os: 'linux', version: null, inApp };
  return { os: 'other', version: null, inApp };
}

/**
 * Apple's unified Maps URLs need iOS/iPadOS 18.4+ or macOS 15.4+. Macs hide
 * their OS version from the user agent, and an unknown platform (including the
 * server render) may well be an Apple device, so those keep the legacy form
 * every Apple system reads. Windows, Linux and Android open Apple Maps on the
 * web, which reads the current format.
 */
export function usesUnifiedAppleUrls(p: Platform): boolean {
  if (p.os === 'ios') return atLeast(p.version, [18, 4]);
  return p.os === 'windows' || p.os === 'linux' || p.os === 'android';
}

/** The OS-level map handler this platform can take, if any. */
export function systemScheme(p: Platform, caps: Capabilities = DEFAULT_CAPABILITIES): 'geo' | 'geo-navigation' | null {
  // In-app browsers on Android often swallow non-HTTPS links, so they get Google's HTTPS link instead.
  if (p.os === 'android') return p.inApp ? null : 'geo';
  if (p.os === 'ios' && caps.appleSystemHandler && atLeast(p.version, [18, 4])) return 'geo-navigation';
  return null;
}

/** Choices offered under «Velg kartapp», in display order. */
export function availableProviders(p: Platform, caps: Capabilities = DEFAULT_CAPABILITIES): Provider[] {
  const list: Provider[] = ['google', 'apple', 'waze'];
  return systemScheme(p, caps) ? ['system', ...list] : list;
}

/** Where the first tap goes when the visitor has not chosen. */
export function defaultProvider(p: Platform, caps: Capabilities = DEFAULT_CAPABILITIES): Provider {
  if (systemScheme(p, caps)) return 'system';
  if (p.os === 'ios' || p.os === 'macos') return 'apple';
  return 'google';
}
