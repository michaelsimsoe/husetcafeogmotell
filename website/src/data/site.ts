/**
 * Everything the pages say about Huset. Editable facts come from the files in
 * src/content/ (one per Pages CMS screen); fixed facts about the place live here.
 */
import contactRaw from '../content/contact.json';
import hoursRaw from '../content/hours.json';
import roomsRaw from '../content/rooms.json';
import venuesRaw from '../content/venues.json';
import noticeRaw from '../content/notice.json';
import { contactSchema, hoursSchema, noticeSchema, parseContent, roomsSchema, venuesSchema, weekdays } from './schema.ts';
import { addressLine, location } from './location.ts';
import { googleDirections, googleMapLink } from '../lib/directions/links.ts';
import { groupDays, type OpeningDay } from '../lib/hours.ts';
import { activeNotice } from '../lib/notice.ts';
import type { Locale } from '../i18n/locales.ts';

const contact = parseContent(contactSchema, contactRaw, 'src/content/contact.json');
const hours = parseContent(hoursSchema, hoursRaw, 'src/content/hours.json');
const rooms = parseContent(roomsSchema, roomsRaw, 'src/content/rooms.json');
const { meetingRooms, ...venues } = parseContent(venuesSchema, venuesRaw, 'src/content/venues.json');
const notice = parseContent(noticeSchema, noticeRaw, 'src/content/notice.json');

const dayNames: Record<Locale, Record<(typeof weekdays)[number], [string, string]>> = {
  nb: {
    monday: ['Mandag', 'Man'],
    tuesday: ['Tirsdag', 'Tir'],
    wednesday: ['Onsdag', 'Ons'],
    thursday: ['Torsdag', 'Tor'],
    friday: ['Fredag', 'Fre'],
    saturday: ['Lørdag', 'Lør'],
    sunday: ['Søndag', 'Søn'],
  },
  en: {
    monday: ['Monday', 'Mon'],
    tuesday: ['Tuesday', 'Tue'],
    wednesday: ['Wednesday', 'Wed'],
    thursday: ['Thursday', 'Thu'],
    friday: ['Friday', 'Fri'],
    saturday: ['Saturday', 'Sat'],
    sunday: ['Sunday', 'Sun'],
  },
};

/** The opening hours with day names and times written for `locale`. */
export function hoursIn(locale: Locale) {
  const days: OpeningDay[] = weekdays.map((key, day) => {
    const [label, short] = dayNames[locale][key];
    return { day, label, short, ...hours[key] };
  });
  return { days, groups: groupDays(days, locale) };
}

const phone = contact.phone.trim();
const hasCountry = phone.startsWith('+');
const digits = phone.replace(/\D/g, '');

export const site = {
  name: 'Huset Café & Motell',
  shortName: 'Huset',
  place: {
    village: 'Korgen',
    municipality: 'Hemnes kommune',
    region: 'Helgeland',
    county: 'Nordland',
    road: 'E6',
    /** Official address from Kartverket's address register. */
    address: addressLine,
    /** Map marker. Directions route to `location.arrival` instead. */
    geo: location.addressPoint,
  },
  contact: {
    phone,
    phoneIntl: hasCountry ? phone : `+47 ${phone}`,
    phoneHref: `tel:+${hasCountry ? digits : `47${digits}`}`,
    email: contact.email,
    emailHref: `mailto:${contact.email}`,
    facebook: contact.facebook,
  },
  links: {
    /** Universal fallback; the browser upgrades it to the visitor's own map app. */
    directions: googleDirections(location.arrival),
    map: googleMapLink(location.addressPoint),
  },
  /** In Norwegian; other languages use `hoursIn(locale)`. */
  hours: hoursIn('nb'),
  rooms,
  venues,
  meetingRooms,
  /** The owners' short message at the top of every page, if one is showing. */
  notice: activeNotice(notice),
  /** Fixed facts, kept in code. Articles about the area will say more. */
  nearby: {
    places: [
      {
        name: 'Korgensenteret',
        what: 'Dagligvare, apotek, Vinmonopolet og frisør',
        where: 'Rett ved siden av',
        en: { what: 'Groceries, a pharmacy, Vinmonopolet (wine and spirits) and a hairdresser', where: 'Right next door' },
      },
      { name: 'Circle K', what: 'Bensinstasjon', where: 'Over veien', en: { what: 'Petrol station', where: 'Across the road' } },
      {
        name: 'Okstindan natur- og kulturpark',
        what: 'Topper, bre og stier',
        where: 'Øst for Korgen',
        en: { what: 'Peaks, a glacier and trails', where: 'East of Korgen' },
      },
    ],
  },
  /** The area's own websites, under the nearby places. `en` gives the English version where the site has one. */
  areaLinks: [
    { name: 'Visit Okstindan', href: 'https://visitokstindan.com/', en: { href: 'https://visitokstindan.com/en/' } },
    { name: 'Visit Helgeland', href: 'https://visithelgeland.com/', en: { href: 'https://visithelgeland.com/en/' } },
    { name: 'Hemnes kommune', href: 'https://www.hemnes.kommune.no/', en: { name: 'Hemnes Municipality' } },
  ],
  /** Checked against public sources. Not owner-edited. */
  landscape: {
    oksskolten: { name: 'Oksskolten', moh: 1916, kmFromHuset: 24, bearing: { nb: 'øst-sørøst', en: 'east-south-east' } },
    korgfjelltunnelen: { name: 'Korgfjelltunnelen', lengthM: 8533, opened: 2005 },
    river: 'Røssåga',
    mountain: 'Korgfjellet',
  },
} as const;

export type Site = typeof site;

/** The places near Huset, described in `locale`. Names are names and stay as they are. */
export const nearbyIn = (locale: Locale) =>
  site.nearby.places.map(({ name, what, where, en }) => (locale === 'en' ? { name, ...en } : { name, what, where }));

/** The area links for `locale`. `norwegianOnly` is set when the site has no version in that language. */
export const areaLinksIn = (locale: Locale) =>
  site.areaLinks.map((l) => {
    if (locale === 'nb') return { name: l.name, href: l.href, norwegianOnly: false };
    const en: { name?: string; href?: string } = l.en;
    return { name: en.name ?? l.name, href: en.href ?? l.href, norwegianOnly: !en.href };
  });

/** The phone number as shown to readers of `locale`: the local form in Norwegian, with +47 for everyone else. */
export const phoneIn = (locale: Locale) => (locale === 'nb' ? site.contact.phone : site.contact.phoneIntl);
