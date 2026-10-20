/** Every photo concept B puts on a page — the /om credits table is built from this list. */
export const usedPhotos = [
  'huset-parking-mountain',
  'korgfjellet-roadside',
  'restaurant-family-pizza',
  'rooms-pair',
  'room-wide',
  'party-long-table',
  'huset-meeting-room',
  'okstinden-peaks',
  'rossaga-a',
  'huset-facade-white',
  'board-pizza',
] as const;

/** Where each photo appears in concept B. */
export const photoUse: Record<(typeof usedPhotos)[number], string> = {
  'huset-parking-mountain': 'Forsiden, strekningskartet (km 47,7)',
  'korgfjellet-roadside': 'Forsiden, strekningskartet (Korgfjellet)',
  'restaurant-family-pizza': 'Forsiden, Spis',
  'rooms-pair': 'Forsiden, Sov',
  'room-wide': 'Forsiden, Sov',
  'party-long-table': 'Forsiden, Samles',
  'huset-meeting-room': 'Forsiden, Samles',
  'okstinden-peaks': 'Forsiden, Rundt deg',
  'rossaga-a': 'Forsiden, Rundt deg',
  'huset-facade-white': 'Forsiden, Finn fram',
  'board-pizza': 'Menyskjermen (plassholder)',
};

/** Concept B ships no derived rasters of its own; the logo mask is shared. */
export const conceptAssets: { name: string; path: string; provenance: string; status: string }[] = [
  {
    name: 'Huset-logoen som hvit maske',
    path: '/img/shared/huset-logo-mask.png',
    provenance: 'Rasterlogo fra dagens nettside, gjort om til hvit maske for mørk og grønn bakgrunn. Eies av Huset Café & Motell.',
    status: 'Vektorfil mangler',
  },
  {
    name: 'Piktogrammer (spisested, overnatting, møterom, telefon, piler, tunnel, nål m.fl.)',
    path: 'src/concepts/b/Icon.astro',
    provenance: 'Tegnet for konsept B som SVG på ett 24-rutenett med 2 px strek. Ingen ekstern kilde.',
    status: 'Egne',
  },
];
