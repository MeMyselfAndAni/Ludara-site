# Adding a family map

## How a map is put together

Every map folder holds two kinds of file.

**The engine — identical in every map.** Never edit these for one family:

    index.html*  styles.css   map-core.js  map.js      lang.js
    ui-card.js   ui-filter.js ui-tree.js   ui-favourites.js
    ui-stories.js ui-pdf.js   photos.js    tutorial.js
    sw.js        favicon.svg  minimize-images.js

\* `index.html` is *almost* shared — it still carries the splash markup and the
region bubbles, which differ per family. Everything else in it is common.

**This family's own:**

    family.js    every name, colour, label, region and tour sentence
    data.js      the places
    people.js    the family tree
    credits.js   image credits
    images/      the photographs
    <slug>-git.bat   the deploy script

`family.js` is the point of the whole arrangement. If you are about to type a
family name, a branch key or a region name into any other file, it belongs in
`family.js` instead. That is exactly how the Lando-Kliot name kept surviving into
the Bar-Or map — it was written into `lang.js`, `ui-pdf.js`, `map.js`, `ui-tree.js`
and `tutorial.js`, five files nobody thought to check.

---

## Starting a new family

1. **Copy an existing map folder** and rename it — the folder name is the slug,
   lower case, no spaces: `familystorymap\CohenFamily`.

2. **Rename the deploy script** to `<slug>-git.bat` and change the two paths and
   the URL inside it.

3. **Rewrite `family.js` top to bottom.** Every value in it is the previous
   family's. In particular:
   - `slug`, `url` — must match the folder name
   - `cacheVersion` — start at 1
   - `languages` — `['he']` for a single-language map, `['he','ru','en']` for three
   - `title`, `credit` — the header
   - `threads` — one per `cat` value you will use in `data.js`
   - `regions` — one per `nbhd` value, each with its own `minRadius`
   - `tree.branches` — one per `branch` value in `people.js`; each key must also
     be a thread key, or the branch renders grey
   - `tutorial` — the sentences in the welcome tour that name the family

4. **Replace `data.js`, `people.js`, `credits.js` and `images/`.**

5. **Edit `index.html`** for the four things it still owns: the `<title>` and
   meta tags, the splash text, the region bubble row, and the header markup.

6. **Run the checker.**

       _tools\check-map.bat CohenFamily

   It fails if any of the previous family's names survive, if a `cat`/`nbhd`/
   `branch` value has no matching entry in `family.js`, if a region has no
   `minRadius`, if the family tree has a child on the wrong row or two people
   overlapping, if a file is missing from the deploy list, or if an engine file
   has drifted from the other maps.

7. **Deploy** with the `.bat`, then open the map and click through it.

---

## Changing something in every map at once

Make the change in one map. Check it there. Then:

    _tools\sync-shared.bat LandoKliotFamily              (see what would change)
    _tools\sync-shared.bat LandoKliotFamily --write      (apply it)
    _tools\check-map.bat                                 (check every map)

Then bump `cacheVersion` in each `family.js` and deploy each map.

`sync-shared` only ever touches the engine list. It cannot overwrite a family's
own `family.js`, `data.js`, `people.js`, `credits.js`, `index.html` or images.

---

## What the checker looks for, and why

Each rule exists because it actually went wrong:

| Rule | What happened |
|---|---|
| No other family's name in this folder | The Bar-Or map's header, PDF cover and welcome tour all still said Lando-Kliot |
| `nbhd` ↔ `regions` keys match | Bar-Or's `NBHD_MIN_RADIUS` still listed `belarus`/`russia`, so its own regions fell back to an 80 m radius — the America bubble was invisible |
| Every file is on the deploy list | `lang.js` was missing from the `.bat` for weeks; the trilingual engine was live only because it had been copied by hand |
| Cache name matches the slug | `sw.js` purged caches named `inanasfootsteps`, so old shells were never evicted on a version bump |
| Engine files identical across maps | Fixes applied to one map silently never reached the other |
| Tree rows and columns | Grandchildren sat on the row of their parents' siblings; spouses sat on different rows |

---

## The one thing the tools cannot check

Whether the *content* is right — whether a place is where the book says it is, or
whether a person's surname is the one the family actually uses. That still needs a
person who knows the family to read it. Everything above only guarantees that the
map is about the family it claims to be about.
