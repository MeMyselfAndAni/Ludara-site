# A Perfect Day — Platform Knowledge Base v4
*Pass this document to a new Claude thread to continue building new guides.*
*Last updated: April 1 2026*

---

## What This Platform Is

A Perfect Day is an interactive city travel guide platform built for travel bloggers and food writers. Readers buy access to guides. Revenue split: **50% blogger, 45% Ludara, 5% payment fees**.

**Live guides:**
- `ludara.ai/aperfectday/wanderlush/tbilisi-offline/` — Emily Lush / Wander-Lush ✅ v2 reference
- `ludara.ai/aperfectday/nomadicmatt/bangkok/` — Nomadic Matt ✅ v2
- `ludara.ai/aperfectday/AdventurousKate/Prague/` — Adventurous Kate ✅ v2 (guide taken down — apology email pending)
- `ludara.ai/aperfectday/thecuriousmexican/MexicoCity/` — The Curious Mexican ✅ v2
- `ludara.ai/aperfectday/drizzleanddip/capetown/` — Sam Linsell / Drizzle & Dip ✅ v2 (70 places)
- `ludara.ai/aperfectday/zenkimchi/seoul/` — ZenKimchi / Joe McPherson ✅ v2 (53 places, 7 nbhds)
- `ludara.ai/aperfectday/ludara/london/` — **Neutral demo guide** ✅ v2 (68 places, 10 nbhds) — **USE THIS for all hotel outreach**

**Do NOT touch:**
- `ludara.ai/aperfectday/wanderlush/tbilisi/` — v1 Google Maps (do not touch)
- `ludara.ai/aperfectday/HLO/london/` — v1 Google Maps (do not touch)

---

## Tech Stack

- **Map:** MapLibre GL JS v4.7.1
- **Tiles:** MapTiler Streets v2
- **MapTiler API key:** `V3bgGWhyO1Rik6g1non6` (restricted to `ludara.ai`)
- **Walking routes:** `routing.openstreetmap.de/routed-foot` (OSRM, no key needed)
- **Hosting:** Netlify (free tier, auto-deploys from GitHub push in ~30s)
- **Repo:** GitHub `MeMyselfAndAni/Ludara-site`
- **Local repo:** `C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site`

---

## Repository Structure

```
aperfectday/
├── general/
│   ├── _platform-v2/          ← SHARED files — NEVER edit per-guide
│   │   ├── map-core.js
│   │   ├── styles.css
│   │   ├── photos.js
│   │   ├── ui-card.js
│   │   ├── ui-filter.js
│   │   ├── ui-favourites.js
│   │   ├── ui-pdf.js
│   │   ├── ui-stories.js
│   │   ├── sw.js
│   │   └── favicon.svg
│   ├── _template-v2/          ← copy this to start a new guide
│   │   ├── map.js
│   │   ├── index.html
│   │   └── data.js
│   ├── _scripts/
│   │   ├── resize-images.js
│   │   └── node_modules/      ← npm install sharp (once)
│   └── _deploy/
│       └── deploy-BLOGGER-CITY.bat
├── wanderlush/tbilisi-offline/ ← v2 REFERENCE
├── nomadicmatt/bangkok/
├── thecuriousmexican/MexicoCity/
├── drizzleanddip/capetown/
├── zenkimchi/seoul/
└── ludara/london/              ← NEUTRAL DEMO GUIDE — use for hotel outreach
```

---

## Golden Rules

1. **Never edit shared files inside a guide folder.** Always edit `_platform-v2/`, then redeploy.
2. **The only files that live permanently in a guide folder are:**
   - `map.js` — city config, CC, CL, neighbourhoods, initMap()
   - `index.html` — blogger name, city, neighbourhood bubbles
   - `data.js` — all places data
   - `images/` — place-1.jpg through place-N.jpg
3. **Never call `initMap()` at the bottom of map.js.**
4. **`FAVS_KEY` must NOT be in map.js.** It lives inside `ui-favourites.js`.
5. **Tip label is always `💡 Visitor Tip`** — never the blogger's name.
6. **All notes must be the blogger's exact published words** — never invented or paraphrased.

---

## ══ CONTENT AUTHENTICITY RULES (CRITICAL) ══

