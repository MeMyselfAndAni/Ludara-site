/**
 * fetch-images-bangkok-new-missing.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Retries the 7 failed places from fetch-images-bangkok-new.js
 * using broader, topic-level Wikimedia Commons search terms.
 *
 * Run from the bangkok guide folder:
 *   node fetch-images-bangkok-new-missing.js
 * ─────────────────────────────────────────────────────────────────────────────
 */

const fs    = require('fs');
const path  = require('path');
const https = require('https');

const IMG_DIR  = path.join(__dirname, 'images');
const MAX_WIDTH = 1200;
const MIN_WIDTH = 600;
const SLEEP_MS  = 300;

const MISSING = [
  {
    id: 35,
    label: 'Soi Rambuttri bar street',
    queries: [
      'Khao San Road Bangkok night street',
      'Bangkok backpacker street night bars',
      'Banglamphu Bangkok night street food',
    ],
  },
  {
    id: 39,
    label: 'T&K Seafood Chinatown',
    queries: [
      'Bangkok Chinatown night food stalls Yaowarat',
      'Thailand seafood grilled prawns street',
      'Bangkok outdoor seafood restaurant plastic chairs',
    ],
  },
  {
    id: 42,
    label: 'Saxophone Pub live music',
    queries: [
      'Thailand live music bar performance',
      'Bangkok music venue band stage',
      'jazz bar Asia night performance',
    ],
  },
  {
    id: 45,
    label: "Cheap Charlie's dive bar",
    queries: [
      'Bangkok street bar outdoor night Sukhumvit',
      'Thailand outdoor bar beer street',
      'Southeast Asia outdoor bar night drinking',
    ],
  },
  {
    id: 46,
    label: 'Jodd Fairs Ratchada night market',
    queries: [
      'Bangkok night market colourful illuminated stalls',
      'Thailand outdoor night market evening crowd',
      'Bangkok market neon lights food vendors',
    ],
  },
  {
    id: 51,
    label: 'J.Boroski cocktail bar',
    queries: [
      'cocktail bar dark moody interior Asia',
      'craft cocktail glass garnish bar',
      'bartender mixing cocktail Bangkok',
    ],
  },
  {
    id: 52,
    label: 'Craft Bangkok beer bar',
    queries: [
      'craft beer tap handles bar counter',
      'beer bar tap Thailand',
      'craft beer glass bar Southeast Asia',
    ],
  },
];

// ── HTTP helpers ──────────────────────────────────────────────────────────────

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

// ── Commons search ────────────────────────────────────────────────────────────

async function commonsSearch(query) {
  const url = `https://commons.wikimedia.org/w/api.php`
    + `?action=query&list=search`
    + `&srsearch=${encodeURIComponent(query)}`
    + `&srnamespace=6&srlimit=8&format=json&origin=*`;
  try {
    const res  = await get(url);
    const data = JSON.parse(res.body.toString());
    const hits = data.query && data.query.search;
    if (!hits || !hits.length) return null;
    for (const hit of hits) {
      if (!/\.(jpe?g|png|webp)$/i.test(hit.title)) continue;
      const infoUrl = `https://commons.wikimedia.org/w/api.php`
        + `?action=query&titles=${encodeURIComponent(hit.title)}`
        + `&prop=imageinfo&iiprop=url|size&iiurlwidth=${MAX_WIDTH}`
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
  } catch { return null; }
}

// ── Fetch and save ────────────────────────────────────────────────────────────

async function fetchMissing(place) {
  const filename = `place-${place.id}.jpg`;
  const filepath  = path.join(IMG_DIR, filename);

  if (fs.existsSync(filepath)) {
    console.log(`  ✓ [${place.id}] already exists — skipping`);
    return true;
  }

  let imageUrl = null;

  for (const query of place.queries) {
    process.stdout.write(`  [${place.id}] "${query}" … `);
    imageUrl = await commonsSearch(query);
    await sleep(SLEEP_MS);
    if (imageUrl) { process.stdout.write(`found\n`); break; }
    process.stdout.write(`no result\n`);
  }

  if (!imageUrl) {
    console.warn(`  ✗ [${place.id}] all queries exhausted`);
    return false;
  }

  try {
    const res = await getFollowRedirects(imageUrl);
    if (res.status !== 200) { console.warn(`  ✗ [${place.id}] HTTP ${res.status}`); return false; }
    const ct = res.headers['content-type'] || '';
    if (!ct.startsWith('image/')) { console.warn(`  ✗ [${place.id}] bad content-type: ${ct}`); return false; }
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

  console.log(`\n📸  Retrying ${MISSING.length} failed Bangkok images…\n`);

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
    console.log('⚠️  Grab these manually from Commons (any CC-licensed photo):');
    stillFailed.forEach(p => {
      console.log(`\n   place-${p.id}.jpg  →  ${p.label}`);
      console.log(`   https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(p.queries[0])}&ns6=1`);
    });
    console.log();
  }

  console.log('Next: node resize-images.js  →  then deploy.\n');
}

main();
