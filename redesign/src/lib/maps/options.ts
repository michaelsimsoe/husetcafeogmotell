/**
 * What the playground compares: one entry per implementation, with the labels,
 * descriptions and facts the page shows. Plain data, safe to import on the
 * server and in the browser.
 */
import { OFM_STYLES, type OfmStyleId } from './config';

export type ImplId = 'a' | 'b' | 'c' | 'd';
export type TreatmentId = 'editorial' | 'side' | 'card' | 'artistic';

export interface ImplInfo {
  id: ImplId;
  letter: string;
  name: string;
  renderer: string;
  tiles: string;
  /** Who must be credited, as shown in the map's own attribution. */
  credit: string;
  download: string;
  production: string;
  description: string;
}

export const IMPLS: Record<ImplId, ImplInfo> = {
  a: {
    id: 'a',
    letter: 'A',
    name: 'MapLibre + OpenFreeMap',
    renderer: 'MapLibre GL JS 6 · vektor, WebGL2',
    tiles: 'OpenFreeMap · vektorfliser i OpenMapTiles-skjema',
    credit: 'OpenFreeMap, © OpenMapTiles, © OpenStreetMap-bidragsytere',
    download: 'ca. 300 kB JS + 150 kB worker (gzip), lastes først når kartet vises',
    production: 'Ja',
    description:
      'Vektorkart tegnet i nettleseren: skarpt på alle skjermer, jevn zoom, og stilen kan byttes uten å laste siden på nytt. OpenFreeMap leverer fliser, stiler og fonter gratis, uten nøkkel og uten konto, også for kommersiell bruk.',
  },
  b: {
    id: 'b',
    letter: 'B',
    name: 'Leaflet + OSM-fliser',
    renderer: 'Leaflet 1.9 · rasterbilder i DOM',
    tiles: 'tile.openstreetmap.org · OSMs standardkart',
    credit: '© OpenStreetMap-bidragsytere',
    download: 'ca. 46 kB JS og CSS (gzip)',
    production: 'Nei, kun utvikling og vurdering',
    description:
      'Det tradisjonelle oppsettet: ferdigtegnede bildefliser i et lite bibliotek. Lett og enkelt, men kartbildet kan ikke stiles, og OpenStreetMaps flisservere er bare for lett bruk, uten garanti. Kun med her for å vurdere om et enkelt rasterkart holder.',
  },
  c: {
    id: 'c',
    letter: 'C',
    name: 'Huset-stil',
    renderer: 'MapLibre GL JS 6 · vektor, WebGL2',
    tiles: 'OpenFreeMap · vektorfliser, egen stil i prosjektet',
    credit: 'OpenFreeMap, © OpenMapTiles, © OpenStreetMap-bidragsytere',
    download: 'som A, pluss 3 kB stil (gzip)',
    production: 'Ja, anbefalt',
    description:
      'Samme motor og fliser som A, men med en egen stil bygd på fargene i konsept A: dempet granskog, lys og varm grunn, blågrått vann og en tydelig, rolig E6 med vegskilt. Nesten alle ikoner er fjernet. Kartets etiketter bruker Noto Sans fra OpenFreeMap; markøren, popupen og alt rundt kartet bruker nettstedets egne skrifter.',
  },
  d: {
    id: 'd',
    letter: 'D',
    name: 'OSM-innbygging',
    renderer: 'openstreetmap.org i en iframe',
    tiles: 'tile.openstreetmap.org · OSMs standardkart',
    credit: '© OpenStreetMap-bidragsytere (vises inne i iframen)',
    download: 'ingen JS hos oss; iframen laster OSMs kartside',
    production: 'Bare som nødløsning',
    description:
      'Null kode: openstreetmap.org sin egen kartside i en iframe. Ingen egen markør, ingen popup og ingen stil, og vi får ikke vite om den feiler. Den kan ikke styres med to fingre, så kartet må aktiveres med et trykk.',
  },
};

export const IMPL_ORDER: ImplId[] = ['a', 'b', 'c', 'd'];

export const STYLE_ORDER: OfmStyleId[] = ['positron', 'liberty', 'fiord', 'bright'];
export { OFM_STYLES };

export const TREATMENTS: Record<TreatmentId, { name: string; note: string }> = {
  editorial: {
    name: 'Redaksjonell',
    note: 'Kartet i full bredde som et eget bilde i siden, med adresse og veibeskrivelse under.',
  },
  side: {
    name: 'Ved siden av',
    note: 'Adresse og veibeskrivelse på granmørk flate, kartet ved siden av. Stables på mobil.',
  },
  card: {
    name: 'Avgrenset',
    note: 'Et nøkternt utsnitt med hårstrek rundt og adressen i samme ramme.',
  },
  artistic: {
    name: 'Kunstnerisk',
    note: 'Kartet som en trykt plansje: passepartout, koordinater, målestokk og nordpil. Best med Huset-stilen.',
  },
};

