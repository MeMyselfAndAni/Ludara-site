/**
 * fetch-images-bangkok-missing.js
 * ────────────────────────────────────────────────────────────────────────────
 * Re-fetches only the 7 places that failed in fetch-images-bangkok.js
 * because they are small private businesses with no Commons/Wikipedia entry.
 *
 * Uses broader, topic-level Wikimedia Commons search terms instead —
 * e.g. "Thai street food wok" rather than the restaurant's own name.
 *
 * Run from the same folder as fetch-images-bangkok.js:
 *   node fetch-images-bangkok-missing.js
 * ────────────────────────────────────────────────────────────────────────────
 */

const fs    = require('fs');
const path  = require('path');
const https = require('https');

const IMG_DIR   = path.join(__dirname, 'images');
const MAX_WIDTH = 1200;
const MIN_WIDTH = 600;
const SLEEP_MS  = 300;

// ── Replacement search terms ──────────────────────────────────────────────────
// Each entry has multiple fallback queries tried in order until one yields
// a usable image. Chosen to be visually representative of the place type.

const MISSING = [
  {
    id: 11,
    label: 'Jay Fai (Michelin street food)',
    queries: [
      'Thai street food wok cooking Bangkok',
      'street food vendor Bangkok charcoal',
      'Thai omelette street food',
    ],
  },
  {
    id: 15,
    label: 'Soi Nana Chinatown bar street',
    queries: [
      'Bangkok bar street night neon',
      'Chinatown Bangkok night alley lanterns',
      'Bangkok nightlife street',
    ],
  },
  {
    id: 21,
    label: 'Silom Thai Cooking School',
    queries: [
      'Thai cooking class ingredients',
      'Thai cuisine cooking preparation',
      'pad thai cooking Bangkok',
    ],
  },
  {
    id: 24,
    label: 'Rot Fai Train Night Market',
    queries: [
      'Bangkok night market stalls',
      'Thailand night market vintage',
      'outdoor market Bangkok evening',
    ],
  },
  {
    id: 27,
    label: 'Calypso Cabaret show',
    queries: [
      'Thai traditional dance costume performance',
      'Thai classical dance elaborate costume',
      'Thai performer traditional costume',
    ],
  },
  {
    id: 30,
    label: 'Rabbit Hole cocktail bar',
    queries: [
      'cocktail bar interior Bangkok',
      'craft cocktail drink Bangkok',
      'mixology cocktail glass bar',
    ],
  },
  {
    id: 31,
    label: 'Beer Belly craft beer bar',
    queries: [
      'craft beer bar Thailand',
      'beer tap bar Bangkok',
      'craft beer glasses bar',
    ],
  },
];

// ── HTTP helper (identical to main script) ────────────────────────────────────

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'User-Agent': 'APerfectDayGuide/1.0 (ludara.ai; contact@ludara.ai) node-https' }
    }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end',  () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function getFollowRedirects(url, max = 5) {
  let current = url;
  for (let i = 0; i < max; i++) {
    const res = await get(current);
    if ((res.status === 301 || res.status === 302 || res.status === 307) && res.headers.location) {
      current = res.headers.location;
      continue;
    }
    return res;
  }
  throw new Error(`Too many redirects for ${url}`);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Wikimedia Commons search ──────────────────────────────────────────────────

async function commonsSearch(query) {
  const encoded = encodeURIComponent(query);
  const searchUrl = `https://commons.wikimedia.org/w/api.php`
    + `?action=query&list=search`
    + `&srsearch=${encoded}`
    + `&srnamespace=6`
    + `&srlimit=8`
    + `&format=json&origin=*`;

  try {
    const res  = await get(searchUrl);
    const data = JSON.parse(res.body.toString());
    const hits = data.query && data.query.search;
    if (!hits || !hits.length) return null;

    for (const hit of hits) {
      const title = hit.title;
      if (!/\.(jpe?g|png|webp)$/i.test(title)) continue;

      const infoUrl = `https://commons.wikimedia.org/w/api.php`
        + `?action=query&titles=${encodeURIComponent(title)}`
        + `&prop=imageinfo&iiprop=url|size`
        + `&iiurlwidth=${MAX_WIDTH}`
        + `&format=json&origin=*`;

      const infoRes  = await get(infoUrl);
      const infoData = JSON.parse(infoRes.body.toString());
      const page     = Object.values(infoData.query.pages)[0];
      const info     = page && page.imageinfo && page.imageinfo[0];
      if (!info) continue;

      const imgUrl = info.thumburl || info.url;
      const width  = info.thumbwidth || info.width || 0;
      if (imgUrl && width >= MIN_WIDTH) return imgUrl;
    }
    return null;
  } catch {
    return null;
  }
}

// ── Fetch and save one place ──────────────────────────────────────────────────

async function fetchMissing(place) {
  const filename = `place-${place.id}.jpg`;
  const filepath  = path.join(IMG_DIR, filename);

  if (fs.existsSync(filepath)) {
    console.log(`  ✓ [${place.id}] already exists — skipping`);
    return true;
  }

  let imageUrl = null;

  for (const query of place.queries) {
    process.stdout.write(`  [${place.id}] Trying "${query}" … `);
    imageUrl = await commonsSearch(query);
    await sleep(SLEEP_MS);
    if (imageUrl) { process.stdout.write(`found\n`); break; }
    process.stdout.write(`no result\n`);
  }

  if (!imageUrl) {
    console.warn(`  ✗ [${place.id}] all queries exhausted — manual replacement needed`);
    return false;
  }

  try {
    const res = await getFollowRedirects(imageUrl);
    if (res.status !== 200) {
      console.warn(`  ✗ [${place.id}] download failed — HTTP ${res.status}`);
      return false;
    }
    const ct = res.headers['content-type'] || '';
    if (!ct.startsWith('image/')) {
      console.warn(`  ✗ [${place.id}] unexpected content-type: ${ct}`);
      return false;
    }
    fs.writeFileSync(filepath, res.body);
    console.log(`  ✓ [${place.id}] saved → ${filename}  (${(res.body.length / 1024).toFixed(0)} KB)`);
    return true;
  } catch (err) {
    console.error(`  ✗ [${place.id}] error: ${err.message}`);
    return false;
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });

  console.log(`\n📸  Re-fetching ${MISSING.length} missing Bangkok images from Wikimedia…\n`);

  let ok = 0, fail = 0;
  const stillFailed = [];

  for (const place of MISSING) {
    console.log(`\n[${place.id}] ${place.label}`);
    const success = await fetchMissing(place);
    if (success) { ok++; } else { fail++; stillFailed.push(place); }
    await sleep(SLEEP_MS);
  }

  console.log('\n' + '─'.repeat(60));
  console.log(`✅  Done!  ${ok} saved,  ${fail} still failed.\n`);

  if (stillFailed.length) {
    console.log('⚠️  Still missing — grab any CC-licensed photo from these links:');
    stillFailed.forEach(p => {
      const q = encodeURIComponent(p.queries[0]);
      console.log(`\n   place-${p.id}.jpg  →  ${p.label}`);
      console.log(`   https://commons.wikimedia.org/w/index.php?search=${q}&ns6=1`);
    });
    console.log();
  }
}

main();