These rules exist because AI-generated content attributed to bloggers has caused real problems (Bangkok, Mexico City, Prague). Enforce on every guide before deployment and before blogger outreach.

### note field
Must be the **blogger's exact published words**, copied verbatim. No paraphrasing, no additions, no invented text. If the blogger hasn't written about a place personally, write a factual description — but do NOT present it as their words (no `— BloggerName` attribution).

### tip field
Must be the blogger's exact words, or an empty string `''`. Never invent tips.

### tip label
Always `💡 Visitor Tip` in index.html — never `💡 BloggerName's Tip`.

### pc-emily-by attribution line
Only use `— FirstName, BlogBrand` on entries where the note is genuinely the blogger's own published text.

### Source comment format in data.js
```javascript
// SOURCE: https://bloggersite.com/post-about-this-place/
// ✅ Verified exact words from source
```
or:
```javascript
// ⚠️ No dedicated post — factual description only, not attributed as blogger's words
```

### Before outreach: run the QA Agent
The QA Content Verification Agent checks every note and tip against the source text. Run it on every guide before approaching the blogger.

---

## ══ NEUTRAL LONDON DEMO GUIDE ══

**Built: April 2026. Path: `aperfectday/ludara/london/`**
**URL: `ludara.ai/aperfectday/ludara/london/`**

This is the universal demo guide used for ALL hotel outreach. No blogger name anywhere — branded as "A Perfect Day · Ludara.AI" only. Safe to send to any hotel in any city.

### Stats
- **68 places** across **10 neighbourhoods**
- Westminster · South Bank · Borough & Bermondsey · The City · Covent Garden & Soho · Camden & King's Cross · Notting Hill · Kensington · Greenwich · Shoreditch & Spitalfields

### What makes it non-generic
Deliberately includes places that ChatGPT/Google Maps wouldn't suggest: Dennis Severs' House, Columbia Road Flower Market, Beigel Bake, Rochelle Canteen (ring the bell to enter), Maltby Street Market, St John Restaurant, The Palomar, Hoppers, Rules, Platform 9¾, Australia House (Gringotts). Descriptions are written in a strong editorial voice, not tourist-guide prose.

### Files
- `map.js` — 10 neighbourhoods including `shoreditch` (colour: `#e85b7a`)
- `index.html` — 68 places, no `.pc-emily-by` attribution (hidden via CSS)
- `data.js` — 68 places, all original factual descriptions, no blogger attribution, no `blog:` fields
- `fetch-images-london.js` — uses **Wikipedia pageimages API** (not Commons filename guessing)
- `deploy-ludara-london.bat` — deploys to `aperfectday/ludara/london/`

### Images — how the fetch script works
Uses `en.wikipedia.org/w/api.php?action=query&prop=pageimages` with article titles. Much more reliable than guessing Wikimedia Commons filenames. Key lessons learned:
- Use `FORCE_REFRESH = new Set([id1, id2])` to delete and re-download specific images
- Clear FORCE_REFRESH after all images are correct (set to `new Set([])`) or it deletes every run
- Wikipedia article images are often generic (microscopy slides for "bone marrow", countryside bridges for "viaduct") — use specific themed articles, not the exact place name
- Museums: use specific exhibit names (`Archaeopteryx`, `Ardabil Carpet`, `Stephenson's Rocket`) not the museum name itself which returns logos
- Avoid: portraits of people, microscopy images, raw ingredient photos on white backgrounds

### Resize command (run from `_scripts`):
```
node resize-images.js ..\..\ludara\london
```

---

## ══ HOTEL OUTREACH — CRITICAL RULES ══

1. **Never use blogger names in hotel emails** until the blogger has explicitly approved. The guides show blogger branding when clicked — acknowledged risk — but emails must be neutral.
2. **Use the neutral London guide as the demo link** for all hotel outreach: `ludara.ai/aperfectday/ludara/london/`
3. **Do not approach bloggers** until first hotel client is confirmed. The trust problem requires proof of earnings.

### Email templates (ready to send)

**Tbilisi hotels:**
> Subject: A Tbilisi city guide for your guests — we built it
> "We built an interactive city guide for Tbilisi — curated by a local expert, 70+ places across neighbourhoods, filterable by area, with real walking routes and offline capability. Here it is: ludara.ai/aperfectday/wanderlush/tbilisi/ ..."
> ⚠️ Do NOT mention Emily Lush's name until she approves.

