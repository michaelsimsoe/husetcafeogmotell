/**
 * The words around the content: header, footer, skip link, language switcher,
 * and the section anchors on the home page. Server-side only; client scripts
 * keep their own small tables (lib/hours.ts, lib/directions/text.ts,
 * lib/maps/text.ts, scripts/contact-form.ts).
 *
 * Norwegian is the reference: every other language must have the same keys.
 */
import type { Locale } from './locales.ts';

const nb = {
  skip: 'Hopp til innholdet',
  notice: 'Beskjed fra Huset',
  toHome: (name: string) => `${name}, til forsiden`,
  mainNav: 'Hovednavigasjon',
  nav: { food: 'Mat', rooms: 'Rom', gatherings: 'Selskap', findUs: 'Finn fram', contact: 'Kontakt' },
  /** Before the phone number: «Ring 403 17 353». */
  call: 'Ring',
  /** «Hemnes · ved E6» */
  byRoad: (road: string) => `ved ${road}`,
  message: 'Send oss en melding',
  directions: 'Veibeskrivelse',
  hours: 'Åpningstider',
  credits: 'Bilder og kilder',
  privacy: 'Personvern',
  /** Accessible name of the language switcher. */
  language: 'Språk',
  /** The switcher's label when it leads to this language's home page because the page isn't translated. */
  homeInThisLanguage: 'Norsk forside',
  /** After a link to a page that only exists in Norwegian. Empty on Norwegian pages. */
  inNorwegian: '',
  /** Fragment ids: the main content (skip link target) and the sections on the home page. */
  sections: {
    main: 'innhold',
    food: 'mat',
    rooms: 'rom',
    gatherings: 'selskap',
    korgen: 'korgen',
    around: 'rundt',
    findUs: 'finn-fram',
    map: 'kart',
    where: 'her',
  },
};

export type Ui = typeof nb;

const en: Ui = {
  skip: 'Skip to content',
  notice: 'A message from Huset',
  toHome: (name) => `${name}, home page`,
  mainNav: 'Main navigation',
  nav: { food: 'Food', rooms: 'Rooms', gatherings: 'Gatherings', findUs: 'Find us', contact: 'Contact' },
  call: 'Call',
  byRoad: (road) => `on the ${road}`,
  message: 'Send us a message',
  directions: 'Directions',
  hours: 'Opening hours',
  credits: 'Photos and sources',
  privacy: 'Privacy',
  language: 'Language',
  homeInThisLanguage: 'English home page',
  inNorwegian: 'in Norwegian',
  sections: {
    main: 'content',
    food: 'food',
    rooms: 'rooms',
    gatherings: 'gatherings',
    korgen: 'korgen',
    around: 'around',
    findUs: 'find-us',
    map: 'map',
    where: 'where',
  },
};

const dictionaries: Record<Locale, Ui> = { nb, en };

export const ui = (locale: Locale): Ui => dictionaries[locale];
