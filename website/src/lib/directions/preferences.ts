/**
 * Remembers the visitor's own choice of map app, and nothing else. An
 * inferred platform default is never written. Storage that is missing,
 * blocked (private mode, disabled cookies) or holds junk reads as «no choice».
 */

import { PROVIDERS, type Provider } from './links.ts';

export const PREFERENCE_KEY = 'huset-maps-preference';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function isProvider(value: unknown): value is Provider {
  return typeof value === 'string' && (PROVIDERS as readonly string[]).includes(value);
}

/** Reading `window.localStorage` itself can throw (SecurityError) when storage is blocked. */
export function getStorage(target?: { localStorage?: StorageLike } | null): StorageLike | null {
  try {
    return target?.localStorage ?? null;
  } catch {
    return null;
  }
}

export function readPreference(storage: StorageLike | null): Provider | null {
  if (!storage) return null;
  try {
    const value = storage.getItem(PREFERENCE_KEY);
    return isProvider(value) ? value : null;
  } catch {
    return null;
  }
}

/** Returns false when the choice could not be stored; the current tap still works. */
export function savePreference(storage: StorageLike | null, provider: Provider): boolean {
  if (!storage || !isProvider(provider)) return false;
  try {
    storage.setItem(PREFERENCE_KEY, provider);
    return true;
  } catch {
    return false;
  }
}

export function clearPreference(storage: StorageLike | null): boolean {
  if (!storage) return false;
  try {
    storage.removeItem(PREFERENCE_KEY);
    return true;
  } catch {
    return false;
  }
}
