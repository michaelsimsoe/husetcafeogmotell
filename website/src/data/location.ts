/**
 * Where Huset is: one source for the street address, the map marker and the
 * point navigation apps route to. Motel and restaurant share the building and
 * the entrance, so they share one destination.
 *
 * Kept free of imports so unit tests can load it directly.
 */

export interface LatLon {
  lat: number;
  lon: number;
}

export const location = {
  name: 'Huset Café & Motell',
  address: {
    street: 'Meieriveien 7',
    postcode: '8646',
    /** Posten's postal place for 8646. Olderneset is the built-up area the address lies in. */
    postalPlace: 'Korgen',
    area: 'Olderneset',
    municipality: 'Hemnes',
    county: 'Nordland',
  },
  /**
   * Kartverket's official address point for Meieriveien 7 (gnr. 145/1),
   * on the north edge of the building. Used for map markers.
   */
  addressPoint: { lat: 66.080937, lon: 13.825965 } satisfies LatLon,
  /**
   * Where a driver should end up: the front car park between the building and
   * E6, on the service road off the E6 (OpenStreetMap way 490490957, centroid).
   * Derived from map data. Huset confirms it with `site.directions.confirmed` in src/data/site.ts.
   */
  arrival: { lat: 66.081075, lon: 13.825683 } satisfies LatLon,
  sources: {
    address: 'Kartverket, adresseregisteret (Matrikkelen), CC BY 4.0',
    arrival: 'OpenStreetMap-bidragsytere, ODbL',
  },
} as const;

export const addressLine = `${location.address.street}, ${location.address.postcode} ${location.address.postalPlace}`;
