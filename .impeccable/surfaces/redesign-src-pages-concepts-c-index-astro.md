---
version: 1
slug: "redesign-src-pages-concepts-c-index-astro"
primary_target: "redesign/src/pages/concepts/c/index.astro"
related_targets: ["redesign/src/pages/concepts/c/meny.astro","redesign/src/pages/concepts/c/skjerm.astro","redesign/src/pages/concepts/c/om.astro"]
---

# Konsept C — «Ly mot fjellan»

**Scope:** design-exploration prototype, concept C of three. Homepage (desktop + mobile), `/concepts/c/meny` (representative menu view), `/concepts/c/skjerm` (one 16:9 menu-board sample, 1920×1080), `/concepts/c/om` (design rationale, credits, placeholders). Not production: no CMS, no deploy.
**Mode:** Persuade (homepage). `/meny` is Read inside a Persuade world; `/skjerm` is signage read at 3–5 m in a dim dining room.
**Audience:** evening travellers looking for food and a bed; locals coming for dinner; motel guests; Helgeland visitors; groups.
**Job:** make the arrival felt, from cold mountains outside to warm food and light inside, while keeping the menu, hours, phone and booking one tap away.
**Action:** Meny, Ring 403 17 353, Book rom (Booking.com), Veibeskrivelse. Live «open tonight» status.
**Proof:** Okstindan and Oksskolten (Nord-Norges høyeste fjell, 1 915 moh., about 24 km away); the real rooms with their dark blue-green walls; the real dining room and long-table parties; the real menu in the menu screens' own colours.
**Constraints:** Norwegian Bokmål; no invented facts; visible «bekreftes» markers; photo credits visible; placeholders labelled (food photos are low-res and need replacing); WCAG 2.2 AA on dark grounds; restrained motion honouring reduced motion. Shared data in `src/data`, a separate visual system in `src/concepts/c`.
**Direction:** pinned by the brief: dark, cinematic hospitality that grows out of today's menu screens.
**Memorable moment:** as you scroll, the night cools to its bluest over Okstindan, then warms step by step into copper and candlelight as the page goes indoors.
**Unresolved:** a night or evening exterior of the house is missing; food photography; photo rights; how the dark board reads in daylight.

## Direction contract

THESIS: coming in from the dark road to warm light. A cinematic sequence runs from cold mountain night to a lit dining room, carried by the existing menu screens' colours. It refuses the luxury-lodge dark template: no gold, no spa script, no generic hero overlay.

OWN-WORLD: grounds of midnight forest #0E1A1A and spruce #16302B. Copper #E0907D for headings, with copper underline rules. Bone #F1EDE4 for dish names, turquoise #7FB5AE for descriptions, and candlelight #F2C27B only for «open now» and lit details. Type is Besley for display (small-caps section heads, as on the screens) and Atkinson Hyperlegible Next for text. Letterbox bars, full-bleed photographs and copper vertical column rules; no cards, no glass.

STORY: the visitor feels the arrival (mountains, then warmth, food, a bed) and believes Huset is a real refuge on the E6. Then they open the menu, call or book.

FIRST VIEWPORT: a 2.39:1 letterboxed band of Okstindan, graded toward dusk, between black bars. Nav sits in the top bar. In the bottom bar, «Kom inn fra veien.» in Besley at about 5rem on the left; on the right, the candlelight live status with Meny, Ring and Book. On mobile the band becomes 4:5.

FORM: a cinematic sequence, position 1 on the ordered list. Signature: a scroll-driven shift in colour temperature from cold blue-black to warm brown-black across the sections, with photographs lifting from dim (static stepped grounds under reduced motion). The menu and the board evolve directly from today's screens. seed: not rolled. The brief pins this direction by name, and a brief-pinned direction beats the roll, so concept-seed was deliberately skipped and its mode rules were read from the mode file instead.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
