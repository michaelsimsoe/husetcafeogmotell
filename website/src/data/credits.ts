import { withBase } from '../lib/base.ts';
import type { Locale } from '../i18n/locales.ts';
/**
 * Every photograph on the site, with provenance. Huset's own photos (`egen`)
 * carry no credit on the page; everyone else's are credited at the image and
 * all of them are listed on /anerkjennelse.
 */

export type RightsStatus = 'egen' | 'lisensiert' | 'fri' | 'avklares';

export interface Photo {
  id: string;
  /** Natural size of the source file. */
  w: number;
  h: number;
  /** Widths available under /img/<id>-<width>.jpg */
  widths: number[];
  alt: string;
  caption: string;
  credit: string;
  license?: string;
  licenseUrl?: string;
  sourceUrl?: string;
  /** Anything a reader of the credits page should know, e.g. that the photo is retouched. */
  note?: string;
  status: RightsStatus;
  /** The same words in English. `credit` and `license` only where they are words rather than names. */
  en: { alt: string; caption: string; credit?: string; license?: string };
}

const BY_SA_4 = 'https://creativecommons.org/licenses/by-sa/4.0/deed.no';
const BY_3 = 'https://creativecommons.org/licenses/by/3.0/deed.no';
const C = 'https://commons.wikimedia.org/wiki/File:';
const OWN = 'Huset Café & Motell';

const list: Photo[] = [
  // — Huset —
  {
    id: 'huset-facade-sun', w: 1536, h: 1024, widths: [1536, 800],
    alt: 'Huset Café & Motell i sol: et langt, hvitt bygg med mørkt tak bak en grønn plen ved veien, med skog og fjell bak.',
    caption: 'Huset ved E6 i Korgen',
    credit: OWN, status: 'egen',
    en: {
      alt: 'Huset Café & Motell in the sun: a long, white building with a dark roof behind a green lawn by the road, with forest and mountains behind.',
      caption: 'Huset by the E6 in Korgen',
    },
    note: 'KI-retusjert: flaggstanga og skiltene foran huset er fjernet, og fargene er forsterket.',
  },
  {
    id: 'huset-parking-mountain', w: 736, h: 500, widths: [800],
    alt: 'Huset sett fra plenen en solskinnsdag, med biler parkert foran og det snøflekkete fjellet over Korgen bak.',
    caption: 'Huset under fjellet',
    credit: OWN, status: 'egen',
    en: {
      alt: 'Huset seen from the lawn on a sunny day, with cars parked in front and the snow-patched mountain above Korgen behind.',
      caption: 'Huset below the mountain',
    },
  },
  {
    id: 'huset-meeting-room', w: 1500, h: 850, widths: [1600, 800],
    alt: 'Møtelokalet med langbord, mørke stoler, høye vinduer og et nedtrukket lerret.',
    caption: 'Det store møterommet',
    credit: OWN, status: 'egen',
    en: {
      alt: 'The meeting room with a long table, dark chairs, tall windows and a lowered projector screen.',
      caption: 'The large meeting room',
    },
  },
  {
    id: 'restaurant-family-pizza', w: 4032, h: 3024, widths: [2400, 1600, 800],
    alt: 'En familie med to små barn deler en pizza ved et bord i restauranten.',
    caption: 'Pizzakveld i spisesalen',
    credit: OWN, status: 'egen',
    en: {
      alt: 'A family with two small children sharing a pizza at a table in the restaurant.',
      caption: 'Pizza night in the dining room',
    },
  },
  {
    id: 'party-long-table', w: 3024, h: 3024, widths: [2400, 1600, 800],
    alt: 'Et selskap rundt et langbord med hvit duk, lys og fulle tallerkener.',
    caption: 'Selskap ved langbordet',
    credit: OWN, status: 'egen',
    en: {
      alt: 'A party around a long table with a white tablecloth, candles and full plates.',
      caption: 'A party at the long table',
    },
  },
  {
    id: 'room-wide', w: 4096, h: 1706, widths: [2400, 1600, 800],
    alt: 'Lyst motellrom med seng, lenestol, skrivebord og vindu.',
    caption: 'Rom med skrivebord',
    credit: OWN, status: 'egen',
    en: {
      alt: 'A bright motel room with a bed, an armchair, a desk and a window.',
      caption: 'A room with a desk',
    },
  },
  {
    id: 'rooms-pair', w: 1890, h: 1417, widths: [1600, 800],
    alt: 'To motellrom side om side: seng under vinduet og seng ved hvitt garderobeskap.',
    caption: 'To av rommene',
    credit: OWN, status: 'egen',
    en: {
      alt: 'Two motel rooms side by side: a bed under the window, and a bed by a white wardrobe.',
      caption: 'Two of the rooms',
    },
  },
  {
    id: 'sushi-buffet', w: 3024, h: 4032, widths: [1600, 1200, 800],
    alt: 'Et langt fat med sushi – ruller, laks og jordbær – og fat med reker og frityr bak, på et bord med hvit duk.',
    caption: 'Sushibord på Huset',
    credit: OWN, status: 'egen',
    en: {
      alt: 'A long tray of sushi – rolls, salmon and strawberries – with plates of prawns and fried food behind, on a table with a white cloth.',
      caption: 'A sushi table at Huset',
    },
  },
  {
    id: 'table-laid', w: 3024, h: 4032, widths: [1600, 1200, 800],
    alt: 'Et dekket bord med hvit duk: en rød serviett brettet som en vifte, biffkniv, vinglass og røde lys.',
    caption: 'Dekket til middag',
    credit: OWN, status: 'egen',
    en: {
      alt: 'A table laid with a white cloth: a red napkin folded into a fan, a steak knife, a wine glass and red candles.',
      caption: 'Laid for dinner',
    },
  },
  {
    id: 'sushi-platter', w: 3024, h: 4032, widths: [1600, 1200, 800],
    alt: 'Et fat med sushi: ruller, laks, reker og biter pyntet med jordbær, appelsin og avokado.',
    caption: 'Sushifat fra kjøkkenet',
    credit: OWN, status: 'egen',
    en: {
      alt: 'A platter of sushi: rolls, salmon, prawns and pieces topped with strawberry, orange and avocado.',
      caption: 'A sushi platter from the kitchen',
    },
  },
  // — Korgen —
  {
    id: 'korgen-village-2008b', w: 2592, h: 1944, widths: [2400, 1600, 800],
    alt: 'Røssåga ligger blank foran Korgen sentrum og kirken, med fjellet over bygda.',
    caption: 'Korgen sentrum fra Røssåga',
    credit: 'Magne Tor Ingvald Aga', license: 'CC BY-SA 4.0', licenseUrl: BY_SA_4,
    sourceUrl: C + 'Korgen_20080529_DSCN4924.jpg', status: 'lisensiert',
    en: {
      alt: 'The Røssåga river lies still in front of Korgen’s centre and church, with the mountain above the village.',
      caption: 'Korgen’s centre from the Røssåga river',
    },
  },
  {
    id: 'korgen-1950s-c', w: 3476, h: 2443, widths: [2400, 1600, 800],
    alt: 'Svart-hvitt-fotografi av husene langs Røssåga i Korgen, med en hengebru over elva.',
    caption: 'Korgen og Røssåga',
    credit: 'Ukjent fotograf, Nasjonalbiblioteket', license: 'Fri (public domain)',
    sourceUrl: C + 'Korgen_-_no-nb_digifoto_20151009_00188_NB_MIT_FNR_05147.jpg', status: 'fri',
    en: {
      alt: 'Black-and-white photograph of the houses along the Røssåga river in Korgen, with a suspension bridge over the river.',
      caption: 'Korgen and the Røssåga river',
      credit: 'Unknown photographer, National Library of Norway',
      license: 'Public domain',
    },
  },
  // — Okstindan —
  {
    id: 'okstinden-peaks', w: 3648, h: 2736, widths: [2400, 1600, 800],
    alt: 'Oksskolten til venstre og Okstinden til høyre, snødekte topper over Okstindbreen.',
    caption: 'Oksskolten og Okstinden',
    credit: 'Chriserikhaugli', license: 'CC BY 3.0', licenseUrl: BY_3,
    sourceUrl: C + 'Okstinden.jpg', status: 'lisensiert',
    en: {
      alt: 'Oksskolten on the left and Okstinden on the right, snow-covered peaks above the Okstindbreen glacier.',
      caption: 'Oksskolten and Okstinden',
    },
  },
];

