# Ludara.AI website — ongoing notes

## Decisions taken so far

- **Products page framing:** "Our broader vision" (not "Coming soon") — leaves future verticals open as long-term direction without dated commitments.
- **Pass 1 (this round):** Structure + navigation + cross-linking only. No artistic changes yet.

## Design pass — applied

- Cormorant Garamond added (Google Fonts) and used as serif on the main H1 of each page, with a subtle italic gold-highlight on key phrases.
- Thin 56×2 gold rule (`.gold-rule`) under main H1s and before the flagship block — ties the main pages to A Perfect Day without cloning its full palette.
- `--gold` and `--gold-l` variables added to all pages for future accents.
- "Why Ludara" card tightened — icons bumped from 26px to 30px, spacing increased, padding consistent.
- "Our flagship product" kicker on home and "Live now — Flagship product" on products both switched to gold, tying them visually to A Perfect Day.
- Flagship card bullets: left border changed from blue to gold for continuity.
- Open Graph + Twitter Card meta tags added to all four main pages (with og:image commented out until an image exists).
- A Perfect Day page: nav + footer harmonized with the rest of the site (Products + About now present, Ludara LLC footer, dynamic year script).
- **Pass 3 — nav simplified:** Removed "A Perfect Day" from the top nav on every page. Products page restructured into a 3-section list (A Perfect Day → Coming Up → Broader Vision) with a pill-shaped jump-link index at the top of the page.
- New CSS added to product.html: `.product-index` (jump-link pills), `.coming-card` (placeholder section styling), `.coming-tag` (gold "In development" pill), `.anchor` (scroll-margin-top helper).

## Still deferred

- Create a 1200x630 Open Graph image (og-image.png) and uncomment the `<meta property="og:image">` tags across all pages. A crop of the A Perfect Day hero or city strip would work well.
- Add a `sitemap.xml` and `robots.txt` for SEO.
- Decide whether to adopt `assets/styles/unified.css` across all pages or drop the references. Currently referenced on product/about/contact but not index or aperfectday — inconsistent.
- Consider updating the A Perfect Day page's own footer padding etc. to match the main site's rhythm exactly (currently close but not identical).

## Structural principle going forward

- Keep main Ludara site relatively neutral (sophisticated dark) so future products can each carry their own visual personality (as A Perfect Day does). Don't collapse A Perfect Day's brand into Ludara's.

## Navigation shape (4 items — revised)

Home · Products · About · Contact

- A Perfect Day was removed as a top-level tab. It now lives as the featured item on the Products page and as the flagship teaser on Home.
- Applied across home, product, about, contact, and the aperfectday page itself (where Products is the active tab now).

## Products page — 2-section list

The Products page is a single scrollable list with a pill-shaped jump nav at the top:

1. **A Perfect Day** — the existing flagship-card (live product).
2. **Broader Vision** — the 6-card grid of long-term directions (Travel, Museums, Education, Genealogy, Hotels/Resorts/Cruise Lines, Wellness).

Anchor IDs: `#aperfectday`, `#vision`. Scroll-margin-top applied via `.anchor` class so jump-links don't hide under the viewport edge.

(An interim "Coming Up" placeholder section was added and then removed — the page is cleaner without an empty tease. Re-introduce when there's a real next product to announce.)

## Footer pattern (standardized)

Links row (same 4 nav items) + `© <year> Ludara LLC · maria@ludara.ai`.

## Legal / brand split

- **Brand name** (everywhere in nav, logo, content): Ludara.AI
- **Legal entity** (footer copyright line only): Ludara LLC
- Previously about.html had "Ludara.AI, Inc." — corrected to Ludara LLC on this pass.
