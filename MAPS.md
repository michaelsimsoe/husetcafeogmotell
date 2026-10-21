# Maps

How the Huset site shows where the house is, using only free map sources: no API keys, no billing accounts, no tracking.

- **Playground:** `/dev/maps` (noindex). Compares four implementations side by side, with switchable styles, layout treatments, gesture modes and a simulated failure.
- **Component demo:** `/dev/maps-komponent` (noindex). The extracted production component on its own.

The concept app (`redesign/`) does not use the component on any live or concept page. The production site (`website/`) carries a MapLibre-only port with two tones (light, and a dark `huset-style-spruce.json` generated from the light style) and a one-time glide in, shown as a map band on `/dev/kart-lys` and `/dev/kart-mork`. See «Map band» in `website/README.md`.

## The four options

| | A · MapLibre + OpenFreeMap | B · Leaflet + OSM tiles | C · MapLibre + Huset style | D · OSM embed |
|---|---|---|---|---|
| Renderer | MapLibre GL JS 6 (WebGL2) | Leaflet 1.9 (DOM/raster) | MapLibre GL JS 6 (WebGL2) | `<iframe>` from openstreetmap.org |
| Tiles / style | OpenFreeMap vector tiles; Positron, Liberty, Fiord or Bright, hosted by OpenFreeMap | `tile.openstreetmap.org` raster | OpenFreeMap vector tiles; self-hosted `public/maps/huset-style.json` | OSM Carto, rendered by OSM |
| Branding | Our HTML marker and popup; the base map is generic | Our HTML marker and popup; the base map is busy OSM Carto | Full: palette, calm labels, few POIs, warm E6 | None: stock OSM marker, no popup |
| Mobile gestures | Cooperative (two fingers) or tap to activate | Same, implemented by us | Same as A | Overlay we control; once activated, the iframe takes the gestures |
| JS cost (gzip) | ~430 kB (JS + worker) + 10 kB CSS | ~42 kB + 6 kB CSS | Same as A, plus a 26 kB style JSON (~3 kB gzip) | 0 |
| Failure detection | Yes: style or tile errors, missing WebGL2, timeout | Yes: tile errors, timeout | Yes, same as A | No. A blocked iframe can't be detected; the simulation uses a 2.5 s timeout |
| Production | Acceptable (Positron) | **No.** Development and evaluation only | **Recommended** | Emergency fallback only |

All four use the same marker point, centre and framing. MapLibre uses 512 px tiles, so its zoom is the raster zoom − 1. `src/lib/maps/view.ts` converts between them, so Leaflet z16 and MapLibre z15 show the same area.

## Licensing and attribution

Every option keeps its attribution visible in the bottom-right corner. All OSM credits link to <https://www.openstreetmap.org/copyright>.

- **OpenStreetMap data** (all options): ODbL. Credit «© OpenStreetMap-bidragsytere».
- **OpenFreeMap** (A, C): free, including commercial use. No keys and no request limits, but no SLA; it is donation-funded. Required credit: «OpenFreeMap © OpenMapTiles Data from © OpenStreetMap». Its code and styles repo is MIT.
- **OpenMapTiles** (the schema behind the vector tiles): code BSD-3, design CC BY 4.0.
- **Positron** (A; the base of C): code BSD-3, design CC BY 4.0. Derived from the CARTO basemaps (Stamen and Paul Norman, CC BY 3.0).
- **Liberty and Bright** (A): code BSD-3, design CC BY 4.0, derived from the Mapbox Open Styles.
- **Fiord** (A): OpenFreeMap marks it as unfinished.
- **Huset style** (C): derived from Positron, and keeps Positron's credits. Its `metadata["huset:licence"]` records the derivation.
  - Its sprite is our own (a single E-road shield).
  - Glyphs are OpenFreeMap's Noto fonts (OFL 1.1).
  - No hillshade, terrain or satellite imagery. Natural Earth (public domain) is in the upstream styles but not in ours.
