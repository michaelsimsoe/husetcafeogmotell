# husetmotell.no – the new website

The replacement for the Create React App site in the repository root, built from design concept A («Huset i Korgen»). It is a static Astro site with Tailwind CSS v4 and TypeScript. Content lives in JSON that the family edits in Pages CMS, and Netlify hosts it.

The old site stays live until this one is approved. The design system is described in [`../DESIGN.md`](../DESIGN.md), the product in [`../PRODUCT.md`](../PRODUCT.md). The concept prototypes in [`../redesign/`](../redesign/) are an archive and are not used by this app.

## Commands

Run from `website/`. Requires Node 22.12 or newer (Netlify uses 24).

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on http://localhost:4322 |
| `npm run build` | Static build to `dist/`. Fails if the content JSON is invalid. |
| `npm run preview` | Serves `dist/` on port 4322 |
| `npm test` | Unit tests (`node --test`): content schema, opening hours, directions |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run check` | `astro check` (types in `.astro` files) |

## Routes

| Path | Page |
| --- | --- |
| `/` | Homepage: today's hours and status, «Her ligger Korgen», food (`#mat`), rooms (`#rom`), gatherings and meeting rooms (`#selskap`), «Korgen, før og nå» (`#korgen`), surroundings (`#rundt`), address and directions (`#finn-fram`) |
| `/meny` | The full menu with allergens |
| `/kontakt` | Contact details and the contact form |
| `/kontakt/takk` | Thank-you page for the form without JavaScript (noindex) |
| `/anerkjennelse` | Photo credits, map data and sources |
| `/privacy` | Privacy policy (still the old site's English text, see the launch checklist) |
| `/sitemap.xml`, `/robots.txt` | Generated at build time |

The old site's `/overnatting`, `/arrangementer` and `/tjenester` became homepage sections. Each still exists as a small noindex page that forwards to `/#rom` or `/#selskap`.

Pages build as `meny.html` rather than `meny/index.html` (`build.format: 'file'`), so Netlify serves `/meny` without redirecting to `/meny/`.

## Content and Pages CMS

| File | Holds |
| --- | --- |
| `src/content/site.json` | Phone, e-mail, Facebook, Booking.com link, opening hours, rooms, venues, meeting rooms, nearby places and whether the directions are confirmed |
| `src/content/menu.json` | Menu sections, dishes, prices, variants, allergens, and which dishes are featured on the homepage |

- Pages CMS reads [`../.pages.yml`](../.pages.yml) at the repository root. Sign in at [app.pagescms.org](https://app.pagescms.org) with a GitHub account that has access to the repository, then pick the branch the site deploys from. Each save is a commit, and Netlify rebuilds.
- `settings.content.merge: true` keeps any keys the CMS form does not show, so a save never drops data.
- Every build validates both files against `src/data/schema.ts`. A bad edit (for example closing before opening, an unknown allergen or a duplicate section id) fails the build with the field named, and Netlify keeps serving the previous deploy.
- Each group has a `confirmed` switch. While it is off, the site shows the «bekreftes» mark next to those facts. Turn it on once the owners have checked them.
- `featured` on a dish puts it in the homepage menu excerpt.
- Allergens use the numbers from the menu screens (1 Gluten, 2 Laktose, 3 Egg, 4 Sennep, 5 Nøtter). Adding a sixth means adding it to the `allergens` list in `menu.json` and to the select options in `.pages.yml`.

Managed in code, not in the CMS:

- Photos: files in `public/img/`, with credit and rights status in `src/data/credits.ts`. Huset's own photos (`egen`) show no credit on the page; outside photos print theirs on the image. All of them are listed on `/anerkjennelse`.
- Location: `src/data/location.ts` holds the address (Kartverket), the map point and the arrival point the directions end on.
- Map, route and skyline lines: `src/data/norway-map.json`, `route-e6.json` and `ridges.json`.

## Contact form

The form posts to Netlify Forms with the old site's form name (`contact`) and field names (`contactName`, `contactEmail`, `contactPhone`, `contactMessage`), plus a honeypot (`bot-field`). With JavaScript it sends in the background, checks the fields and shows the result in place. Without JavaScript the browser posts it and lands on `/kontakt/takk`.

The form works only on Netlify. On the dev server, in a local preview or on GitHub Pages, sending shows the failure message.

## Netlify

Netlify Forms are stored per site. To keep the existing form, its submissions and its e-mail notifications, deploy this app to the **same Netlify site** as the old one, and run it on the test site first.

The old site is built in GitHub Actions and uploaded to Netlify (`.github/workflows/prod.yml` for `master`). `.github/workflows/dev.yml` already builds this app and uploads it to the test site on every push to `test` or `michaelsimsoe-huset-site-remake`, with every page `noindex`. To launch, copy its job into `prod.yml` with two changes: production secrets, and `FORCE_INDEX` on the build:

```yaml
      - run: npm run build
        env:
          FORCE_INDEX: 'true'
      - name: Deploy to Netlify
        run: npx --yes netlify-cli@27 deploy --dir=dist --no-build --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

Keep `--no-build`: current versions of the Netlify CLI build the project before deploying unless told not to.

Search engines see the site only when the build is marked as production. Otherwise every page is `noindex`, `robots.txt` says `Disallow: /` and the sitemap is empty. A build counts as production when:

- Netlify builds it with `CONTEXT=production` and `URL` on husetmotell.no (a Netlify site connected to Git, with base directory `website`, which reads `netlify.toml`), or
- `FORCE_INDEX=true` is set. GitHub Actions builds need this, because Netlify does not set `CONTEXT` for uploaded builds.

Other environment variables: `SITE_URL` (canonical origin, default `https://www.husetmotell.no`) and `BASE_PATH` (only for hosting under a sub-path).

`public/_headers` sets long caching for `/_astro/*` and two security headers. It ships inside `dist/`, so it works for both Git builds and uploads; `netlify.toml` only holds the build settings for a Git-connected site. Unlike the old site, there is no `/* /index.html 200` fallback: unknown paths get the real 404 page.

## Before launch

Facts (turn on `confirmed` in the CMS as each is checked):

- [ ] Opening hours
- [ ] Rooms: 8 rooms, from 1 130 kr (the old English page said 1 139 kr), check-in 14:00, check-out 12:00
- [ ] Venues: up to 80 guests, occasions, catering, cakes, outdoor seating, Sunday dinner
- [ ] Meeting rooms: prices, and whether they are per hour or per day
- [ ] Nearby places
- [ ] The whole menu: dishes, prices and allergens
- [ ] The arrival point: the directions end in the car park between the house and the E6
- [ ] Distances and drive times in «Her ligger Korgen» (calculated and rounded)

Photos (missing ones are shown as marked placeholders):

- [ ] A burger from the kitchen (placeholder under «Fra grillen» on `/meny`)
- [ ] Optional: a wide, unretouched facade photo (2:1, at least 2 400 px) to replace the AI-retouched masthead photo
- [ ] Rooms in higher resolution, especially the single room and the breakfast room
- [ ] Food as it is served, the restaurant with people in it, and a set breakfast table
- [ ] The logo as SVG

Other:

- [ ] Rewrite the privacy policy in Norwegian for what the new site actually does: Netlify stores what is sent through the contact form; the directions keep the chosen map app in the browser's local storage; fonts are self-hosted; there is no analytics, and Facebook is only a link.
- [ ] Test the directions on a real iPhone and a real Android phone.
- [ ] On the test site (deployed by `dev.yml`), send a test message and check that it arrives in Netlify and as an e-mail. Form detection must be on for that site.
- [ ] Switch `prod.yml`, deploy, then submit `https://www.husetmotell.no/sitemap.xml` in Google Search Console.

## Structure

```
src/
  content/      site.json, menu.json (edited in Pages CMS)
  data/         schema, data loaders, credits, location, map and skyline data
  lib/          hours, formatting, locator geometry, directions (URL builders, platform, saved choice)
  components/   Photo, Placeholder, Dish, Locator, Directions, ContactForm, Ridge, Confirm, Arrow
  layouts/      Layout.astro (head, SEO, top bar, footer)
  pages/        routes
  scripts/      browser scripts: open status, skyline and map motion, photo credits, directions, contact form
  styles/       global.css (tokens, type roles, components)
tests/          node --test suites
```
