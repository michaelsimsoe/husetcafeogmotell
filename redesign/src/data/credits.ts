import { withBase } from '@lib/base';
/**
 * Image registry with provenance. Every photograph used by the prototypes is
 * listed here; concepts must render `credit` near the image (or in a visible
 * credits list on the same page) and show `status` when it is not cleared.
 */

export type RightsStatus = 'lisensiert' | 'fri' | 'avklares';

export interface Photo {
  id: string;
  /** Natural size of the source file. */
  w: number;
  h: number;
  /** Widths available under /img/shared/<id>-<width>.jpg */
  widths: number[];
  alt: string;
  caption: string;
  credit: string;
  license?: string;
  licenseUrl?: string;
  sourceUrl?: string;
  status: RightsStatus;
  /** Low-res or otherwise not fit for production. */
  warning?: string;
}

const BY_SA_4 = 'https://creativecommons.org/licenses/by-sa/4.0/deed.no';
const BY_SA_3 = 'https://creativecommons.org/licenses/by-sa/3.0/deed.no';
const BY_3 = 'https://creativecommons.org/licenses/by/3.0/deed.no';
const C = 'https://commons.wikimedia.org/wiki/File:';

const LOCAL = 'Lokalt bildearkiv – fotograf og rettigheter avklares';
const LEGACY = 'Fra husetmotell.no – trolig egne bilder, rettigheter avklares';
const BOARD = 'Fra menyskjermene – kilde og rettigheter avklares';

