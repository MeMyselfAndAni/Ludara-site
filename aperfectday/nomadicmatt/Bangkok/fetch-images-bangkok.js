/**
 * fetch-images-bangkok.js
 * ────────────────────────────────────────────────────────────────────────────
 * Fetches one high-quality photo per place for the Nomadic Matt / Bangkok
 * guide (33 places) from Wikimedia Commons / Wikipedia — no API key needed.
 *
 * Strategy per place (tries each in order until a usable image is found):
 *   1. Wikipedia article thumbnail  (usually the best, most iconic shot)
 *   2. Wikimedia Commons image search  (fallback if no WP article match)
 *
 * Output:
 *   images/place-1.jpg  →  images/place-33.jpg
 *
 * Drop the resulting images/ folder into:
 *   aperfectday/nomadicmatt/bangkok/images/
 *
 * Prerequisites (Node 18+ has fetch built-in — no extra packages needed):
 *   node fetch-images-bangkok.js
 *
 * If you're on Node < 18:
 *   npm install node-fetch
 *   then replace the `get()` calls with node-fetch equivalents.
 * ────────────────────────────────────────────────────────────────────────────
 */

const fs   = require('fs');
const path = require('path');
const https = require('https');

const IMG_DIR    = path.join(__dirname, 'images');
const MIN_WIDTH  = 600;   // skip images narrower than this (px)
const MAX_WIDTH  = 1200;  // request images no wider than this from Wikimedia
const SLEEP_MS   = 300;   // ms between API calls — be polite to Wikimedia

// ── Place list ────────────────────────────────────────────────────────────────
// id + search term (matches data.js exactly) + optional Wikipedia article title
// wikiTitle overrides the search when Wikipedia's article name differs from
// the Google Maps search string we built for the map.

const PLACES = [
  // Old City
  { id:  1, search: 'Grand Palace Bangkok',                  wikiTitle: 'Grand Palace' },
  { id:  2, search: 'Wat Pho Reclining Buddha Bangkok',      wikiTitle: 'Wat Pho' },
  { id:  3, search: 'Wat Arun Temple of the Dawn Bangkok',   wikiTitle: 'Wat Arun' },
  { id:  4, search: 'Museum of Siam Bangkok',                wikiTitle: 'Museum of Siam' },
  { id:  5, search: 'National Museum Bangkok Thailand',      wikiTitle: 'Bangkok National Museum' },
  { id:  6, search: 'Wat Suthat Giant Swing Bangkok',        wikiTitle: 'Wat Suthat' },
  { id:  7, search: 'Wat Saket Golden Mount Bangkok',        wikiTitle: 'Wat Saket' },
  { id:  8, search: 'Khao San Road Bangkok backpacker',      wikiTitle: 'Khao San Road' },
  { id:  9, search: 'Rajadamnoen Stadium Muay Thai Bangkok', wikiTitle: 'Rajadamnoen Stadium' },
  { id: 10, search: 'Wat Benchamabophit Marble Temple Bangkok', wikiTitle: 'Wat Benchamabophit' },
  { id: 11, search: 'Jay Fai restaurant Michelin Bangkok',   wikiTitle: null },

  // Chinatown
  { id: 12, search: 'Yaowarat Chinatown food Bangkok',       wikiTitle: 'Yaowarat Road' },
  { id: 13, search: 'Pak Klong Talad flower market Bangkok', wikiTitle: 'Pak Khlong Talat' },
  { id: 14, search: 'Wat Traimit Golden Buddha Chinatown Bangkok', wikiTitle: 'Wat Traimit' },
  { id: 15, search: 'Soi Nana Chinatown bars Bangkok cocktails', wikiTitle: null },
  { id: 16, search: 'Taling Chan floating market Bangkok weekend', wikiTitle: 'Taling Chan Floating Market' },

  // Silom & Siam
  { id: 17, search: 'Lumpini Park Bangkok green space',      wikiTitle: 'Lumphini Park' },
  { id: 18, search: 'Jim Thompson House Bangkok museum',     wikiTitle: 'Jim Thompson House' },
  { id: 19, search: 'Bangkok Art Culture Center BACC Siam',  wikiTitle: 'Bangkok Art and Culture Centre' },
  { id: 20, search: 'MBK Center Bangkok shopping mall',      wikiTitle: 'MBK Center' },
  { id: 21, search: 'Silom Thai Cooking School Bangkok class', wikiTitle: null },

  // Sukhumvit
  { id: 22, search: 'Terminal 21 Bangkok airport themed mall', wikiTitle: 'Terminal 21 (Bangkok)' },
  { id: 23, search: 'Chatuchak Weekend Market Bangkok JJ Market', wikiTitle: 'Chatuchak Weekend Market' },
  { id: 24, search: 'Rot Fai Train Night Market Bangkok vintage', wikiTitle: null },

  // Riverside
  { id: 25, search: 'Chao Phraya River express boat Bangkok', wikiTitle: 'Chao Phraya River' },
  { id: 26, search: 'ICONSIAM Bangkok riverside luxury mall', wikiTitle: 'ICONSIAM' },
  { id: 27, search: 'Calypso Cabaret Bangkok ladyboy show Asiatique', wikiTitle: null },
  { id: 28, search: 'Asiatique Riverfront Bangkok night market', wikiTitle: 'Asiatique the Riverfront' },

  // Thong Lo
  { id: 29, search: 'Thong Lo Bangkok nightlife dining district', wikiTitle: 'Thong Lo' },
  { id: 30, search: 'Rabbit Hole cocktail bar Thong Lo Bangkok', wikiTitle: null },
  { id: 31, search: 'Beer Belly craft beer bar Thong Lo Bangkok', wikiTitle: null },
  { id: 32, search: 'Ekkamai street food Bangkok night market', wikiTitle: 'Ekkamai' },
  { id: 33, search: 'Siam Paragon Bangkok luxury mall food hall', wikiTitle: 'Siam Paragon' },
];