**Bangkok hotels:**
> Subject: A Bangkok city guide for your guests — we built it
> Reference: ludara.ai/aperfectday/nomadicmatt/bangkok/
> ⚠️ Do NOT mention Nomadic Matt's name.

**Mexico City hotels:**
> Subject: A Mexico City guide for your guests — we built it
> Reference: ludara.ai/aperfectday/thecuriousmexican/mexicocity/
> ⚠️ Do NOT mention The Curious Mexican's name.

---

## ══ HOTEL CONTACTS — ALL CITIES ══

### Cape Town & Winelands (13 contacts)

| Hotel | Contact | Email | Status |
|---|---|---|---|
| Babylonstoren | Reservations | reservations@babylonstoren.com | Pending |
| Spier Hotel | Lourensia Parr, Mktg Mgr | lourensia@lanzerac.co.za | Pending |
| Leeu Collection | Lynn Voges, Head of Sales | lynn.voges@leeucollection.com | Pending |
| Leeu Collection | Lee-Anne Kurtz | lee-anne.kurtz@leeucollection.com | Pending |
| Ellerman House | Karien Bendle, Hotel Mgr | LinkedIn DM | Pending |
| Delaire Graff | Tanja von Arnim | tanja@delaire.co.za + LinkedIn | Bounced — retry after SPF fix |
| Franschhoek Country House | General | info@fch.co.za | Pending |
| Mont Rochelle | Elizame | info@montrochelle.virgin.com | Pending |
| The Last Word | Nicky Coenen, Group GM | nicky@thelastword.co.za | Pending |
| Lanzerac | Lourensia Parr | emile.langenhoven@lanzerac.co.za | Bounced — retry after SPF fix |
| Grootbos | Sean Ingles, GM | sean@grootbos.com | Pending |
| Birkenhead House | Shane Brummer, GM | shane@theroyalportfolio.com + LinkedIn | Bounced — retry after SPF fix |
| 12 Apostles | Juan, GM | juan@12apostles.co.za | Pending |

### Seoul (4 contacts)

| Hotel | Contact | Channel | Status |
|---|---|---|---|
| Josun Palace | Maxime Beyer, Dir. Guest Relations | maxime.beyer@josunpalace.com | Pending |
| L'Escape Hotel | KC Park, GM | LinkedIn | Pending |
| Hotel28 Myeongdong | Jay Kim, GM | LinkedIn | Pending |
| Westin Josun Seoul | Vivien Lee, GM | LinkedIn | Pending |

### London (6 contacts)

| Hotel | Contact | Channel | Status |
|---|---|---|---|
| One Aldwych | Gavin Couper, GM | gavin.couper@onealdwych.com (bounced) + LinkedIn | Bounced — retry |
| The Laslett | Décio, Manager | LinkedIn | Pending |
| Flemings Mayfair | General | info@flemings-mayfair.co.uk | Pending |
| Beaverbrook Town House | GM/marketing | LinkedIn | Pending |
| The Hari London | Francesco Sardelli, GM | LinkedIn | Pending |
| Portobello Hotel | Hanna Turner | LinkedIn | Pending |

### Tbilisi (6 contacts) — NOT YET SENT

| Hotel | Contact | Email | Notes |
|---|---|---|---|
| Stamba Hotel | Natia Chikviladze, GM | **GM@stambahotel.com** ✅ | Confirmed from TripAdvisor. Part of Adjara Group |
| Rooms Hotel | Marketing/General | **tbilisi@roomshotels.com** ✅ | Independent lifestyle brand |
| The Telegraph Hotel | GM | +995 32 244 31 31 | Leading Hotels of the World |
| Blue Fox Hotel | Owner | +995 595 98 65 98 | Design Hotels member, Old Tbilisi |
| Communal Sololaki | Manager Giorgi | +995 599 64 99 66 | Local boutique chain |
| Bellhop Tbilisi | Management | bellhoptbilisi.com / Instagram | Opened 2025 |

### Bangkok (4 contacts) — NOT YET SENT

