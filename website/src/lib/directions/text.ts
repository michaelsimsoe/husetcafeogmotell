/**
 * Everything the directions widget says, per language. Shared by the server
 * markup (Directions.astro) and the client upgrade (enhance.ts).
 */
import type { Locale } from '../../i18n/locales.ts';
import { PROVIDER_IN_SENTENCE, PROVIDER_NAMES, type Provider } from './links.ts';

export interface DirectionsText {
  go: string;
  /** Followed by the app, e.g. «Åpnes i Google Maps». */
  opensIn: string;
  pick: string;
  note: string;
  /** Marks the visitor's saved app in the list. */
  yours: string;
  forget: string;
  noMemory: string;
  unavailable: (saved: string, used: string) => string;
  remembered: string;
  willRemember: string;
  names: Record<Provider, string>;
  /** How the provider reads after `opensIn`. */
  inSentence: Record<Provider, string>;
}

export const directionsText: Record<Locale, DirectionsText> = {
  nb: {
    go: 'Veibeskrivelse',
    opensIn: 'Åpnes i',
    pick: 'Velg kartapp',
    note: 'Åpne veibeskrivelsen i en annen app.',
    yours: 'ditt valg',
    forget: 'Glem valget',
    noMemory: 'Åpne veibeskrivelsen i en annen app. Nettleseren lar ikke siden huske valget.',
    unavailable: (saved, used) => `${saved} kan ikke åpnes i denne nettleseren, så lenken går til ${used}.`,
    remembered: 'Valget ditt huskes på denne enheten.',
    willRemember: 'Appen du velger, huskes på denne enheten.',
    names: PROVIDER_NAMES,
    inSentence: PROVIDER_IN_SENTENCE,
  },
  en: {
    go: 'Directions',
    opensIn: 'Opens in',
    pick: 'Choose map app',
    note: 'Open the directions in another app.',
    yours: 'your choice',
    forget: 'Forget my choice',
    noMemory: 'Open the directions in another app. This browser won’t let the page remember your choice.',
    unavailable: (saved, used) => `${saved} can’t be opened in this browser, so the link goes to ${used}.`,
    remembered: 'Your choice is remembered on this device.',
    willRemember: 'The app you choose is remembered on this device.',
    names: { ...PROVIDER_NAMES, system: 'Default map app' },
    inSentence: { ...PROVIDER_IN_SENTENCE, system: 'your map app' },
  },
};
