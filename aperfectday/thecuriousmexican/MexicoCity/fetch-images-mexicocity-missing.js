/**
 * fetch-images-mexicocity-missing.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Re-fetches the 20 failed places using broader, topic-level search terms
 * that are likely to have images on Wikimedia Commons.
 *
 * Run from the guide folder (same place as data.js):
 *   node fetch-images-mexicocity-missing.js
 *
 * After this, run resize:
 *   node ../../../general/_scripts/resize-images.js .
 * ─────────────────────────────────────────────────────────────────────────────
 */

const fs    = require('fs');
const path  = require('path');
const https = require('https');

const IMG_DIR   = path.join(__dirname, 'images');
const MIN_WIDTH = 600;
const MAX_WIDTH = 1200;
const SLEEP_MS  = 350;

// Broader generic searches likely to match Wikimedia Commons files
const PLACES = [
  { id:  5, search: 'mezcal agave spirit drinks Mexico',         wikiTitle: 'Mezcal' },
  { id:  8, search: 'cantina bar Mexico City historic',          wikiTitle: null },
  { id:  9, search: 'cocktail bar night Mexico City drinks',     wikiTitle: null },
  { id: 10, search: 'ceviche tostadas seafood Mexico',           wikiTitle: 'Tostada (food)' },
  { id: 13, search: 'mezcal bottles collection bar Mexico',      wikiTitle: null },
  { id: 15, search: 'nigiri sushi omakase bar Japanese',         wikiTitle: 'Omakase' },
  { id: 16, search: 'ramen noodle soup bowl Japanese',           wikiTitle: 'Ramen' },
  { id: 17, search: 'dumplings dim sum Chinese food Mexico',     wikiTitle: 'Dumpling' },
  { id: 18, search: 'natural wine glasses bottles restaurant',   wikiTitle: 'Natural wine' },
  { id: 21, search: 'Mexico City skyline rooftop view night',    wikiTitle: 'Mexico City' },
  { id: 22, search: 'fine dining tasting menu elegant plating',  wikiTitle: null },
  { id: 23, search: 'brunch breakfast eggs Mexico restaurant',   wikiTitle: null },
  { id: 28, search: 'mole sauce Mexican cuisine food',           wikiTitle: 'Mole (sauce)' },
  { id: 33, search: 'café de olla clay pot Mexican coffee',      wikiTitle: 'Café de olla' },
  { id: 35, search: 'speakeasy underground bar cocktails',       wikiTitle: 'Speakeasy' },
  { id: 36, search: 'tacos al pastor Mexico City street food',   wikiTitle: 'Taco' },
  { id: 37, search: 'tostada ceviche shrimp seafood Mexico',     wikiTitle: 'Tostada (food)' },
  { id: 38, search: 'mixiote lamb barbacoa Mexican street food', wikiTitle: 'Mixiote' },
  { id: 39, search: 'wine shop bottles natural wine store',      wikiTitle: 'Wine bar' },
  { id: 40, search: 'mezcal cocktail smoky drink Mexico City',   wikiTitle: 'Cocktail' },
];

// ── HTTP helpers ──────────────────────────────────────────────────────────────
function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'APerfectDayGuide/1.0 (ludara.ai; contact@ludara.ai) node-https' }
    }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end',  () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
      res.on('error', reject);
    });
    req.on('error', reject);
  });
}