| Hotel | Contact | Email | Notes |
|---|---|---|---|
| The Siam | Syahreza Ishwara, GM | **syahreza@thesiamhotel.com** ✅ | Also: Thanawat Pucome (Mktg): **thanawat@thesiamhotel.com** ✅ |
| Sala Rattanakosin | Admin | **admin@salarattanakosin.com** ✅ | 15-room riverfront boutique |
| Ariyasom Villa | Owner | +66 82 790 1279 | Family-owned garden oasis |
| 137 Pillars Bangkok | Nida Wongphanlert, MD | **marcomm@137pillarshotels.com** ✅ | SLH member |

### Mexico City (5 contacts) — NOT YET SENT

| Hotel | Contact | Email | Notes |
|---|---|---|---|
| Condesa DF | GM / Grupo Habita | condesadf.com contact form | Same group as Habita — one pitch covers both |
| Nima Local House | Owner Regina Montes | +52 55 1171 8585 / nimalocalhouse.com | 4 rooms only |
| Roso Guest House | GM | +52 56 1022 6168 / rosoguest.com | SLH member |
| Brick Hotel | GM/marketing | itbrickhotel.com | SLH member, 17 rooms, Roma Norte |
| Hotel Habita | GM / Grupo Habita | +52 55 5282 3100 | Same group as Condesa DF |

### Boutique Chains — Brand Level (NOT YET SENT)

| Chain | Contact | LinkedIn |
|---|---|---|
| Ruby Hotels (IHG) | Nadezhda Bej, Sr. Mgr Digital Brand | linkedin.com/in/nadezhda-bej |
| Zoku | Hans Meyer, Co-founder & MD | linkedin.com/in/ihansmeyer |
| citizenM | Robin Chadha, Co-founder/CMO | linkedin.com/in/robin-chadha-1968245 |
| 25hours/Ennismore | Adrianna J., Brand Mktg Dir. | linkedin.com/in/adriannajuran |
| Locke Hotels/edyn | Eric Jafari, Co-founder & CDO | Search "Eric Jafari edyn" |
| Numa Group | Christian Gaiser, CEO | Search "Christian Gaiser Numa Group" |

### Outreach Tracker
- `Outreach-Tracker.html` — editable HTML tracker with all 46+ contacts loaded

---

## ══ EMAIL DELIVERABILITY (Fixed April 1 2026) ══

### Architecture
- `maria@ludara.ai` mailbox hosted at **Porkbun** (hognose1.porkbun.com)
- Outreach emails sent via **Gmail** "Send mail as" → goes through Gmail servers
- Gmail sending IP: **`209.85.216.45`** (mail-pj1-f45.google.com)
- Porkbun webmail sending IP: **`35.82.102.206`** (hognose1.porkbun.com)

### Critical DNS lesson
**Netlify is the authoritative DNS for ludara.ai** — not Porkbun. Changes made in Porkbun DNS are ignored because Netlify's nameservers are active. All DNS changes must be made in **Netlify → Domains → ludara.ai → DNS settings**.

### DNS records (verified correct April 1 2026 — in Netlify)
- **SPF:** `v=spf1 include:_spf.google.com include:_spf.porkbun.com ~all` ✅
- **DKIM:** `default._domainkey.ludara.ai` — key present ✅
- **DMARC:** `v=DMARC1; p=none; rua=mailto:...` ✅

### Microsoft delist
- Submitted April 1 2026 at **sender.office.com** with Gmail IP `209.85.216.45`
- Reason: Exchange servers rejected with `550 5.4.1 Access denied` before SPF fix
- Bounced contacts to retry: Delaire Graff, Lanzerac, Birkenhead House, One Aldwych

### Verification
- **MXToolbox:** `spf:ludara.ai` → should show both `_spf.google.com` and `_spf.porkbun.com`
- **mail-tester.com** — send test email, target 9+/10
- To find sending IP: send email, check Show Original headers for `Received: from mail-xxx.google.com [IP]`

---

## ══ BUSINESS MODELS ══

### Model 1 — Blogger Guide (reader-facing)
- Readers pay ~$10–15. Split: 50% blogger / 45% Ludara / 5% fees
- **Status: STUCK** — no blogger signed on. Core problem: trust + no proof of earnings.
- **Do not pursue until first hotel client confirmed.**

