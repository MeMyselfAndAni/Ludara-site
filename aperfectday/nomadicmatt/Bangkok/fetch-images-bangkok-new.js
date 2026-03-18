/**
 * fetch-images-bangkok-new.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Fetches images for the 20 new Bangkok places (id 34–53) from Wikimedia.
 * Skips any place-N.jpg that already exists in ./images/
 *
 * Run from the bangkok guide folder:
 *   node fetch-images-bangkok-new.js
 * ─────────────────────────────────────────────────────────────────────────────
 */

const fs    = require('fs');
const path  = require('path');
const https = require('https');

const IMG_DIR   = path.join(__dirname, 'images');
const MAX_WIDTH = 1200;
const MIN_WIDTH = 600;
const SLEEP_MS  = 300;

const PLACES = [
  // Old City additions
  { id: 34, label: 'Pad Thai Thip Samai',          wikiTitle: 'Thip Samai',                        queries: ['pad thai Bangkok street food', 'Thai noodles wok street stall'] },
  { id: 35, label: 'Soi Rambuttri',                wikiTitle: null,                                queries: ['Soi Rambuttri Bangkok bars', 'Bangkok bar street night Banglamphu'] },
  { id: 36, label: 'Brick Bar live music',         wikiTitle: null,                                queries: ['Bangkok live music bar night', 'Thailand live music pub'] },
  { id: 37, label: 'Wat Mahathat',                 wikiTitle: 'Wat Mahathat, Bangkok',             queries: ['Wat Mahathat Bangkok temple', 'Buddhist temple Bangkok Old City'] },
  { id: 38, label: 'Wat Ratchanatdaram Loha Prasat', wikiTitle: 'Loha Prasat',                     queries: ['Loha Prasat metal temple Bangkok', 'Wat Ratchanatdaram Bangkok'] },

  // Chinatown addition
  { id: 39, label: 'T&K Seafood Soi Texas',        wikiTitle: null,                                queries: ['Chinatown Bangkok seafood street food night', 'Bangkok street food seafood grilled prawns'] },

  // Silom & Siam additions
  { id: 40, label: 'Central World',                wikiTitle: 'CentralWorld',                      queries: ['CentralWorld Bangkok mall', 'Bangkok shopping mall exterior'] },
  { id: 41, label: 'Platinum Fashion Mall',        wikiTitle: 'Platinum Fashion Mall',             queries: ['Platinum Fashion Mall Bangkok Pratunam', 'Bangkok fashion market Pratunam'] },
  { id: 42, label: 'Saxophone Pub',                wikiTitle: null,                                queries: ['Bangkok jazz bar live music', 'Thailand jazz pub saxophone'] },
  { id: 43, label: 'Victory Monument street food', wikiTitle: 'Victory Monument (Bangkok)',        queries: ['Victory Monument Bangkok', 'Bangkok boat noodles street food stall'] },

  // Sukhumvit additions
  { id: 44, label: 'Sukhumvit Soi 38 street food', wikiTitle: null,                               queries: ['Bangkok night street food stalls Sukhumvit', 'Thai street food night market stalls'] },
  { id: 45, label: "Cheap Charlie's bar",          wikiTitle: null,                                queries: ['Bangkok expat bar Sukhumvit', 'Bangkok outdoor bar night street'] },
  { id: 46, label: 'Jodd Fairs Ratchada',          wikiTitle: null,                                queries: ['Bangkok night market neon lights stalls', 'Thailand night market colourful vendors'] },
  { id: 47, label: 'Bangkok Butterfly Garden',     wikiTitle: 'Butterfly Garden and Insectarium, Bangkok', queries: ['Bangkok Butterfly Garden Chatuchak', 'butterfly garden tropical dome'] },

  // Riverside additions
  { id: 48, label: 'Bangkokian Museum',            wikiTitle: 'Bangkokian Museum',                 queries: ['Bangkokian Museum Bangkok wooden house', 'traditional Thai wooden house Bangkok'] },
  { id: 49, label: 'Joe Louis Puppet Theatre',     wikiTitle: 'Joe Louis Theater',                 queries: ['Thai traditional puppet hun lakhon lek', 'Thai marionette puppet performance'] },
  { id: 50, label: 'Mahanakhon SkyWalk',           wikiTitle: 'King Power Mahanakhon',             queries: ['Mahanakhon Bangkok skyscraper', 'King Power Mahanakhon SkyWalk Bangkok'] },

  // Thong Lo additions
  { id: 51, label: 'J.Boroski cocktail bar',       wikiTitle: null,                                queries: ['Bangkok craft cocktail bar interior', 'Bangkok speakeasy cocktail dark bar'] },
  { id: 52, label: 'Craft Bangkok beer bar',       wikiTitle: null,                                queries: ['craft beer bar Bangkok tap handles', 'Thailand craft beer bar'] },
  { id: 53, label: 'Khlong Toei Market',           wikiTitle: 'Khlong Toei Market',                queries: ['Khlong Toei Market Bangkok produce', 'Bangkok wet market fresh vegetables morning'] },
];