async function getFollowRedirects(url, max = 5) {
  let cur = url;
  for (let i = 0; i < max; i++) {
    const res = await get(cur);
    if ((res.status === 301 || res.status === 302 || res.status === 307) && res.headers.location) {
      cur = res.headers.location; continue;
    }
    return res;
  }
  throw new Error(`Too many redirects for ${url}`);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function wikiArticleImage(title) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&pithumbsize=${MAX_WIDTH}&format=json&origin=*`;
  try {
    const res  = await get(url);
    const data = JSON.parse(res.body.toString());
    const pages = data.query && data.query.pages;
    if (!pages) return null;
    const page = Object.values(pages)[0];
    if (!page || page.missing !== undefined) return null;
    const thumbUrl = page.thumbnail && page.thumbnail.source;
    if (!thumbUrl) return null;
    return thumbUrl.replace(/\/thumb\//, '/').replace(/\/\d+px-[^/]+$/, '');
  } catch { return null; }
}

async function commonsSearch(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=5&format=json&origin=*`;
  try {
    const res  = await get(url);
    const data = JSON.parse(res.body.toString());
    const hits = data.query && data.query.search;
    if (!hits || !hits.length) return null;
    for (const hit of hits) {
      const title = hit.title;
      if (!/\.(jpe?g|png|webp)$/i.test(title)) continue;
      const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|size&iiurlwidth=${MAX_WIDTH}&format=json&origin=*`;
      const infoRes  = await get(infoUrl);
      const infoData = JSON.parse(infoRes.body.toString());
      const infoPages = infoData.query && infoData.query.pages;
      if (!infoPages) continue;
      const infoPage  = Object.values(infoPages)[0];
      const imageinfo = infoPage && infoPage.imageinfo && infoPage.imageinfo[0];
      if (!imageinfo) continue;
      const imgUrl = imageinfo.thumburl || imageinfo.url;
      const width  = imageinfo.thumbwidth || imageinfo.width || 0;
      if (imgUrl && width >= MIN_WIDTH) return imgUrl;
    }
    return null;
  } catch { return null; }
}

async function fetchPhoto(place) {
  const { id, search, wikiTitle } = place;
  const filepath = path.join(IMG_DIR, `place-${id}.jpg`);

  if (fs.existsSync(filepath)) {
    console.log(`  ✓ [${id}] already exists — skipping`);
    return true;
  }

  let imageUrl = null;

  if (wikiTitle) {
    process.stdout.write(`  [${id}] Wikipedia "${wikiTitle}" … `);
    imageUrl = await wikiArticleImage(wikiTitle);
    process.stdout.write(imageUrl ? 'found\n' : 'no image\n');
    await sleep(SLEEP_MS);
  }

  if (!imageUrl) {
    process.stdout.write(`  [${id}] Commons "${search}" … `);
    imageUrl = await commonsSearch(search);
    process.stdout.write(imageUrl ? 'found\n' : 'no image\n');
    await sleep(SLEEP_MS);
  }

  if (!imageUrl) {
    console.warn(`  ✗ [${id}] still no image — needs manual replacement`);
    return false;
  }

  try {
    const res = await getFollowRedirects(imageUrl);
    if (res.status !== 200) { console.warn(`  ✗ [${id}] HTTP ${res.status}`); return false; }
    const ct = res.headers['content-type'] || '';
    if (!ct.startsWith('image/')) { console.warn(`  ✗ [${id}] bad content-type: ${ct}`); return false; }
    fs.writeFileSync(filepath, res.body);
    console.log(`  ✓ [${id}] saved → place-${id}.jpg  (${(res.body.length / 1024).toFixed(0)} KB)`);
    return true;
  } catch (err) {
    console.error(`  ✗ [${id}] download error: ${err.message}`);
    return false;
  }
}

async function main() {
  if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });
  console.log(`\n📸  Fetching ${PLACES.length} missing Mexico City images with broader terms…\n`);

  let ok = 0, fail = 0;
  const failed = [];

  for (let i = 0; i < PLACES.length; i++) {
    const p = PLACES[i];
    console.log(`\n[${i + 1}/${PLACES.length}] place-${p.id} — ${p.search}`);
    const success = await fetchPhoto(p);
    if (success) { ok++; } else { fail++; failed.push(p); }
    await sleep(SLEEP_MS);
  }

  console.log('\n' + '─'.repeat(60));
  console.log(`✅  Done!  ${ok} saved,  ${fail} still missing.\n`);

  if (failed.length) {
    console.log('⚠️  Still missing — grab any CC-licensed photo from Unsplash or Wikimedia:');
    failed.forEach(p => console.log(`   place-${p.id}.jpg  (${p.search})`));
    console.log();
  }

  console.log('Next: node ../../../general/_scripts/resize-images.js .');
}

main();
