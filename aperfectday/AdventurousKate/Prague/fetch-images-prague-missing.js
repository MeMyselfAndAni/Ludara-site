/**
 * fetch-images-prague-missing.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Retries the 26 failed places from fetch-images-prague.js
 * using broader, topic-level Wikimedia Commons search terms.
 *
 * Run from:
 *   C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site\aperfectday\AdventurousKate\Prague\
 *
 * Usage:
 *   node fetch-images-prague-missing.js
 * ─────────────────────────────────────────────────────────────────────────────
 */

const fs    = require('fs');
const path  = require('path');
const https = require('https');

const IMG_DIR   = path.join(__dirname, 'images');
const MAX_WIDTH = 1200;
const MIN_WIDTH = 600;
const SLEEP_MS  = 300;

const MISSING = [
  { id:  6, label: 'Anonymous Bar cocktail cellar',   queries: ['Prague bar night interior', 'Czech Republic bar drinking night', 'Prague nightlife bar interior'] },
  { id:  7, label: 'Manifesto Market food trucks',    queries: ['food truck market outdoor Prague', 'outdoor food market stalls Prague summer', 'street food festival Czech Republic'] },
  { id:  8, label: 'Náplavka Farmers Market',         queries: ['Naplavka Prague riverside embankment', 'Prague Vltava river embankment walk', 'Prague riverside market stalls'] },
  { id: 19, label: 'Vltava River Surfing',            queries: ['river surfing artificial wave city', 'urban river wave surfing', 'Prague Vltava river sports water'] },
  { id: 20, label: 'Veltlin Wine Bar',                queries: ['wine bar interior Central Europe', 'wine glasses bar Prague evening', 'Czech wine bar bottles glasses'] },
  { id: 23, label: 'El Camino Tapas',                 queries: ['Spanish tapas small plates restaurant', 'tapas dishes restaurant table food', 'restaurant food small plates dining'] },
  { id: 24, label: 'Aromi Italian restaurant',        queries: ['Italian restaurant fine dining pasta', 'Italian pasta truffle restaurant elegant', 'pasta dish fine dining restaurant'] },
  { id: 25, label: 'Ngô Vietnamese pho',              queries: ['pho Vietnamese noodle soup bowl', 'Vietnamese pho beef noodles bowl', 'pho soup bowl noodles herbs'] },
  { id: 26, label: 'QQ Asian Kitchen',                queries: ['Asian fusion cuisine dish creative', 'soft shell crab taco Asian fusion', 'Asian fusion restaurant food dish'] },
  { id: 29, label: 'Kasárna Karlín courtyard',        queries: ['Prague outdoor courtyard bar summer', 'Prague creative outdoor space bar', 'courtyard cultural space Prague art'] },
  { id: 30, label: 'Polévkárna soup restaurant',      queries: ['borscht soup bowl red Eastern European', 'Czech soup lunch restaurant', 'bowl of borscht sour cream Eastern Europe'] },
  { id: 31, label: 'Eska bakery restaurant',          queries: ['sourdough bread bakery artisan loaf', 'artisan bread bakery Czech Republic', 'Prague modern restaurant bread fermentation'] },
  { id: 32, label: 'House of Axes axe throwing',      queries: ['axe throwing activity venue', 'axe throwing target wooden', 'axe throwing entertainment activity group'] },
  { id: 33, label: 'Pivo a Burger festival',          queries: ['Prague outdoor food festival summer', 'Czech beer festival outdoor summer', 'burger festival outdoor Czech Republic beer'] },
  { id: 35, label: 'Dejvice Farmers Market',          queries: ['Prague outdoor market vegetables fruit', 'Czech farmers market fresh produce', 'European farmers market stalls morning'] },
  { id: 36, label: 'Spa Spa private wellness',        queries: ['private spa sauna jacuzzi interior', 'wellness spa sauna private room', 'spa relaxation sauna jacuzzi interior'] },
  { id: 38, label: 'Beer Spa bath',                   queries: ['beer spa bath tub brewery', 'beer bath relaxation spa wellness', 'Czech beer bath spa experience'] },
  { id: 39, label: 'Taro Asian tasting menu',         queries: ['Asian tasting menu restaurant open kitchen', 'tasting menu courses restaurant elegant', 'Asian fusion tasting menu plated food'] },
  { id: 40, label: 'The Italians food market',        queries: ['Italian deli food market interior', 'Italian wine food shop market cheese', 'Italian restaurant pizza family dining'] },
  { id: 41, label: 'Čestr Czech butcher',             queries: ['Czech restaurant grill meat interior', 'butcher restaurant beef steak Prague', 'Czech grill restaurant interior dining'] },
  { id: 42, label: 'Krystal Bistro Art Deco',         queries: ['Art Deco cafe restaurant interior Prague', 'Prague cafe breakfast Art Nouveau interior', 'Czech bistro restaurant interior elegant'] },
  { id: 45, label: 'Prague Food Tour',                queries: ['Prague street food tour group', 'Czech food tasting tour guide', 'food tour group tasting Prague old town'] },
  { id: 46, label: 'Prague Castle Walking Tour',      queries: ['Prague tourist walking tour group guide', 'Prague historic walking tour Old Town', 'tourists walking Prague guide group'] },
  { id: 49, label: 'Yamato Japanese sushi',           queries: ['Japanese sushi restaurant elegant interior', 'sushi omakase plated nigiri', 'sushi restaurant Prague Japan'] },
  { id: 50, label: 'PRU58 Asian restaurant Karlín',   queries: ['modern Asian restaurant Prague interior', 'Prague restaurant Karlin industrial interior', 'Asian restaurant modern industrial Prague'] },
  { id: 53, label: 'Coda modern Czech restaurant',   queries: ['modern Czech restaurant svickova beef', 'Czech restaurant beef cream sauce dumplings', 'Prague modern restaurant elegant Czech cuisine'] },
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

  console.log(`\n📸  Retrying ${MISSING.length} failed Prague images…\n`);

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
    console.log('⚠️  Still missing — grab manually from Commons:');
    stillFailed.forEach(p => {
      console.log(`\n   place-${p.id}.jpg  →  ${p.label}`);
      console.log(`   https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(p.queries[0])}&ns6=1`);
    });
    console.log();
  }

  console.log('Next: node resize-images.js  →  then deploy-kate-prague.bat\n');
}

main();
