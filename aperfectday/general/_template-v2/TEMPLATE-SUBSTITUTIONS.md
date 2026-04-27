# Template Substitutions Guide

This is the reference for filling in `index-TEMPLATE.html` when deploying a new guide.

**The product line is "A Perfect Day".** It can be co-branded three ways:

| Mode | Who pays | Example guide title |
|---|---|---|
| **HOTEL** | The hotel | *A Perfect Day in Nashville by Holston House* |
| **BLOGGER** | The blogger (licenses the platform) | *ZenKimchi — Seoul Food Guide* |
| **LUDARA** | Ludara (own demos / flagships) | *A Perfect Day — Nashville Guide* |

The "Interactive map by A Perfect Day by Ludara.AI" credit in the header is not a placeholder — it appears on every guide regardless of mode.

---

## Placeholder reference

### City & counts

| Placeholder | Purpose | Hotel example | Blogger example | Ludara example |
|---|---|---|---|---|
| `{{CITY_NAME}}` | City name. Used in loading text and in the Google Maps navigate fallback. | `Nashville` | `Seoul` | `Nashville` |
| `{{PLACE_COUNT}}` | Number of places in the guide (appears in 6 places in the file). | `50` | `53` | `50` |

### Titles & headlines

| Placeholder | Purpose | Hotel example | Blogger example | Ludara example |
|---|---|---|---|---|
| `{{GUIDE_TITLE}}` | Browser tab title. Full product name. | `A Perfect Day in Nashville by Holston House` | `ZenKimchi — Seoul Food Guide` | `A Perfect Day — Nashville Guide` |
| `{{SPLASH_TITLE}}` | Large h2 title on the welcome splash. Can include `<br>` for two lines. | `A Perfect Day in Nashville<br>by Holston House` | `Seoul Food Guide` | `A Perfect Day in Nashville` |
| `{{HEADER_EMPHASIS}}` | Italicised part of the header h1 (inside `<em>` tags). | `A Perfect Day` | `Seoul` | `Nashville` |
| `{{HEADER_H1_SUFFIX}}` | Rest of the h1 after the italic part. | `in Nashville by Holston House` | `Food Guide` | `Guide` |

### Brand / byline

| Placeholder | Purpose | Hotel example | Blogger example | Ludara example |
|---|---|---|---|---|
| `{{BRAND_LABEL}}` | Text shown as the `wl-logo` in splash + header. The co-brand. | `Holston House` | `ZenKimchi` | `A Perfect Day` |
| `{{BRAND_URL}}` | Link target for the `wl-logo`. | `https://holstonhouse.com` | `https://zenkimchi.com` | `https://ludara.ai` |
| `{{BYLINE}}` | Small line under header h1. Include the leading `·` or skip it. | `· by Holston House` | `· by Joe` | `· by Ludara` |
| `{{CARD_BYLINE}}` | Attribution on every place card, under the note. | `— curated for Holston House guests` | `— Joe, ZenKimchi` | `— Ludara` |

### Splash subtitle

| Placeholder | Purpose | Hotel example | Blogger example | Ludara example |
|---|---|---|---|---|
| `{{SPLASH_SUB}}` | Descriptive paragraph on splash. Starts with "hand-picked places…" (the number is already emitted before it). | `hand-picked places curated for guests of Holston House — a landmark Nashville hotel in the Jean-Georges building.` | `hand-picked places by <strong>Joe McPherson</strong> — Korea's #1 food writer…` | `hand-picked places — Ludara's flagship Nashville demo guide.` |

### Brand color

Set all three for consistency. Pick a faint value (≈0.12 opacity) and a glow value (≈0.35 opacity) of the same RGB.

| Placeholder | Purpose | Example |
|---|---|---|
| `{{BRAND_COLOR}}` | Main brand hex. | `#c8102e` |
| `{{BRAND_COLOR_FAINT}}` | Same RGB at ~0.12 opacity. | `rgba(200,16,46,0.12)` |
| `{{BRAND_COLOR_GLOW}}` | Same RGB at ~0.35 opacity. | `rgba(200,16,46,0.35)` |
| `{{BRAND_COLOR_NAME}}` | Human-readable name (CSS comment only — no functional effect). | `Korean red` |

Common values we've used so far:
- Seoul (ZenKimchi): `#c8102e` — Korean red
- Cape Town (Drizzle & Dip): `#ff2a00` — Tennessee brick (carryover, can tune)
- Nashville (Ludara): `#ff2a00` — Tennessee brick

### Header action button (top right)

| Placeholder | Purpose | Hotel example | Blogger example | Ludara example |
|---|---|---|---|---|
| `{{HEADER_BTN_LABEL}}` | Button text. | `Hotel ↗` | `Blog ↗` | `About ↗` |
| `{{HEADER_BTN_URL}}` | Button link. | `https://holstonhouse.com` | `https://zenkimchi.com/tour-tips/...` | `https://ludara.ai/aperfectday` |