const list: Photo[] = [
  // — Huset itself —
  {
    id: 'huset-facade-white', w: 2000, h: 1334, widths: [1600, 800],
    alt: 'Huset Café & Motell: et langt, hvitt bygg ved veien, med plen og flaggstang foran og skog bak.',
    caption: 'Huset ved E6 i Korgen',
    credit: LOCAL, status: 'avklares',
  },
  {
    id: 'huset-entrance', w: 945, h: 1000, widths: [800],
    alt: 'Inngangen til Huset med skiltet «Huset Café & Motell», to hvite dører og blomsterkasser.',
    caption: 'Inngangen',
    credit: LOCAL, status: 'avklares',
  },
  {
    id: 'huset-parking-mountain', w: 736, h: 500, widths: [800],
    alt: 'Huset sett fra plenen en solskinnsdag, med biler parkert foran og det snøflekkete fjellet over Korgen bak.',
    caption: 'Huset under fjellet',
    credit: LOCAL, status: 'avklares', warning: 'Lav oppløsning (736 px)',
  },
  {
    id: 'huset-reception-sign', w: 1100, h: 1100, widths: [800],
    alt: 'Innenfor inngangen: et gammelt skysstasjonsskilt i tre på panelvegg, et lite bord med blomster og døra inn til spisesalen.',
    caption: 'Det gamle skiltet i gangen',
    credit: LOCAL, status: 'avklares',
  },
  {
    id: 'huset-meeting-room', w: 1500, h: 850, widths: [1600, 800],
    alt: 'Møtelokalet med langbord, mørke stoler, høye vinduer og et nedtrukket lerret.',
    caption: 'Det store møterommet',
    credit: LOCAL, status: 'avklares',
  },
  {
    id: 'restaurant-family-pizza', w: 4032, h: 3024, widths: [2400, 1600, 800],
    alt: 'En familie med to små barn deler en pizza ved et bord i restauranten.',
    caption: 'Pizzakveld i spisesalen',
    credit: LEGACY, status: 'avklares',
  },
  {
    id: 'party-long-table', w: 3024, h: 3024, widths: [2400, 1600, 800],
    alt: 'Et selskap rundt et langbord med hvit duk, lys og fulle tallerkener.',
    caption: 'Selskap ved langbordet',
    credit: LEGACY, status: 'avklares',
  },
  {
    id: 'table-set-napkin', w: 3024, h: 4032, widths: [2400, 1600, 800],
    alt: 'Dekket bord med hvit duk, rød brettet serviett, kniv og vinglass.',
    caption: 'Dekket til selskap',
    credit: LEGACY, status: 'avklares',
  },
  {
    id: 'room-double-a', w: 675, h: 900, widths: [800],
    alt: 'Motellrom med seng, mørk blågrønn vegg, hvite gardiner og vindu mot grøntområdet.',
    caption: 'Rom med to senger',
    credit: LEGACY, status: 'avklares', warning: 'Lav oppløsning (675 px)',
  },
  {
    id: 'room-double-b', w: 675, h: 900, widths: [800],
    alt: 'Motellrom med seng, lenestol, bilde på veggen og vindu med hvite gardiner.',
    caption: 'Rom med lenestol',
    credit: LEGACY, status: 'avklares', warning: 'Lav oppløsning (675 px)',
  },
  {
    id: 'room-wide', w: 4096, h: 1706, widths: [2400, 1600, 800],
    alt: 'Lyst motellrom med seng, lenestol, skrivebord og vindu.',
    caption: 'Rom med skrivebord',
    credit: LEGACY, status: 'avklares',
  },
  {
    id: 'rooms-pair', w: 1890, h: 1417, widths: [1600, 800],
    alt: 'To motellrom side om side: seng under vinduet og seng ved hvitt garderobeskap.',
    caption: 'To av rommene',
    credit: LEGACY, status: 'avklares',
  },
  // — Food from the current screens (placeholder quality) —
  {
    id: 'board-pizza', w: 518, h: 410, widths: [800],
    alt: 'Pizza med paprika og løk på et rundt brett, med grønnsaker rundt.',
    caption: 'Pizza', credit: BOARD, status: 'avklares', warning: 'Lav oppløsning, trolig bildebank',
  },
  {
    id: 'board-burger-fries', w: 518, h: 280, widths: [800],
    alt: 'Burger med løkringer og pommes frites på hvit tallerken.',
    caption: 'Burger', credit: BOARD, status: 'avklares', warning: 'Lav oppløsning, trolig bildebank',
  },
  {
    id: 'board-burger-plate', w: 518, h: 346, widths: [800],
    alt: 'Burger og pommes frites på et avlangt fat, med et glass øl bak.',
    caption: 'Burgertallerken', credit: BOARD, status: 'avklares', warning: 'Lav oppløsning, trolig bildebank',
  },
  {
    id: 'board-steak-board', w: 518, h: 389, widths: [800],
    alt: 'Oppskåret biff med grønnsaker på et trefat.',
    caption: 'Biff', credit: BOARD, status: 'avklares', warning: 'Lav oppløsning, trolig bildebank',
  },
  {
    id: 'board-stroganoff', w: 518, h: 337, widths: [800],
    alt: 'Kjøttrett i saus med grønnsaker på et trefat.',
    caption: 'Varmrett', credit: BOARD, status: 'avklares', warning: 'Lav oppløsning, trolig bildebank',
  },
  {
    id: 'board-wine-beer', w: 518, h: 384, widths: [800],
    alt: 'Et glass rødvin og et glass øl på et trebord.',
    caption: 'Drikke', credit: BOARD, status: 'avklares', warning: 'Lav oppløsning, trolig bildebank',
  },
  // — Korgen —
  {
    id: 'korgen-village-2008a', w: 2592, h: 1944, widths: [2400, 1600, 800],
    alt: 'Korgen sett over Røssåga i mai: hvite hus, kirken og det runde, snøflekkete fjellet bak bjørkeskogen.',
    caption: 'Korgen og Røssåga, mai 2008',
    credit: 'Magne Tor Ingvald Aga', license: 'CC BY-SA 4.0', licenseUrl: BY_SA_4,
    sourceUrl: C + 'Korgen_20080529_DSCN4923.jpg', status: 'lisensiert',
  },
  {
    id: 'korgen-village-2008b', w: 2592, h: 1944, widths: [2400, 1600, 800],
    alt: 'Røssåga ligger blank foran Korgen sentrum og kirken, med fjellet over bygda.',
    caption: 'Korgen sentrum fra Røssåga, mai 2008',
    credit: 'Magne Tor Ingvald Aga', license: 'CC BY-SA 4.0', licenseUrl: BY_SA_4,
    sourceUrl: C + 'Korgen_20080529_DSCN4924.jpg', status: 'lisensiert',
  },
  {
    id: 'korgen-bru-a', w: 2592, h: 1944, widths: [2400, 1600, 800],
    alt: 'Korgen bru, en hengebru i grått stål, med vei i forgrunnen og skog rundt.',
    caption: 'Korgen bru, 2009',
    credit: 'Sandivas', license: 'CC BY-SA 3.0', licenseUrl: BY_SA_3,
    sourceUrl: C + 'Korgen_bru_20090628_A.JPG', status: 'lisensiert',
  },
  {
    id: 'korgen-bru-b', w: 1944, h: 2592, widths: [1600, 800],
    alt: 'Kjørebanen over Korgen bru mellom høye stålpyloner mot blå himmel.',
    caption: 'Over Korgen bru, 2009',
    credit: 'Sandivas', license: 'CC BY-SA 3.0', licenseUrl: BY_SA_3,
    sourceUrl: C + 'Korgen_bru_20090628_B.JPG', status: 'lisensiert',
  },
  {
    id: 'korgen-1950s-a', w: 3612, h: 2350, widths: [2400, 1600, 800],
    alt: 'Svart-hvitt-fotografi av Korgen og dalen, med gårder, jorder og elva i bunnen av dalen.',
    caption: 'Korgen før 1955',
    credit: 'Ukjent fotograf, Nasjonalbiblioteket', license: 'Fri (public domain)',
    sourceUrl: C + 'Korgen_-_no-nb_digifoto_20150203_00005_NB_MIT_FNR_15581_A.jpg', status: 'fri',
  },
  {
    id: 'korgen-1950s-b', w: 3587, h: 2368, widths: [2400, 1600, 800],
    alt: 'Svart-hvitt-fotografi av Røssåga og Korgen, sett over jorder og en låve.',
    caption: 'Korgen, Røssåga, 1947–49',
    credit: 'Ukjent fotograf, Nasjonalbiblioteket', license: 'Fri (public domain)',
    sourceUrl: C + 'Korgen_-_no-nb_digifoto_20151009_00185_NB_MIT_FNR_05144_A.jpg', status: 'fri',
  },
  {
    id: 'korgen-1950s-c', w: 3476, h: 2443, widths: [2400, 1600, 800],
    alt: 'Svart-hvitt-fotografi av husene langs Røssåga i Korgen, med en hengebru over elva.',
    caption: 'Korgen, Røssåga, 1947–49',
    credit: 'Ukjent fotograf, Nasjonalbiblioteket', license: 'Fri (public domain)',
    sourceUrl: C + 'Korgen_-_no-nb_digifoto_20151009_00188_NB_MIT_FNR_05147.jpg', status: 'fri',
  },
  // — Korgfjellet & Røssåga —
  {
    id: 'korgfjellet-clouds', w: 2592, h: 1944, widths: [2400, 1600, 800],
    alt: 'Utsikt fra Korgfjellet over grønt fjellandskap mot snødekte topper, med en lang, flat sky over.',
    caption: 'Korgfjellet, juli 2007',
    credit: 'Magne Tor Ingvald Aga', license: 'CC BY-SA 4.0', licenseUrl: BY_SA_4,
    sourceUrl: C + 'Korgfjellet_20070708_DSCN3519.jpg', status: 'lisensiert',
  },
  {
    id: 'korgfjellet-roadside', w: 2592, h: 1944, widths: [2400, 1600, 800],
    alt: 'Grusskulder ved veien over Korgfjellet, med utsikt over dalen, et vann og blå fjell i kveldssol.',
    caption: 'Ved veien over Korgfjellet, juni 2009',
    credit: 'Ranværing', license: 'CC BY-SA 4.0', licenseUrl: BY_SA_4,
    sourceUrl: C + 'Korgfjellet_20090624_DSCN5428.jpg', status: 'lisensiert',
  },
  {
    id: 'rossaga-a', w: 2592, h: 1944, widths: [2400, 1600, 800],
    alt: 'Røssåga i kveldssol, med glitrende vann mellom skogkledde bredder.',
    caption: 'Røssåga, juni 2009',
    credit: 'Ranværing', license: 'CC BY-SA 4.0', licenseUrl: BY_SA_4,
    sourceUrl: C + 'R%C3%B8ss%C3%A5ga_20090624_DSCN5418.jpg', status: 'lisensiert',
  },
  {
    id: 'rossaga-b', w: 2592, h: 1944, widths: [2400, 1600, 800],
    alt: 'Røssåga renner bred og rolig mellom grønn løvskog.',
    caption: 'Røssåga, juni 2009',
    credit: 'Ranværing', license: 'CC BY-SA 4.0', licenseUrl: BY_SA_4,
    sourceUrl: C + 'R%C3%B8ss%C3%A5ga_20090624_DSCN5421.jpg', status: 'lisensiert',
  },
  // — Okstindan —
  {
    id: 'okstindan-valley-pd', w: 2048, h: 1536, widths: [1600, 800],
    alt: 'Utsikt innover en grønn dal mot snøflekkete topper i Okstindan, under lavt skydekke.',
    caption: 'Mot Okstindan, juli 2007',
    credit: 'keg', license: 'Fri (public domain)',
    sourceUrl: C + 'Okstindan.JPG', status: 'fri',
  },
  {
    id: 'okstindan-from-sweden', w: 3648, h: 2736, widths: [2400, 1600, 800],
    alt: 'Okstindan sett fra lufta en sommerdag: snøkledde topper og breer over grønne vidder og en slyngende elv.',
    caption: 'Okstindan sett fra svensk side, juli 2014',
    credit: 'Øyvind Rask', license: 'CC BY-SA 4.0', licenseUrl: BY_SA_4,
    sourceUrl: C + 'Okstindan_sett_fra_Sverige.jpg', status: 'lisensiert',
  },
  {
    id: 'okstinden-peaks', w: 3648, h: 2736, widths: [2400, 1600, 800],
    alt: 'Oksskolten til venstre og Okstinden til høyre, snødekte topper over Okstindbreen.',
    caption: 'Oksskolten og Okstinden, mai 2009',
    credit: 'Chriserikhaugli', license: 'CC BY 3.0', licenseUrl: BY_3,
    sourceUrl: C + 'Okstinden.jpg', status: 'lisensiert',
  },
  {
    id: 'tvillingtinden', w: 3648, h: 2736, widths: [2400, 1600, 800],
    alt: 'Tvillingtinden, en snødekt topp som reiser seg over en vid snøflate.',
    caption: 'Tvillingtinden, mai 2009',
    credit: 'Chriserikhaugli', license: 'CC BY 3.0', licenseUrl: BY_3,
    sourceUrl: C + 'Tvillingtinden.jpg', status: 'lisensiert',
  },
];

