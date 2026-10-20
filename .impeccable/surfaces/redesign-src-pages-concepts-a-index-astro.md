---
version: 1
slug: "redesign-src-pages-concepts-a-index-astro"
primary_target: "redesign/src/pages/concepts/a/index.astro"
related_targets: ["redesign/src/pages/concepts/a/meny.astro","redesign/src/pages/concepts/a/skjerm.astro","redesign/src/pages/concepts/a/om.astro"]
---

# Konsept A — «Huset i Korgen»

**Scope:** design-exploration prototype, concept A of three. Homepage (desktop + mobile), `/concepts/a/meny` (representative menu view), `/concepts/a/skjerm` (one 16:9 menu-board sample, 1920×1080), `/concepts/a/om` (design rationale, credits, placeholders). Not production: no CMS, no deploy.
**Mode:** Persuade (homepage). `/meny` is Read inside a Persuade world; `/skjerm` is signage read at 3–5 m.
**Audience:** locals checking menu, prices and hours; E6 travellers deciding to stop; motel guests; Helgeland visitors; groups and businesses.
**Job:** show that Huset is a real, warm, family-run house in remarkable surroundings, and answer the practical questions (open now? what's on the menu? a room tonight? how do I get there?) at once.
**Action:** see the menu; call 403 17 353 or book a room via Booking.com; get directions. Live opening status in the masthead.
**Proof:** the real white building; the real Korgen skyline; the real menu with prices; 8 rooms with breakfast (bekreftes); Korgen photographed 1947–49 and in 2008.
**Constraints:** Norwegian Bokmål; no invented facts; visible «bekreftes» markers on unconfirmed facts; photo credits visible; placeholders labelled; WCAG 2.2 AA; restrained motion honouring reduced motion. Shared data in `src/data`, a separate visual system in `src/concepts/a`.
**Direction:** pinned by the brief: warm Scandinavian editorial.
**Memorable moment:** the skyline rule, a hairline traced from the real mountain above Korgen. It draws itself under the headline and returns as every section divider.
**Unresolved:** final hours, prices and address; photo rights; production food photography; whether a light menu board suits the dining-room light.

## Direction contract

THESIS: Huset as Korgen's almanac, an editorial page where the white house sits under Korgen's own skyline. It refuses the photo-hero-plus-three-cards restaurant template and every card grid.

OWN-WORLD: grounds of cool whitewash #F5F6F2 and fog #E4E8E3. Spruce #1E3A32 owns whole regions (the menu spread, «Finn fram»). Ink #18201D. River green #2E6B5E for the skyline line and links. Copper #9A4A2C only on prices and active rules. Type is Brygada 1918 for display (italic for emphasis) and Ysabeau Office for text. Hairline rules, dot leaders, rotated photo credits along image edges; no radius, no shadows.

STORY: the visitor sees a real house in a real place and believes it is warm and honest. Then they read the menu, book a room or find the way.

FIRST VIEWPORT: a masthead dateline carrying the live open status. Below it, the H1 «Mat og husrom midt i Korgen» across 9 columns at about 5.5rem, with the skyline rule full width beneath. Under the rule, a 3-column «I dag» action column (hours, Ring, Meny, Veibeskrivelse) beside a 9-column crop of the white facade.

FORM: an asymmetric 12-column editorial spread, position 1 on the ordered list. Signature: the skyline rule draws on load and redraws at each section divider, fully drawn under reduced motion. A then-and-now pairing sets Korgen 1947–49 against Korgen 2008. seed: not rolled. The brief pins this direction by name, and a brief-pinned direction beats the roll, so concept-seed was deliberately skipped and its mode rules were read from the mode file instead.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