### Model 2 — Hotel Concierge Guide (B2B) ← CURRENT FOCUS
- Hotel pays setup $500–800 + $80–120/month maintenance
- First client pilot: $0 setup + $50–80/month for 3 months, in exchange for testimonial
- **Status: Active outreach — 46+ contacts across 6 cities**

### Model 3 — Hotel licensing a Blogger Guide
- Only possible after Model 1 has a live blogger. Future model.

---

## ══ PHOTOS — WORKFLOW FOR NEUTRAL/TRAVEL GUIDES ══

Use the **Wikipedia pageimages API** — far more reliable than guessing Wikimedia Commons filenames.

```javascript
// fetch-images-london.js approach — reuse this pattern for future city guides
const WP_API = 'https://en.wikipedia.org/w/api.php';

async function getWikiImage(title) {
  const url = `${WP_API}?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&pithumbsize=1000&pilimit=1&format=json`;
  const data = await fetchJSON(url);
  const pages = data.query && data.query.pages;
  if (!pages) return null;
  const page = Object.values(pages)[0];
  return (page && page.thumbnail && page.thumbnail.source) || null;
}
```

**ARTICLES map** — key decisions:
- For restaurants with no Wikipedia article, use the **dish they're famous for** (e.g. `Cacio e pepe`, `Appam`, `Sunday roast`)
- For museums, use **specific famous exhibits** not the museum name (logos): `Archaeopteryx`, `Ardabil Carpet`, `Stephenson's Rocket`
- Avoid articles that return: portraits, raw ingredient closeups, microscopy images, rural landscapes
- Use `FORCE_REFRESH = new Set([id1, id2])` to force re-download of specific IDs
- **Clear FORCE_REFRESH to `new Set([])` after all images are correct** — or it deletes and re-downloads every run

**Resize command** (run from `_scripts`):
```
node resize-images.js ..\..\BLOGGER\CITY
```
⚠️ Must be run from `_scripts` folder, not from the guide folder.

---

## ══ GUIDE BUILDING — STEP BY STEP ══

1. **Research** — fetch city guide posts. Extract all places. Note exact words.
2. **Data Agent** — extract entries into data.js format using only source words.
3. **Define 5–10 neighbourhoods** — get approximate center lat/lng for each.
4. **Build `data.js`** — one object per place. `nbhd` keys must match map.js exactly.
5. **Build `map.js`** — city center, CC (include `pub`), CL, neighbourhoods. Do NOT call initMap(). Do NOT add FAVS_KEY.
6. **Build `index.html`** — copy from `_template-v2/index.html`. Tip label = `💡 Visitor Tip`.
7. **Validate JS** — run `node --input-type=module < data.js` — must produce no errors.
8. **Create guide folder** — `aperfectday/BLOGGER/CITY/`
9. **Fetch photos** — use Wikipedia pageimages API (travel guides) or blogger's own site (food guides). Use `FORCE_REFRESH` for replacements, clear it after.
10. **Resize** — `node resize-images.js ..\..\BLOGGER\CITY` from `_scripts` folder.
11. **Write deploy bat** — copy template, update GUIDE path.
12. **Deploy** — run bat. Live in ~30s.
13. **Test on mobile** — splash, filters, neighbourhood bubbles, place cards, favourites.
14. **Run QA Agent** — verify all notes against source before emailing blogger.

---

## ══ NEUTRAL GUIDE RULES ══

For neutral guides (no blogger attribution — like `ludara/london`):
- `BLOGGER_NAME = 'A Perfect Day'` in map.js
- No `.pc-emily-by` attribution span — hide with CSS: `.pc-emily-by { display: none !important; }`
- No `blog:` fields in data.js entries
- No "Blog ↗" button in header
- Splash: "hand-picked places across [city]'s best neighbourhoods — curated for the curious traveller"
- Notes are original factual descriptions — not scraped from any single source

---

## map.js — Complete Template

