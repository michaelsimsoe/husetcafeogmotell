/**
 * Everything the pages say about Huset. Editable facts come from the files in
 * src/content/ (one per Pages CMS screen); fixed facts about the place live here.
 * Anything with `confirmed: false` is shown with a «bekreftes» mark.
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

const contact = parseContent(contactSchema, contactRaw, 'src/content/contact.json');
const hours = parseContent(hoursSchema, hoursRaw, 'src/content/hours.json');
const rooms = parseContent(roomsSchema, roomsRaw, 'src/content/rooms.json');
const { meetingRooms, ...venues } = parseContent(venuesSchema, venuesRaw, 'src/content/venues.json');
const notice = parseContent(noticeSchema, noticeRaw, 'src/content/notice.json');

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
  return { day, label, short, ...hours[key] };
});

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
  hours: {
    confirmed: hours.confirmed,
    days,
    groups: groupDays(days),
  },
  rooms,
  venues,
  meetingRooms,
  /** The owners' short message at the top of every page, if one is showing. */
  notice: activeNotice(notice),
  /** Fixed facts, kept in code. Articles about the area will say more. */
  nearby: {
    confirmed: false,
    places: [
      { name: 'Korgensenteret', what: 'Dagligvare, apotek, Vinmonopolet og frisør', where: 'Rett ved siden av' },
      { name: 'Circle K', what: 'Bensinstasjon', where: 'Over veien' },
      { name: 'Okstindan natur- og kulturpark', what: 'Topper, bre og stier', where: 'Øst for Korgen' },
    ],
  },
  /** Set to true once Huset has checked that the map links end at the driveway (`location.arrival`). */
  directions: { confirmed: false },
  /** Checked against public sources. Not owner-edited. */
  landscape: {
    oksskolten: { name: 'Oksskolten', moh: 1916, kmFromHuset: 24, bearing: 'øst-sørøst' },
    korgfjelltunnelen: { name: 'Korgfjelltunnelen', lengthM: 8533, opened: 2005 },
    river: 'Røssåga',
    mountain: 'Korgfjellet',
  },
} as const;

export type Site = typeof site;