export const photos: Record<string, Photo> = Object.fromEntries(list.map((p) => [p.id, p]));

export const photo = (id: string): Photo => {
  const p = photos[id];
  if (!p) throw new Error(`Unknown photo: ${id}`);
  return p;
};

/** Path to a specific width (falls back to the largest available ≤ requested). */
export const src = (id: string, width = 1600) => {
  const p = photo(id);
  const pick = [...p.widths].sort((a, b) => a - b).filter((w) => w <= width).pop() ?? Math.min(...p.widths);
  return withBase(`/img/shared/${id}-${pick}.jpg`);
};

/** srcset using the real pixel width of each variant. */
export const srcset = (id: string) => {
  const p = photo(id);
  return [...p.widths]
    .sort((a, b) => a - b)
    .map((w) => `${withBase(`/img/shared/${id}-${w}.jpg`)} ${Math.min(w, p.w)}w`)
    .join(', ');
};

/** One-line credit, e.g. «Foto: Ranværing, CC BY-SA 4.0, via Wikimedia Commons». */
export const creditLine = (id: string) => {
  const p = photo(id);
  if (p.status === 'avklares') return p.credit;
  const via = p.sourceUrl?.includes('wikimedia') ? ', via Wikimedia Commons' : '';
  return `Foto: ${p.credit}${p.license ? `, ${p.license}` : ''}${via}`;
};

export const statusLabel: Record<RightsStatus, string> = {
  lisensiert: 'Lisensiert',
  fri: 'Fri bruk',
  avklares: 'Rettigheter avklares',
};

export const routeCredit = 'Kartdata © OpenStreetMap-bidragsytere (ODbL). Høydedata © Kartverket (CC BY 4.0).';
