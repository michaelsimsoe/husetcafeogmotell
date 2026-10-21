/**
 * Everything the pages say about Huset. Editable facts come from
 * src/content/site.json (Pages CMS); fixed facts about the place live here.
 * Anything with `confirmed: false` is shown with a «bekreftes» mark.
 */
import raw from '../content/site.json';
import { parseContent, siteSchema, weekdays } from './schema.ts';
import { addressLine, location } from './location.ts';
import { googleDirections, googleMapLink } from '../lib/directions/links.ts';
import { groupDays, type OpeningDay } from '../lib/hours.ts';

const data = parseContent(siteSchema, raw, 'src/content/site.json');

const dayNames: Record<(typeof weekdays)[number], [string, string]> = {
  monday: ['Mandag', 'Man'],
  tuesday: ['Tirsdag', 'Tir'],
  wednesday: ['Onsdag', 'Ons'],
  thursday: ['Torsdag', 'Tor'],
  friday: ['Fredag', 'Fre'],
  saturday: ['Lørdag', 'Lør'],
  sunday: ['Søndag', 'Søn'],
};

const days: OpeningDay[] = weekdays.map((key, day) => {
  const [label, short] = dayNames[key];
  return { day, label, short, ...data.hours[key] };
});

const phone = data.contact.phone.trim();
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
    email: data.contact.email,
    emailHref: `mailto:${data.contact.email}`,
    facebook: data.contact.facebook,
  },
  links: {
    /** Universal fallback; the browser upgrades it to the visitor's own map app. */
    directions: googleDirections(location.arrival),
    map: googleMapLink(location.addressPoint),
    booking: data.contact.booking,
  },
  hours: {
    confirmed: data.hours.confirmed,
    days,
    groups: groupDays(days),
  },
  rooms: data.rooms,
  venues: data.venues,
  meetingRooms: data.meetingRooms,
  nearby: data.nearby,
  directions: data.directions,
  /** Checked against public sources. Not owner-edited. */
  landscape: {
    oksskolten: { name: 'Oksskolten', moh: 1916, kmFromHuset: 24, bearing: 'øst-sørøst' },
    korgfjelltunnelen: { name: 'Korgfjelltunnelen', lengthM: 8533, opened: 2005 },
    river: 'Røssåga',
    mountain: 'Korgfjellet',
  },
} as const;

export type Site = typeof site;
