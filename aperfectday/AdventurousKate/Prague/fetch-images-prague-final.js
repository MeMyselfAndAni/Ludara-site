/**
 * fetch-images-prague-final.js
 * Last resort — ultra-generic queries for the 21 still-missing Prague images.
 *
 * Run from the Prague guide folder:
 *   node fetch-images-prague-final.js
 */

const fs    = require('fs');
const path  = require('path');
const https = require('https');

const IMG_DIR   = path.join(__dirname, 'images');
const MAX_WIDTH = 1200;
const MIN_WIDTH = 600;
const SLEEP_MS  = 300;

// Ultra-generic — one or two words that Commons definitely has images for
const MISSING = [
  { id:  6, label: 'Anonymous Bar',         queries: ['Prague pub cellar', 'beer cellar Czech Republic', 'Czech pub interior'] },
  { id:  8, label: 'Náplavka Market',       queries: ['Prague Vltava riverbank', 'Naplavka Prague', 'Prague river embankment Vltava'] },
  { id: 19, label: 'River Surfing',         queries: ['river surfing wave', 'surfing wave urban river', 'whitewater surfing city'] },
  { id: 20, label: 'Veltlin Wine Bar',      queries: ['wine bottle glass pour', 'wine tasting glass red', 'white wine glass table'] },
  { id: 24, label: 'Aromi Restaurant',      queries: ['pasta dish plate Italian', 'tagliatelle truffle pasta', 'fettuccine pasta plate restaurant'] },
  { id: 29, label: 'Kasárna Karlín',        queries: ['Prague courtyard summer', 'Prague Karlin neighbourhood', 'courtyard outdoor cafe summer'] },
  { id: 30, label: 'Polévkárna soup',       queries: ['borscht bowl red beet', 'borscht soup Ukrainian', 'red beet soup bowl cream'] },
  { id: 31, label: 'Eska bakery',           queries: ['sourdough bread loaf', 'artisan bread loaf bakery', 'fresh bread baked loaf'] },
  { id: 32, label: 'House of Axes',         queries: ['axe throwing target', 'throwing axe wooden target', 'axe sport activity'] },
  { id: 33, label: 'Pivo a Burger',         queries: ['Czech beer outdoor festival', 'beer festival outdoor crowd', 'outdoor beer garden festival'] },
  { id: 35, label: 'Dejvice Market',        queries: ['farmers market vegetables stall', 'outdoor market fresh produce stall', 'vegetable market stall morning'] },
  { id: 36, label: 'Spa Spa',              queries: ['sauna wooden interior', 'indoor sauna spa', 'private sauna relaxation'] },
  { id: 38, label: 'Beer Spa',             queries: ['wooden hot tub bath', 'bathtub spa relaxation wooden', 'beer brewing tub vat'] },
  { id: 39, label: 'Taro Restaurant',       queries: ['Asian cuisine plated dish', 'Vietnamese food plated elegant', 'Asian food tasting course plated'] },
  { id: 41, label: 'Čestr Butcher',         queries: ['Czech beef steak grilled', 'beef steak restaurant plate', 'grilled steak meat restaurant'] },
  { id: 42, label: 'Krystal Bistro',        queries: ['Prague cafe interior cosy', 'Central European cafe interior', 'cafe restaurant interior Prague'] },
  { id: 45, label: 'Food Tour',             queries: ['food tour Prague guide eating', 'street food Prague tourists', 'Prague street food vendor stall'] },
  { id: 46, label: 'Walking Tour',          queries: ['Prague Old Town tourists walking', 'Prague street tourists sightseeing', 'tourist group Old Town Prague'] },
  { id: 50, label: 'PRU58',                queries: ['Asian food dish creative restaurant', 'modern Asian cuisine dish plate', 'restaurant food dish creative modern'] },
  { id: 53, label: 'Coda Restaurant',       queries: ['svickova Czech beef sauce dumplings', 'Czech beef cream sauce bread dumplings', 'Czech traditional food plate'] },
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
  throw new Error(`Too many redirects`);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function commonsSearch(query) {
  const url = `https://commons.wikimedia.org/w/api.php`
    + `?action=query&list=search`
    + `&srsearch=${encodeURIComponent(query)}`
    + `&srnamespace=6&srlimit=10&format=json&origin=*`;
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
    console.warn(`  ✗ [${place.id}] exhausted — manual grab needed`);
    return false;
  }

  try {
    const res = await getFollowRedirects(imageUrl);
    if (res.status !== 200) { console.warn(`  ✗ [${place.id}] HTTP ${res.status}`); return false; }
    const ct = res.headers['content-type'] || '';
    if (!ct.startsWith('image/')) { console.warn(`  ✗ [${place.id}] bad content-type`); return false; }
    fs.writeFileSync(filepath, res.body);
    console.log(`  ✓ [${place.id}] saved → ${filename}  (${(res.body.length / 1024).toFixed(0)} KB)`);
    return true;
  } catch (err) {
    console.error(`  ✗ [${place.id}] error: ${err.message}`);
    return false;
  }
}

async function main() {
  if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });
  console.log(`\n📸  Final retry for ${MISSING.length} missing Prague images…\n`);

  let ok = 0; const stillFailed = [];

  for (const place of MISSING) {
    console.log(`\n[${place.id}] ${place.label}`);
    const success = await fetchMissing(place);
    if (success) { ok++; } else { stillFailed.push(place); }
    await sleep(SLEEP_MS);
  }

  console.log('\n' + '─'.repeat(60));
  console.log(`✅  Done!  ${ok} saved,  ${stillFailed.length} still need manual grab.\n`);

  if (stillFailed.length) {
    console.log('⚠️  Grab these manually — open each URL, pick any photo, save as place-N.jpg:\n');
    stillFailed.forEach(p => {
      const url = `https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(p.queries[0])}&ns6=1`;
      console.log(`   place-${p.id}.jpg  →  ${p.label}`);
      console.log(`   ${url}\n`);
    });
  }

  console.log('Next: node resize-images.js  →  then deploy-kate-prague.bat\n');
}

main();