export const TREATMENT_ORDER: TreatmentId[] = ['editorial', 'side', 'card', 'artistic'];

export interface Criterion {
  name: string;
  cells: Record<ImplId, string>;
}

export const COMPARISON: Criterion[] = [
  {
    name: 'Utseende',
    cells: {
      a: 'Skarpt vektorkart. Positron er rolig, Liberty og Bright er fulle av ikoner, Fiord er mørk og uferdig.',
      b: 'Klassisk OSM-kart: travelt og fargesterkt, uskarpt mellom zoomtrinnene.',
      c: 'Roligst og mest i slekt med nettstedet. E6 er lett å finne, lite støy.',
      d: 'Som B, med OSMs blå standardnål i stedet for Huset-markøren.',
    },
  },
  {
    name: 'Tilpasning',
    cells: {
      a: 'Stilene kan byttes og brukes som utgangspunkt for egne.',
      b: 'Ingen: kartbildet er ferdigtegnet. Bare markør og kontroller kan endres.',
      c: 'Full kontroll over farger, lag, etiketter og vegskilt i én JSON-fil i prosjektet.',
      d: 'Ingen. Bare utsnitt og plassering av nåla.',
    },
  },
  {
    name: 'Implementering',
    cells: {
      a: 'Middels: bibliotek, worker-fil og en stil-URL. Den felles kartrammen gjør resten.',
      b: 'Enkel: ett lite bibliotek og én flis-URL.',
      c: 'Som A, pluss vedlikehold av stilfila ved større endringer i flisskjemaet.',
      d: 'Triviell: én iframe.',
    },
  },
  {
    name: 'Ytelse og størrelse',
    cells: {
      a: 'Tyngst: ca. 450 kB gzip med worker. Lastes bare når kartet vises. Krever WebGL2.',
      b: 'Lett: ca. 46 kB gzip. Bildefliser på 256 px.',
      c: 'Som A. Stilen er 3 kB gzip og tegner færre lag enn de ferdige stilene.',
      d: 'Ingen JS hos oss, men iframen laster hele OSMs kartside.',
    },
  },
  {
    name: 'Mobil',
    cells: {
      a: 'Én finger ruller siden, to fingre flytter og zoomer kartet. Mykt og skarpt.',
      b: 'Én finger ruller siden, klyp for å zoome og flytte (tilpasset her). Hakkete mellom trinn.',
      c: 'Som A.',
      d: 'Må aktiveres med et trykk først, ellers fanger den rullingen.',
    },
  },
  {
    name: 'Tilgjengelighet',
    cells: {
      a: 'Kartet kan styres med tastatur. Markør og popup er ekte knapper og lenker. Adressen står alltid som tekst.',
      b: 'Som A: Leaflet støtter piltaster og +/−.',
      c: 'Som A.',
      d: 'Svakest: iframe-innhold vi verken kan merke eller teste.',
    },
  },
  {
    name: 'Kommersiell bruk',
    cells: {
      a: 'Ja. OpenFreeMap tillater kommersiell bruk uten nøkkel; kreditering kreves. MapLibre er BSD-3.',
      b: 'Dataene ja (ODbL, kreditering). Flisserverne er ikke ment som fast produksjonstjeneste.',
      c: 'Ja, som A. Stilen er avledet av Positron (CC BY 4.0); krediteringen beholdes.',
      d: 'Tillatt innenfor OSMs vilkår, med samme forbehold som B.',
    },
  },
  {
    name: 'Ekstern avhengighet',
    cells: {
      a: 'tiles.openfreemap.org for fliser, stiler, fonter og ikoner. Ingen SLA.',
      b: 'tile.openstreetmap.org. Ingen garanti; tilgang kan stenges uten varsel.',
      c: 'Fliser og fonter fra OpenFreeMap; stil og vegskilt fra eget nettsted.',
      d: 'openstreetmap.org i sin helhet.',
    },
  },
  {
    name: 'Løpende kostnad',
    cells: {
      a: '0 kr. Frivillig donasjon til OpenFreeMap.',
      b: '0 kr, men ikke en løsning å bygge videre på.',
      c: '0 kr, pluss litt tid til stilen.',
      d: '0 kr.',
    },
  },
];
