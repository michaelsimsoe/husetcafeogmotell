---
version: 1
slug: "redesign-src-pages-concepts-b-index-astro"
primary_target: "redesign/src/pages/concepts/b/index.astro"
related_targets: ["redesign/src/pages/concepts/b/meny.astro","redesign/src/pages/concepts/b/skjerm.astro","redesign/src/pages/concepts/b/om.astro"]
---

# Konsept B — «Neste stopp: Huset»

**Scope:** design-exploration prototype, concept B of three. Homepage (desktop + mobile), `/concepts/b/meny` (representative menu view), `/concepts/b/skjerm` (one 16:9 menu-board sample, 1920×1080), `/concepts/b/om` (design rationale, credits, placeholders). Not production: no CMS, no deploy.
**Mode:** Persuade (homepage). `/meny` is Operate-leaning (scan, filter); `/skjerm` is signage read at 3–5 m.
**Audience:** E6 travellers first (quick food, hours, directions), then locals, motel guests, Helgeland visitors and groups.
**Job:** tell a driver where Huset is on their trip, whether it is open, and what they can get, as fast and as legibly as a good road sign.
**Action:** Veibeskrivelse, Ring 403 17 353, scan the menu, book a room. Live open/closed status.
**Proof:** real E6 route and elevation data (OSM/OSRM, Kartverket) from Mosjøen through Korgfjelltunnelen to Huset and Mo i Rana; real distances and drive times (marked approximate); real menu prices; rooms and meeting-room facts (bekreftes).
**Constraints:** Norwegian Bokmål; no invented facts; visible «bekreftes» and «ca.» markers; map and photo credits visible; placeholders labelled; WCAG 2.2 AA; restrained motion honouring reduced motion. Shared data in `src/data`, a separate visual system in `src/concepts/b`.
**Direction:** pinned by the brief: bold roadside wayfinding.
**Memorable moment:** pick where you are coming from, and a marker drives the real elevation profile over Korgfjellet into Korgen, counting down the kilometres to Huset.
**Unresolved:** drive times are OSRM estimates; parking and charging are not claimed; photo rights; production food photography.

## Direction contract

THESIS: Huset as the next stop on the E6. The page is a road sign and a strip map, practical before poetic. It refuses the photo hero with a tagline and the about-us opening.

OWN-WORLD: E-route green #0B6B45 panels with a 2px inset white border at 8px radius. Signal orange #F26B1D only for live status and the primary action (dark text on it). Pale sage ground #E9EEE8, slate ink #1D2523, asphalt #262C2A for the route band. Type is Schibsted Grotesk for display and text, with Sofia Sans Condensed tabular figures for km, times and prices. Authored 2px-stroke SVG pictograms, arrows as navigation, and photos pinned to the route at their real kilometre.

STORY: the visitor sees where Huset falls on their trip and that it is open, believes it is an easy and reliable stop, then gets directions, calls or scans the menu.

FIRST VIEWPORT: a green sign panel reading «Neste stopp: Huset» at about 6rem. A pictogram row (Spisested 10–21, Overnatting 8 rom, Møterom), an orange live-status block, and Veibeskrivelse and Ring as the panel's primary actions. Beneath it, a full-width asphalt band with the real E6 profile Mosjøen–Korgfjelltunnelen–Huset–Mo i Rana, km ticks and a «Kommer fra: Sør | Nord» switch. On mobile the strip turns vertical.

FORM: wayfinding signage plus a strip map, position 1 on the ordered list. Signature: choosing a direction sends a marker along the real profile to Huset, counting down km and minutes (instant under reduced motion). The menu carries an allergen filter. seed: not rolled. The brief pins this direction by name, and a brief-pinned direction beats the roll, so concept-seed was deliberately skipped and its mode rules were read from the mode file instead.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
