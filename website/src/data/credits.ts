import { withBase } from '../lib/base.ts';
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
    note: 'KI-retusjert: flaggstanga og skiltene foran huset er fjernet, og fargene er forsterket.',
  },
  {
    id: 'huset-parking-mountain', w: 736, h: 500, widths: [800],
    alt: 'Huset sett fra plenen en solskinnsdag, med biler parkert foran og det snøflekkete fjellet over Korgen bak.',
    caption: 'Huset under fjellet',
    credit: OWN, status: 'egen',
  },
  {
    id: 'huset-meeting-room', w: 1500, h: 850, widths: [1600, 800],
    alt: 'Møtelokalet med langbord, mørke stoler, høye vinduer og et nedtrukket lerret.',
    caption: 'Det store møterommet',
    credit: OWN, status: 'egen',
  },
  {
    id: 'restaurant-family-pizza', w: 4032, h: 3024, widths: [2400, 1600, 800],
    alt: 'En familie med to små barn deler en pizza ved et bord i restauranten.',
    caption: 'Pizzakveld i spisesalen',
    credit: OWN, status: 'egen',
  },
  {
    id: 'party-long-table', w: 3024, h: 3024, widths: [2400, 1600, 800],
    alt: 'Et selskap rundt et langbord med hvit duk, lys og fulle tallerkener.',
    caption: 'Selskap ved langbordet',
    credit: OWN, status: 'egen',
  },
  {
    id: 'room-wide', w: 4096, h: 1706, widths: [2400, 1600, 800],
    alt: 'Lyst motellrom med seng, lenestol, skrivebord og vindu.',
    caption: 'Rom med skrivebord',
    credit: OWN, status: 'egen',
  },
  {
    id: 'rooms-pair', w: 1890, h: 1417, widths: [1600, 800],
    alt: 'To motellrom side om side: seng under vinduet og seng ved hvitt garderobeskap.',
    caption: 'To av rommene',
    credit: OWN, status: 'egen',
  },
  // — Korgen —
  {
    id: 'korgen-village-2008b', w: 2592, h: 1944, widths: [2400, 1600, 800],
    alt: 'Røssåga ligger blank foran Korgen sentrum og kirken, med fjellet over bygda.',
    caption: 'Korgen sentrum fra Røssåga',
    credit: 'Magne Tor Ingvald Aga', license: 'CC BY-SA 4.0', licenseUrl: BY_SA_4,
    sourceUrl: C + 'Korgen_20080529_DSCN4924.jpg', status: 'lisensiert',
  },
  {
    id: 'korgen-1950s-c', w: 3476, h: 2443, widths: [2400, 1600, 800],
    alt: 'Svart-hvitt-fotografi av husene langs Røssåga i Korgen, med en hengebru over elva.',
    caption: 'Korgen og Røssåga',
    credit: 'Ukjent fotograf, Nasjonalbiblioteket', license: 'Fri (public domain)',
    sourceUrl: C + 'Korgen_-_no-nb_digifoto_20151009_00188_NB_MIT_FNR_05147.jpg', status: 'fri',
  },
  // — Okstindan —
  {
    id: 'okstinden-peaks', w: 3648, h: 2736, widths: [2400, 1600, 800],
    alt: 'Oksskolten til venstre og Okstinden til høyre, snødekte topper over Okstindbreen.',
    caption: 'Oksskolten og Okstinden',
    credit: 'Chriserikhaugli', license: 'CC BY 3.0', licenseUrl: BY_3,
    sourceUrl: C + 'Okstinden.jpg', status: 'lisensiert',
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

/** Short visible credit, e.g. «Foto: Chriserikhaugli, CC BY 3.0, Wikimedia Commons». */
export function creditShort(id: string) {
  const p = photo(id);
  const via = p.sourceUrl?.includes('wikimedia') ? ', Wikimedia Commons' : '';
  return `Foto: ${p.credit}${p.license ? `, ${p.license}` : ''}${via}`;
}