### Splash footer link (the small link under the "Explore the Map" button)

| Placeholder | Purpose | Hotel example | Blogger example | Ludara example |
|---|---|---|---|---|
| `{{FOOTER_URL}}` | Target. | `https://holstonhouse.com` | `https://zenkimchi.com` | `https://ludara.ai/aperfectday` |
| `{{FOOTER_LABEL}}` | Visible text (usually the bare domain). | `holstonhouse.com` | `zenkimchi.com` | `ludara.ai` |

### Block placeholders (HTML fragments, not single strings)

These are HTML blocks that vary by city.

#### `{{CATEGORY_PILLS}}`

Inserted between the "Saved" pill and the "Open Now" pill in the filter bar. Use the `fc(this, 'category')` pattern with a dot-color matching the category color in `map.js`'s `CC` object.

**Seoul example (5 categories, no nature/parks):**
```html
<button class="pill" onclick="fc(this,'food')"><span class="dot" style="background:#e8724a"></span>Restaurants</button>
<button class="pill" onclick="fc(this,'pub')"><span class="dot" style="background:#d4a043"></span>Chicken &amp; Bars</button>
<button class="pill" onclick="fc(this,'market')"><span class="dot" style="background:#6b9e6e"></span>Markets</button>
<button class="pill" onclick="fc(this,'cafe')"><span class="dot" style="background:#8b6bb1"></span>Cafés</button>
<button class="pill" onclick="fc(this,'landmark')"><span class="dot" style="background:#6090c8"></span>Experiences</button>
```

**Nashville/Ludara example (6 categories, includes nature):**
```html
<button class="pill" onclick="fc(this,'landmark')"><span class="dot" style="background:#ff2a00"></span>Landmarks</button>
<button class="pill" onclick="fc(this,'food')"><span class="dot" style="background:#d4902a"></span>Restaurants</button>
<button class="pill" onclick="fc(this,'cafe')"><span class="dot" style="background:#5a8f68"></span>Coffee &amp; Brunch</button>
<button class="pill" onclick="fc(this,'pub')"><span class="dot" style="background:#6b5b9a"></span>Bars &amp; Music</button>
<button class="pill" onclick="fc(this,'market')"><span class="dot" style="background:#b07040"></span>Markets</button>
<button class="pill" onclick="fc(this,'nature')"><span class="dot" style="background:#3d8a5e"></span>Parks</button>
```

#### `{{NEIGHBORHOOD_BUBBLES}}`

Inserted after the fixed "All" bubble. Each `id` must match a key in `data.js` (the `p.nbhd` field).

**Seoul example:**
```html
<div class="nbhd-bubble" id="nbhd-mapo" role="button" tabindex="0" onclick="selectNbhd('nbhd-mapo', this)">
  <div class="nbhd-ring"><div class="nbhd-ring-inner">🥩</div></div>
  <span class="nbhd-label">Mapo &amp;<br>Gongdeok</span>
</div>
<!-- repeat for each neighbourhood -->
```

**⚠️ Data format compatibility:** The empty-bubble-hider script in the template matches `p.nbhd === key` OR `p.nbhd === bubble.id`. This means **both** styles work — `data.js` using `nbhd: 'mapo'` (stripped) or `nbhd: 'nbhd-mapo'` (full) are both handled. Pick one per guide and stay consistent.

---

## Substitution workflow

For now, manual find-and-replace in a text editor works fine (22 substitutions per guide). If we do more than a few guides a month, we'll write a small Node or PowerShell script to read a YAML/JSON config and produce the final HTML.

**Order matters for one case:** fill in `{{BRAND_LABEL}}` before `{{CATEGORY_PILLS}}` if the category pill colors reference the brand (they typically don't, but watch for it).

---

## Pre-flight checklist before deploy

- [ ] No remaining `{{...}}` tokens in the file (run `grep '{{' index.html` — should be empty)
- [ ] `{{CITY_NAME}}` matches the city in `map.js` `GUIDE_CITY` and the nav button fallback
- [ ] `{{PLACE_COUNT}}` matches the actual `PLACES.length` from `data.js`
- [ ] `{{BRAND_COLOR}}` agrees across splash, header, pills, route line, numbered markers
- [ ] Neighborhood `id`s in `{{NEIGHBORHOOD_BUBBLES}}` match `data.js` `p.nbhd` values
- [ ] Open `index.html` directly in Chrome and verify map loads with correct place count
- [ ] Tap a place → Navigate on Google Maps → verify the destination city is correct
- [ ] Open browser DevTools console — should be quiet, no errors, no `DEBUG` spam
