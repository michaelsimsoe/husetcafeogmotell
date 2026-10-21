import { appleDirections, googleDirections, isLatLon, osmMapLink } from '@lib/directions/links';
import type { Place, PlaceLinks } from './types';

/** Directions end at `destination`; the OpenStreetMap link shows the marker point. */
export function placeLinks(place: Place): PlaceLinks {
  return {
    google: googleDirections(place.destination),
    apple: appleDirections(place.destination, { legacy: true }),
    osm: osmMapLink(place.marker, 18),
  };
}

/** Parses the JSON a server-rendered map hands its client script. Throws on anything malformed. */
export function parsePlace(json: string | undefined): Place {
  const raw = JSON.parse(json ?? 'null') as Partial<Place> | null;
  if (!raw || typeof raw.name !== 'string' || typeof raw.addressLine !== 'string' || !isLatLon(raw.marker)) {
    throw new TypeError('Map place data is missing a name, address or marker point.');
  }
  return {
    name: raw.name,
    addressLine: raw.addressLine,
    marker: raw.marker,
    destination: isLatLon(raw.destination) ? raw.destination : raw.marker,
    label: typeof raw.label === 'string' && raw.label ? raw.label : raw.name,
  };
}