// ── HTTP helpers (same as main script) ────────────────────────────────────────

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

// ── Wikimedia helpers ─────────────────────────────────────────────────────────

async function wikiArticleImage(title) {
  const url = `https://en.wikipedia.org/w/api.php`
    + `?action=query&titles=${encodeURIComponent(title)}`
    + `&prop=pageimages&pithumbsize=${MAX_WIDTH}`
    + `&format=json&origin=*`;
  try {
    const res  = await get(url);
    const data = JSON.parse(res.body.toString());
    const page = Object.values(data.query.pages)[0];
    if (!page || page.missing !== undefined) return null;
    const thumbUrl = page.thumbnail && page.thumbnail.source;
    if (!thumbUrl) return null;
    return thumbUrl.replace(/\/thumb\//, '/').replace(/\/\d+px-[^/]+$/, '');
  } catch { return null; }
}

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

async function fetchPhoto(place) {
  const filename = `place-${place.id}.jpg`;
  const filepath  = path.join(IMG_DIR, filename);

  if (fs.existsSync(filepath)) {
    console.log(`  ✓ [${place.id}] already exists — skipping`);
    return true;
  }

  let imageUrl = null;

  // Strategy 1: Wikipedia article
  if (place.wikiTitle) {
    process.stdout.write(`  [${place.id}] Wikipedia "${place.wikiTitle}" … `);
    imageUrl = await wikiArticleImage(place.wikiTitle);
    process.stdout.write(imageUrl ? `found\n` : `no image\n`);
    await sleep(SLEEP_MS);
  }

  // Strategy 2: Commons search on wikiTitle
  if (!imageUrl && place.wikiTitle) {
    process.stdout.write(`  [${place.id}] Commons "${place.wikiTitle}" … `);
    imageUrl = await commonsSearch(place.wikiTitle);
    process.stdout.write(imageUrl ? `found\n` : `no image\n`);
    await sleep(SLEEP_MS);
  }

  // Strategy 3+: Fallback queries
  for (const query of place.queries) {
    if (imageUrl) break;
    process.stdout.write(`  [${place.id}] Commons "${query}" … `);
    imageUrl = await commonsSearch(query);
    process.stdout.write(imageUrl ? `found\n` : `no image\n`);
    await sleep(SLEEP_MS);
  }

  if (!imageUrl) {
    console.warn(`  ✗ [${place.id}] "${place.label}" — no image found`);
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

  console.log(`\n📸  Fetching images for ${PLACES.length} new Bangkok places (id 34–53)…\n`);

  let ok = 0, fail = 0;
  const failed = [];

  for (let i = 0; i < PLACES.length; i++) {
    const p = PLACES[i];
    console.log(`\n[${i + 1}/${PLACES.length}] ${p.label}`);
    const success = await fetchPhoto(p);
    if (success) { ok++; } else { fail++; failed.push(p); }
    await sleep(SLEEP_MS);
  }

  console.log('\n' + '─'.repeat(60));
  console.log(`✅  Done!  ${ok} saved,  ${fail} failed.\n`);

  if (failed.length) {
    console.log('⚠️  Still missing — grab any CC-licensed photo from Commons:');
    failed.forEach(p => {
      console.log(`\n   place-${p.id}.jpg  →  ${p.label}`);
      console.log(`   https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(p.queries[0])}&ns6=1`);
    });
    console.log();
  }

  console.log('Next: run resize-images.js to resize any large new images, then deploy.\n');
}

main();
