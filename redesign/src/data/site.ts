/**
 * Shared facts for all three concepts. Anything taken from the current site
 * that the owners have not re-confirmed carries `verified: false` and must be
 * rendered with a visible «bekreftes» marker in the prototypes.
 */

import { googleDirections, googleMapLink } from '../lib/directions/links.ts';
import { addressLine, location } from './location.ts';

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = mandag

export interface OpeningDay {
  day: Weekday;
  label: string;
  short: string;
  open: string; // "HH:MM"
  close: string; // "HH:MM"
}

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
    phone: '403 17 353',
    phoneIntl: '+47 403 17 353',
    phoneHref: 'tel:+4740317353',
    email: 'kontakt@husetmotell.no',
    emailHref: 'mailto:kontakt@husetmotell.no',
    facebook: 'https://www.facebook.com/Husetcafe',
  },
  links: {
    /** Universal fallback. Concept A upgrades it to the visitor's own map app in the browser. */
    directions: googleDirections(location.arrival),
    map: googleMapLink(location.addressPoint),
    booking: 'https://www.booking.com/hotel/no/huset-cafe-amp-motell-as.en-gb.html',
    current: 'https://www.husetmotell.no/',
  },
  hours: {
    verified: false,
    note: 'Åpningstider fra dagens nettside – bekreftes før lansering.',
    days: [
      { day: 0, label: 'Mandag', short: 'Man', open: '10:00', close: '21:00' },
      { day: 1, label: 'Tirsdag', short: 'Tir', open: '10:00', close: '21:00' },
      { day: 2, label: 'Onsdag', short: 'Ons', open: '10:00', close: '21:00' },
      { day: 3, label: 'Torsdag', short: 'Tor', open: '10:00', close: '21:00' },
      { day: 4, label: 'Fredag', short: 'Fre', open: '10:00', close: '21:00' },
      { day: 5, label: 'Lørdag', short: 'Lør', open: '11:00', close: '21:00' },
      { day: 6, label: 'Søndag', short: 'Søn', open: '13:00', close: '19:00' },
    ] satisfies OpeningDay[],
    /** Compact grouping for print-style listings. */
    groups: [
      { label: 'Mandag–fredag', short: 'Man–fre', open: '10', close: '21' },
      { label: 'Lørdag', short: 'Lør', open: '11', close: '21' },
      { label: 'Søndag', short: 'Søn', open: '13', close: '19' },
    ],
  },
  about: {
    verified: false,
    selfDescription:
      'Veikro tett inntil E6 gjennom Korgen. Her stopper reisende og turister for mat og overnatting, og bygdefolk møtes over middagsbordet.',
    family: 'Familiedrevet',
  },
  rooms: {
    verified: false,
    count: 8,
    priceFrom: 1130,
    priceNote: 'Fra 1 130 kr per natt med frokost (engelsk side oppgir 1 139 kr) – bekreftes.',
    breakfast: 'Tradisjonell norsk frokost, selvbetjent i eget frokostrom.',
    checkIn: '14:00',
    checkInNote: 'Sen ankomst kan avtales.',
    checkOut: '12:00',
    payment: 'Betaling ved ankomst, om ikke annet er avtalt.',
    features: [
      'Dobbeltrom med to senger som kan stå hver for seg eller skyves sammen',
      'To enkeltrom – alle dobbeltrom kan også leies som enkeltrom',
      'TV på rommet',
      'Rene bad',
      'Frokost inkludert',
    ],
    fullyBooked: 'Er det fullt, hjelper vi deg å finne et annet sted i nærheten.',
  },
  venues: {
    verified: false,
    capacity: 80,
    meetingRooms: [
      { name: 'Stort møterom', equipment: 'Prosjektor og lyd/bilde', price: 400 },
      { name: 'Lite møterom', equipment: 'Uten utstyr', price: 200 },
    ],
    occasions: ['bryllup', 'julebord', 'konfirmasjon', 'dåp', 'minnestund', 'klassefest'],
    catering: ['koldtbord', 'varmmat', 'snitter'],
    cakes: 'Kaker på bestilling',
    extras: ['Uteservering', 'Søndagsmiddag'],
  },
  surroundings: {
    verified: false,
    nearby: [
      { name: 'Korgensenteret', what: 'Dagligvare, apotek, Vinmonopolet og frisør', where: 'Rett ved siden av' },
      { name: 'Circle K', what: 'Bensinstasjon', where: 'Over veien' },
      { name: 'Okstindan natur- og kulturpark', what: 'Topper, bre og stier', where: 'Øst for Korgen' },
    ],
  },
  /** Facts checked against public sources while building the prototypes. */
  landscape: {
    oksskolten: {
      name: 'Oksskolten',
      moh: 1916,
      kmFromHuset: 24,
      bearing: 'øst-sørøst',
      note: 'Nord-Norges høyeste fjell (1 915,75 moh.), i Okstindmassivet ca. 24 km i luftlinje fra Huset.',
    },
    korgfjelltunnelen: { name: 'Korgfjelltunnelen', lengthM: 8533, opened: 2005 },
    river: 'Røssåga',
    mountain: 'Korgfjellet',
  },
} as const;

/** Assets the production site still needs. Rendered on every /om page. */
export const missingAssets = [
  'Egne, nye matbilder av rettene slik de serveres på Huset (dagens menybilder er lavoppløste og trolig bildebank).',
  'Fasadebilde av det hvite bygget i høy oppløsning – gjerne en kveld med lys i vinduene.',
  'Interiør av restauranten med folk, dagslys og kveldslys.',
  'Frokostrommet og et dekket frokostbord.',
  'Logo som vektorfil (SVG) – dagens logo finnes bare som raster.',
  'Bekreftede åpningstider, rompris og allergener.',
  'Bekreftelse på at veibeskrivelsen skal ende på parkeringen ut mot E6.',
];

export type Site = typeof site;
