# A Perfect Day — Platform Guide

## Directory structure

```
aperfectday/
  general/
    _platform/    Shared engine — edit here, deploy everywhere
    _template/    Copy this to start a new guide
    _deploy/      All deploy scripts
    _qa/          QA and sync checker tools
    README.md     This file

  wanderlush/
    tbilisi/
      index.html  Guide-specific
      data.js     Guide-specific
      map.js      Guide-specific
      images/     Downloaded place photos (future)

  hmo/
    london/
      index.html
      data.js
      map.js
      images/
```

---

## How to fix a bug or add a feature

1. Edit the file in `general/_platform/`
2. Test locally
3. Run `general/_deploy/deploy-all.bat` to push to ALL guides
   — OR run a specific guide's bat to push to just that one

---

## How to add a new guide

1. Copy `general/_template/` to `newblogger/city/`
2. Edit `data.js` — add PLACES array and set FAVS_KEY
3. Edit `map.js` — set MAP_CENTER, MAP_ZOOM, NBHD_CIRCLES
4. Edit `index.html` — set guide title, blogger name, neighbourhood bubbles
5. Copy `general/_deploy/deploy-hmo-london.bat` → rename → update paths
6. Add the new guide path to `deploy-all.bat` GUIDES line
7. Add the new guide path to `_qa/qa-check.bat` GUIDES line
8. Run the new guide's deploy bat

---

## Files per guide

| File | Where it lives | Who edits it |
|------|---------------|--------------|
| ui-card.js | _platform | Platform (you) |
| ui-filter.js | _platform | Platform (you) |
| ui-stories.js | _platform | Platform (you) |
| ui-favourites.js | _platform | Platform (you) |
| ui-pdf.js | _platform | Platform (you) |
| photos.js | _platform | Platform (you) |
| styles.css | _platform | Platform (you) |
| data.js | guide folder | Per guide |
| map.js | guide folder | Per guide |
| index.html | guide folder | Per guide |

---

## Active guides

| Guide | Blogger | URL | Status |
|-------|---------|-----|--------|
| wanderlush/tbilisi | Emily Lush | ludara.ai/aperfectday/wanderlush/tbilisi | Live |
| HLO/london | TBD | ludara.ai/aperfectday/HLO/london | In development |