// ── HTTP helper ───────────────────────────────────────────────────────────────

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        // Wikimedia requires a real User-Agent — identify ourselves politely
        'User-Agent': 'APerfectDayGuide/1.0 (ludara.ai; contact@ludara.ai) node-https',
      }
    }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end',  () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
      res.on('error', reject);
    });
    req.on('error', reject);
  });
}

// Follow up to 5 redirects (Wikimedia CDN redirects heavily)
async function getFollowRedirects(url, maxRedirects = 5) {
  let current = url;
  for (let i = 0; i < maxRedirects; i++) {
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

/**
 * Try to get the main thumbnail image for a Wikipedia article.
 * Returns the full-size image URL or null.
 */
async function wikiArticleImage(title) {
  const encoded = encodeURIComponent(title);
  const url = `https://en.wikipedia.org/w/api.php`
    + `?action=query`
    + `&titles=${encoded}`
    + `&prop=pageimages`
    + `&pithumbsize=${MAX_WIDTH}`
    + `&format=json`
    + `&origin=*`;

  try {
    const res  = await get(url);
    const data = JSON.parse(res.body.toString());
    const pages = data.query && data.query.pages;
    if (!pages) return null;

    const page = Object.values(pages)[0];
    if (!page || page.missing !== undefined) return null;

    // pageimages gives us a thumbnail — we want the full-size original
    const thumbUrl = page.thumbnail && page.thumbnail.source;
    if (!thumbUrl) return null;

    // Wikimedia thumb URLs look like:
    //   https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/File.jpg/800px-File.jpg
    // Strip the /thumb/ and the size suffix to get the original:
    const fullUrl = thumbUrl
      .replace(/\/thumb\//, '/')
      .replace(/\/\d+px-[^/]+$/, '');

    return fullUrl;
  } catch {
    return null;
  }
}

/**
 * Search Wikimedia Commons for images matching a query.
 * Returns the URL of the best (largest) result or null.
 */
async function commonsSearch(query) {
  const encoded = encodeURIComponent(query);
  const searchUrl = `https://commons.wikimedia.org/w/api.php`
    + `?action=query`
    + `&list=search`
    + `&srsearch=${encoded}`
    + `&srnamespace=6`   // File namespace only
    + `&srlimit=5`
    + `&format=json`
    + `&origin=*`;

  try {
    const res  = await get(searchUrl);
    const data = JSON.parse(res.body.toString());
    const hits = data.query && data.query.search;
    if (!hits || !hits.length) return null;

    // Pick the first hit that looks like a JPEG or PNG photograph
    for (const hit of hits) {
      const title = hit.title; // e.g. "File:Grand Palace Bangkok.jpg"
      if (!/\.(jpe?g|png|webp)$/i.test(title)) continue;

      // Get the actual image URL via imageinfo
      const infoUrl = `https://commons.wikimedia.org/w/api.php`
        + `?action=query`
        + `&titles=${encodeURIComponent(title)}`
        + `&prop=imageinfo`
        + `&iiprop=url|size`
        + `&iiurlwidth=${MAX_WIDTH}`
        + `&format=json`
        + `&origin=*`;

      const infoRes  = await get(infoUrl);
      const infoData = JSON.parse(infoRes.body.toString());
      const infoPages = infoData.query && infoData.query.pages;
      if (!infoPages) continue;

      const infoPage = Object.values(infoPages)[0];
      const imageinfo = infoPage && infoPage.imageinfo && infoPage.imageinfo[0];
      if (!imageinfo) continue;

      // Prefer thumburl (resized) if the original is huge; fall back to url
      const imgUrl = imageinfo.thumburl || imageinfo.url;
      const width  = imageinfo.thumbwidth || imageinfo.width || 0;

      if (imgUrl && width >= MIN_WIDTH) return imgUrl;
    }

    return null;
  } catch {
    return null;
  }
}

// ── Core fetch-and-save ───────────────────────────────────────────────────────

async function fetchPhoto(place) {
  const { id, search, wikiTitle } = place;
  const filename = `place-${id}.jpg`;
  const filepath  = path.join(IMG_DIR, filename);

  if (fs.existsSync(filepath)) {
    console.log(`  ✓ [${id}] already exists — skipping`);
    return true;
  }

  let imageUrl = null;

  // ── Strategy 1: Wikipedia article thumbnail ──────────────────────────────
  if (wikiTitle) {
    process.stdout.write(`  [${id}] Wikipedia "${wikiTitle}" … `);
    imageUrl = await wikiArticleImage(wikiTitle);
    if (imageUrl) {
      process.stdout.write(`found\n`);
    } else {
      process.stdout.write(`no image\n`);
    }
    await sleep(SLEEP_MS);
  }

  // ── Strategy 2: Commons search on wikiTitle ──────────────────────────────
  if (!imageUrl && wikiTitle) {
    process.stdout.write(`  [${id}] Commons search "${wikiTitle}" … `);
    imageUrl = await commonsSearch(wikiTitle);
    if (imageUrl) {
      process.stdout.write(`found\n`);
    } else {
      process.stdout.write(`no image\n`);
    }
    await sleep(SLEEP_MS);
  }

  // ── Strategy 3: Commons search on the data.js search string ─────────────
  if (!imageUrl) {
    process.stdout.write(`  [${id}] Commons search "${search}" … `);
    imageUrl = await commonsSearch(search);
    if (imageUrl) {
      process.stdout.write(`found\n`);
    } else {
      process.stdout.write(`no image\n`);
    }
    await sleep(SLEEP_MS);
  }

  if (!imageUrl) {
    console.warn(`  ✗ [${id}] "${search}" — no image found on Wikimedia`);
    return false;
  }

  // ── Download the image ───────────────────────────────────────────────────
  try {
    const res = await getFollowRedirects(imageUrl);
    if (res.status !== 200) {
      console.warn(`  ✗ [${id}] download failed — HTTP ${res.status}`);
      return false;
    }

    // Basic sanity check: must look like image bytes
    const contentType = res.headers['content-type'] || '';
    if (!contentType.startsWith('image/')) {
      console.warn(`  ✗ [${id}] unexpected content-type: ${contentType}`);
      return false;
    }

    fs.writeFileSync(filepath, res.body);
    console.log(`  ✓ [${id}] saved → ${filename}  (${(res.body.length / 1024).toFixed(0)} KB)`);
    return true;

  } catch (err) {
    console.error(`  ✗ [${id}] download error: ${err.message}`);
    return false;
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });

  console.log(`\n📸  Fetching images for ${PLACES.length} Bangkok places from Wikimedia…\n`);

  let ok = 0, fail = 0;
  const failed = [];

  for (let i = 0; i < PLACES.length; i++) {
    const p = PLACES[i];
    console.log(`\n[${i + 1}/${PLACES.length}] ${p.search}`);
    const success = await fetchPhoto(p);
    if (success) { ok++; } else { fail++; failed.push(p); }
    await sleep(SLEEP_MS);
  }

  console.log('\n' + '─'.repeat(60));
  console.log(`✅  Done!  ${ok} saved,  ${fail} failed.\n`);

  if (failed.length) {
    console.log('⚠️  Failed places — replace manually with any CC-licensed photo:');
    failed.forEach(p => {
      console.log(`   place-${p.id}.jpg  →  ${p.search}`);
      console.log(`   https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(p.search)}&ns6=1`);
    });
    console.log();
  }

  console.log('Next step:');
  console.log('  Copy the images/ folder into  aperfectday/nomadicmatt/bangkok/');
  console.log('  Then run:  set GUIDE=nomadicmatt\\bangkok  &&  deploy-guide-v2.bat\n');
}

main();