- **OSM standard tiles** (B): governed by the [Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/), which allows only light use and gives no guarantee. B is clearly labelled development-only and must not ship. It sends no custom headers.
- **OSM embed** (D): OSM's own attribution is shown inside the iframe.
- **Libraries:** MapLibre GL JS is BSD-3; Leaflet is BSD-2.
- **Place data** (`src/data/location.ts`):
  - The address point is Kartverket's official point (CC BY 4.0).
  - The arrival point (front car park) is derived from OSM and **not yet confirmed by the owners**.

## Recommendation: C

Use **MapLibre + OpenFreeMap vector tiles + the self-hosted Huset style**, through `HusetMap.astro`.

- It is the only option that looks like the rest of the site (concept A palette), and it shows the one thing the map is for: Huset sits right on the E6.
- It costs nothing and needs no key or account.
- Cooperative gestures mean one finger scrolls the page.
- It loads only when the map nears the viewport.
- Address and directions are always plain text, so the map never blocks anyone from finding the way.
- Every source is in one file. If OpenFreeMap disappears, the same tiles can be self-hosted (OpenFreeMap is open source) or taken from any OpenMapTiles-compatible host without touching the style layers.

Alternatives:

- **A with Positron** is acceptable if a custom style is unwanted.
- **D** is a last-resort, zero-JS option. It is unbranded and its failures can't be detected.
- **B** is only for comparison.

## Using the component