export const photos: Photo[] = list;
const byId = new Map(list.map((p) => [p.id, p]));

export const photo = (id: string): Photo => {
  const p = byId.get(id);
  if (!p) throw new Error(`Unknown photo: ${id}`);
  return p;
};

const path = (id: string, w: number) => withBase(`/img/${id}-${w}.jpg`);

/** Path to a specific width (falls back to the largest available ≤ requested). */
export const src = (id: string, width = 1600) => {
  const p = photo(id);
  const pick = [...p.widths].sort((a, b) => a - b).filter((w) => w <= width).pop() ?? Math.min(...p.widths);
  return path(id, pick);
};

/** srcset using the real pixel width of each variant. */
export const srcset = (id: string) => {
  const p = photo(id);
  return [...p.widths]
    .sort((a, b) => a - b)
    .map((w) => `${path(id, w)} ${Math.min(w, p.w)}w`)
    .join(', ');
};

/** Whether the photo must carry a visible credit where it is shown. */
export const needsCredit = (id: string) => photo(id).status !== 'egen';

/** The photo's alt text in `locale`. */
export const altOf = (id: string, locale: Locale = 'nb') => (locale === 'en' ? photo(id).en.alt : photo(id).alt);

/** The photo's caption in `locale`. */
export const captionOf = (id: string, locale: Locale = 'nb') => (locale === 'en' ? photo(id).en.caption : photo(id).caption);

/** Short visible credit, e.g. «Foto: Chriserikhaugli, CC BY 3.0, Wikimedia Commons» / «Photo: …». */
export function creditShort(id: string, locale: Locale = 'nb') {
  const p = photo(id);
  const en = locale === 'en';
  const credit = (en && p.en.credit) || p.credit;
  const license = (en && p.en.license) || p.license;
  const via = p.sourceUrl?.includes('wikimedia') ? ', Wikimedia Commons' : '';
  return `${en ? 'Photo' : 'Foto'}: ${credit}${license ? `, ${license}` : ''}${via}`;
}