```javascript
// A Perfect Day — [Blogger Name] / [City]
// map.js — guide-specific config

const MAPTILER_KEY      = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER        = [LNG, LAT];    // ⚠️ longitude FIRST, then latitude
const MAP_ZOOM          = 13;
const OFFLINE_CENTER    = { lat: LAT, lng: LNG };
const GUIDE_CITY        = 'City Name';
const BLOGGER_NAME      = 'FirstName';
// ⚠️ DO NOT add FAVS_KEY here — it lives in ui-favourites.js

const CC = {
  'landmark': '#e8724a',
  'food':     '#f0c060',
  'cafe':     '#6b9e6e',
  'pub':      '#8b6bb1',
  'church':   '#6090c8',
  'market':   '#c08060',
  'soviet':   '#9080a8',
  'nature':   '#50906a',
};

const CL = {
  'landmark': 'Landmarks',
  'food':     'Restaurants',
  'cafe':     'Bars & Cafés',
  'pub':      'Bars',
  'church':   'Churches',
  'market':   'Markets',
  'soviet':   'Soviet',
  'nature':   'Nature',
};

const NBHD_COLORS = { 'key': '#e8724a' };
const NBHD_LABELS = { 'key': 'Display Name' };
const NBHD_APPROX_CENTERS = { 'key': { lat: 0.0000, lng: 0.0000 } };

function initMap() {
  map = new maplibregl.Map({
    container: 'map',
    style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`,
    center: MAP_CENTER,
    zoom: MAP_ZOOM,
    attributionControl: false,
  });
  map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
  map.on('error', function(e) {
    var d = document.createElement('div');
    d.style.cssText = 'position:fixed;top:50%;left:5%;right:5%;transform:translateY(-50%);background:#900;color:#fff;padding:15px;border-radius:8px;z-index:999999;font-size:12px;font-family:monospace;';
    d.textContent = 'Map error: ' + (e.error ? e.error.message : JSON.stringify(e));
    document.body.appendChild(d);
  });
  map.on('load', () => {
    try {
      document.getElementById('loading').style.display = 'none';
      map.getStyle().layers.forEach(layer => {
        if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
          try { map.setLayoutProperty(layer.id, 'text-field', ['coalesce', ['get', 'name:en'], ['get', 'name']]); } catch(e) {}
        }
      });
      NBHD_CIRCLES = buildNbhdCircles();
      initMapSources();
      if (map.getSource('trip-route')) {
        map.getSource('trip-route').setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: [] } });
      }
      PLACES.forEach(p => addMarker(p));
      if (typeof applyFilters   === 'function') applyFilters();
      if (typeof renderList     === 'function') renderList();
      if (typeof initFavourites === 'function') initFavourites();
      if (typeof alignNbhdBar   === 'function') alignNbhdBar();
    } catch (err) {
      const el = document.getElementById('loading');
      if (el) { el.style.display = 'flex'; el.innerHTML = '<div style="color:red;padding:20px;font-size:12px;font-family:monospace;">ERROR: ' + err.message + '</div>'; }
      console.error('Map load error:', err);
    }
  });
}
// ⚠️ DO NOT call initMap() here
```

---

## Known Bugs & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `CC is not defined` | Missing `CC` in map.js | Add `const CC = { ... }` |
| `CL is not defined` | Missing `CL` in map.js | Add `const CL = { ... }` |
| `PLACES is not defined` | Syntax error in data.js | Run `node --input-type=module < data.js` to find it |
| Zero markers, empty list | `initMap()` called at bottom of map.js | Remove the call |
| Favourites broken | `FAVS_KEY` declared in map.js | Remove it |
| `EPERM rename .tmp` in resize | OneDrive locking file | Deploy anyway |
| Portrait images cropped badly | `object-fit: cover` | Use `object-fit: contain` + dark background |
| Neighbourhood labels misaligned | Single-line CSS | Use flex-column bubbles + min-height labels |
| Fetch script puts images in wrong folder | `OUT_DIR` path has wrong number of `..` | Script runs from `_scripts` → needs `../..` to reach `aperfectday` root |
| SPF changes not taking effect | Netlify is authoritative DNS, not Porkbun | Make DNS changes in Netlify, not Porkbun |
| fetch script re-downloads on every run | `FORCE_REFRESH` not cleared | Set `FORCE_REFRESH = new Set([])` after fixes are done |

---

## Features Working in v2

- ✅ Splash screen with blogger bio and place count
- ✅ Interactive MapLibre + MapTiler map (English labels forced)
- ✅ Emoji pins coloured by category
- ✅ Place cards: photo, note, hours, tip, contacts, website link
- ✅ Category filter pills
- ✅ Neighbourhood bubbles with animated circles + map pan
- ✅ Places list — mobile bottom sheet, desktop right panel
- ✅ Favourites / saved places with ♡
- ✅ Trip planner with real walking route via OSRM
- ✅ PDF download of saved trip
- ✅ Offline mode (service worker + MapTiler tile caching)
- ✅ Open Now filter

---

## Tools Built

### QA Content Verification Agent (`qa-agent.jsx`)
React artifact. Inputs: data.js + sources .txt. Checks every note/tip/neighbourhood/category against blogger's real published content. **Run before every blogger outreach.**

### Outreach Tracker (`Outreach-Tracker.html`)
Editable HTML tracker. 46+ contacts across Cape Town, Seoul, London, Tbilisi, Bangkok, Mexico City, and Boutique Chains. Filter by city, edit inline, track status.

---

## Contacts & Accounts

- **Netlify:** free tier, auto-deploys from GitHub push. **Authoritative DNS for ludara.ai.**
- **Porkbun:** domain `ludara.ai`, mailbox `maria@ludara.ai` ($2/month). DNS changes here are IGNORED — use Netlify.
- **MapTiler:** free tier (100k loads/month), key restricted to `ludara.ai`
- **GitHub:** `MeMyselfAndAni/Ludara-site`
- **Contact email:** maria@ludara.ai (Porkbun mailbox, sends via Gmail "Send mail as")
- **Gmail sending IP:** `209.85.216.45` (mail-pj1-f45.google.com) — the IP that matters for delist
- **Porkbun webmail IP:** `35.82.102.206` (hognose1.porkbun.com) — used when sending from Porkbun webmail

---

## ══ CLAUDE CODE — RECOMMENDED FOR FILE WRITING ══

For future guide builds, use **Claude Code** instead of this web interface. It writes files directly to your local repo without copy-pasting.

**Setup:**
```
npm install -g @anthropic-ai/claude-code
cd C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site
claude
```

Pass this knowledge base file at the start of each Claude Code session. Claude Code can write data.js, map.js and index.html directly to `aperfectday/BLOGGER/CITY/`, run deploy bats, check JS errors, and run resize — all without leaving the terminal.

---

## ══ BLOGGER STATUS (April 2026) ══

| Blogger | City | URL | Status |
|---------|------|-----|--------|
| Sam Linsell (Drizzle & Dip) | Cape Town & Winelands | `.../drizzleanddip/capetown/` | ✅ Built — email sent, awaiting reply |
| Emily Lush (Wander-Lush) | Tbilisi | `.../wanderlush/tbilisi-offline/` | Awaiting reply |
| Nomadic Matt | Bangkok | `.../nomadicmatt/bangkok/` | Apology + re-pitch pending |
| Adventurous Kate | Prague | `.../AdventurousKate/Prague/` | Guide taken down — apology pending |
| The Curious Mexican (Anais) | Mexico City | `.../thecuriousmexican/MexicoCity/` | Awaiting reply |
| ZenKimchi / Joe McPherson | Seoul | `.../zenkimchi/seoul/` | Built — run QA Agent before outreach |
| Hand Luggage Only | London | `.../HLO/london/` | v1 only — neutral guide built instead |

**Key principle:** Do not approach bloggers until first hotel client confirmed. Trust requires proof of earnings.

---

## ══ COMPETITIVE LANDSCAPE ══

**HipMaps** — custom branded maps for hotels. DIY, no blogger angle, no offline PWA, no revenue split.
**Proxi** — interactive city guide maps, hotel-focused. Generic DIY tool, no blogger voice.
**Wanderlog** — trip planning + maps for bloggers. Planning tool, not a curated guide.
**MapifyPro** — WordPress map plugin. Plugin, not standalone, not sellable.

**A Perfect Day's unique combination:** Blogger's voice + paywall + offline PWA + trip planner + hotel distribution channel + done-for-you service.

---

## ══ PRICING MODEL ══

- **Setup:** $500–800 one-time
- **Monthly maintenance:** $80–120/month
- **First client pilot:** $0 setup + $50–80/month for 3 months + testimonial

| Hotels | Monthly revenue |
|---|---|
| 5 | $500–600/month |
| 10 | $1,000–1,200/month |
| 20 | $2,000–2,400/month |
| 50 | $5,000–6,000/month |