```astro
---
import HusetMap from '../../components/maps/HusetMap.astro'; // relative; there is no components alias
import { location, addressLine } from '@data/location';
---
<HusetMap
  name={location.name}
  addressLine={addressLine}
  marker={location.addressPoint}
  destination={location.arrival}
  label="Huset"
/>
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `name` | `string` | required | Popup title, fallback heading, the map's accessible name |
| `addressLine` | `string` | required | One line, e.g. «Meieriveien 7, 8646 Korgen» |
| `marker` | `{ lat, lon }` | required | Marker position and map centre |
| `destination` | `{ lat, lon }` | `marker` | Target of the Google and Apple directions links |
| `label` | `string` | `name` | Text on the marker plate |
| `styleUrl` | `string` | `HUSET_STYLE_URL` | Any MapLibre style JSON |
| `zoom` | `number` | `15` | MapLibre zoom (= 16 in raster terms) |
| `height` | CSS length | `clamp(22rem, 60vh, 34rem)` | Set as `--hm-h` |
| `gestures` | `'cooperative' \| 'tap'` | `'cooperative'` | Two fingers or Ctrl + scroll, or tap once to unlock |
| `title` | `string` | «Kart som viser {name}» | Accessible name of the map region |
| `class` | `string` | — | Extra class on the frame |

Behaviour:

- **Fallback first.** The server renders the fallback: address plus links to Google Maps, Apple Maps (legacy `daddr` form) and OpenStreetMap. The section is therefore useful before JS runs and without JS.
- **Lazy loading.** An `IntersectionObserver` (300 px margin) loads MapLibre and its CSS with dynamic `import()`. The CSS is injected as an inline `<style>` at runtime so the build doesn't hoist it into every page.
- **Failure handling.** The fallback comes back if WebGL2 is missing, the style or tiles fail, or nothing renders within 15 s (`LOAD_TIMEOUT_MS`).
- **Cleanup.** It works with Astro view transitions (`astro:page-load`) and disposes the map on `astro:before-swap`.
- **Controls.** Zoom in, zoom out and «Tilbakestill visning» (reset), all 44 px.
- **Popup.** The marker is a focusable button that opens the popup. Escape closes the popup when focus is inside it.

Where to change things:

- **Sources:** all tile, style, glyph and embed URLs are in `src/lib/maps/config.ts`. Change them there and both the playground and the component follow. Internal URLs go through `withBase()` so they work on the GitHub Pages sub-path.
- **Style:** `public/maps/huset-style.json`, with `huset-sprite*.json/png` beside it. Its source and glyph URLs point at OpenFreeMap; edit those to self-host.
- **Map UI CSS:** marker, popup, controls, hints and fallback live in `src/lib/maps/map-ui.css`. It uses `--hm-*` variables that fall back to concept A's values.

## The production port (`website/`)

`website/src/components/maps/` and `website/src/lib/maps/` are a copy of the component with only the MapLibre adapter (no Leaflet, no embed, no playground). Differences from `redesign/`:

| Prop | Type | Default | Notes |
|---|---|---|---|
| `tone` | `'light' \| 'spruce'` | `'light'` | Picks the style (`HUSET_STYLES` in `config.ts`) and the matching UI colours (`.hm-frame--spruce` in `map-ui.css`) |
| `intro` | `'none' \| 'glide'` | `'none'` | `glide` opens 2.75 zoom levels out and eases in to `zoom` over 2.6 s, once, when half the frame is on screen. A drag, zoom or reset cancels it; reduced motion skips it |

- **Dark style:** `public/maps/huset-style-spruce.json` is generated, not hand-edited. Edit the light style, then run `npm run maps:spruce`. `scripts/map-style-spruce.mjs` maps every light colour to a spruce one and throws on any colour it does not know, and `tests/maps.test.ts` fails if the committed file drifts from the generator or the layers differ.
- **Edge alignment:** the controls and the fallback read `--hm-edge` and `--hm-fallback-pad` from an ancestor, so a full-bleed band can line them up with the page grid (`.map-band` in `global.css`).
- **Escape:** closes the popup from anywhere on the page while focus is in the map or on the page body. MapLibre drops focus on mouse-down, so after a mouse click focus is on `<body>`, and a listener on the frame never heard the key. Focus returns to the marker only if it was inside the map.
- **Cost:** the MapLibre chunk is about 300 kB gzip (1.1 MB raw), loaded only near the band.

## Files

- `redesign/src/pages/dev/maps.astro` and `redesign/src/pages/dev/maps-komponent.astro`: the playground and the component demo.
- `redesign/src/components/maps/`:
  - `HusetMap.astro`
  - `MapFallback.astro`
  - `huset-map.ts` (client init)
- `redesign/src/lib/maps/`:
  - `config.ts` (sources)
  - `adapters/` (`maplibre.ts`, `leaflet.ts`, `embed.ts`), which share the interface in `types.ts`
  - `frame.ts` (marker, popup, controls, gesture guard, fallback)
  - `view.ts` (zoom conversion, embed bbox)
  - `options.ts` (playground copy and comparison data)
  - `playground.ts`
  - `loaders.ts`, `dom.ts`, `place.ts`
  - `map-ui.css`
- `redesign/public/maps/`: `huset-style.json` and the sprite files.

## Known limitations

- **Real-device testing still needed.** Gestures, scroll-past and WebGL performance were checked only in headless Chromium with emulated touch, not on real iOS or Android devices.
- **MapLibre needs WebGL2** and about 440 kB gzip; on old or very low-end devices it falls back to the static fallback.
- **OpenFreeMap has no SLA.** The fallback covers outages, but plan for self-hosting if the map becomes essential.
- **The arrival point is unconfirmed** (see `location.ts`). Directions links use it.
- **Map labels use Noto, not the site fonts.** Brand fonts would need generated glyph PBFs. Brand type is used in the HTML marker, popup and fallback instead.
- **Upstream console warnings.** The upstream OpenFreeMap styles log warnings about shield filters and missing images in A. The Huset style validates clean.
- **The embed (D)** shows a stock marker and gives no load or error signal.
- **Strict CSP.** The runtime-injected `<style>` tags would need `style-src 'unsafe-inline'` or a nonce if a strict CSP is ever added.
