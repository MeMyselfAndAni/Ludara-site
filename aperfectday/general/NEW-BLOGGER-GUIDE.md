# Adding a New Blogger Guide — Step by Step

## Overview
Each blogger gets their own branded subdirectory under `aperfectday/`.
The platform engine (_platform/) is shared — only the data, map config,
and branding change per guide.

---

## Step 1 — Decide the directory name
Use the blogger's brand name in lowercase, no spaces.
```
aperfectday/
  wanderlush/tbilisi/     ← Emily Lush / Wander-Lush
  HLO/london/             ← HLO blogger
  newbrand/city/          ← new blogger
```

---

## Step 2 — Create the folder structure
```
mkdir aperfectday\newbrand\city
mkdir aperfectday\newbrand\city\images
```

---

## Step 3 — Copy the template files
```
copy aperfectday\general\_template\data.js   aperfectday\newbrand\city\
copy aperfectday\general\_template\map.js    aperfectday\newbrand\city\
```
Copy `index.html` from the closest existing guide and edit it.

---

## Step 4 — Scrape the blogger's content
Claude will scrape the blogger's website and extract:
- Place names, addresses, coordinates
- Personal notes / descriptions
- Opening hours
- Tips
- Categories (landmark/food/cafe/church/market/soviet/nature)
- Neighbourhood assignments

Output: populated `data.js` with all PLACES entries.
Also: NBHD_CIRCLES in `map.js` with correct centres and radii.

---

## Step 5 — Edit data.js
- Fill in the PLACES array (from scrape)
- Set `const FAVS_KEY = 'cityname-favs'` — MUST be unique per guide
- Set CC/CL if categories differ from default

---

## Step 6 — Edit map.js
- Set `MAP_CENTER` to city centre lat/lng
- Set `MAP_ZOOM` (13=city overview, 14=district, 15=neighbourhood)
- Fill in `NBHD_CIRCLES` with correct centres and radii
  - Calculate from actual place coordinates
  - Radius = max distance from centre to furthest place × 1.25 + 80m buffer

---

## Step 7 — Edit index.html
Copy from `wanderlush/tbilisi/index.html` and change:
- [ ] Page title: `<title>City Guide — BloggerName</title>`
- [ ] Splash screen: blogger name, city, description
- [ ] Header: logo, guide title, blog URL, place count class
- [ ] Filter bar: keep standard or customise categories
- [ ] Neighbourhood bubbles: names, IDs, emoji — must match data.js nbhd values
- [ ] Google Maps API key (same key works for all)
- [ ] `const IMAGES_PATH = "images/";`  ← for local photo loading
- [ ] Footer/branding: blogger website link

---

## Step 8 — Download images
Run the image download script (Node.js):
```
node aperfectday\general\_tools\download-images.js --guide=newbrand/city
```
This fetches photos from Google Places API and saves to `images/{id}.jpg`.
Run once — images are then served locally forever.

---

## Step 9 — Create deploy script
Copy `_deploy/deploy-wanderlush-tbilisi.bat` → rename → update:
- `set GUIDE=%ROOT%\aperfectday\newbrand\city`
- Git add path
- Done URL

---

## Step 10 — Add to deploy-all.bat and qa-check.bat
In both files, add to the GUIDES line:
```
set GUIDES=wanderlush\tbilisi HLO\london newbrand\city
```

---

## Step 11 — Test locally
Open `index.html` directly in browser (or via local server).
Check:
- [ ] Map loads at correct city centre
- [ ] All markers appear
- [ ] Category filters work
- [ ] Neighbourhood filters work
- [ ] Place cards open with correct data
- [ ] Images load from local files
- [ ] Saved places work
- [ ] Route draws correctly
- [ ] PDF generates

---

## Step 12 — Deploy
```
aperfectday\general\_deploy\deploy-newbrand-city.bat
```

---

## Step 13 — Run QA check
```
aperfectday\general\_qa\qa-check.bat
```
All platform files should show OK.

---

## Step 14 — Tag the release
```
git tag v1.0-newbrand-city-launch
git push origin v1.0-newbrand-city-launch
```

---

## Checklist summary

- [ ] Folder created with images/ subdirectory
- [ ] data.js populated (PLACES array + FAVS_KEY)
- [ ] map.js configured (MAP_CENTER, MAP_ZOOM, NBHD_CIRCLES)
- [ ] index.html branded for this guide
- [ ] IMAGES_PATH set in index.html
- [ ] Images downloaded to images/
- [ ] Deploy script created and tested
- [ ] deploy-all.bat and qa-check.bat updated
- [ ] QA check passes
- [ ] Git tag created

---

## Notes
- FAVS_KEY must be unique per guide — if two guides share the same key,
  saved places will bleed between them
- Neighbourhood IDs in data.js must exactly match the onclick values
  in index.html bubble buttons
- Platform files (ui-*.js, photos.js, styles.css) are NEVER edited
  inside guide folders — always edit in _platform/ then deploy-all
