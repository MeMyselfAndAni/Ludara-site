/**
 * fetch-images-mexicocity.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Fetches one high-quality photo per place for The Curious Mexican / Mexico City
 * guide (41 places) from Wikimedia Commons / Wikipedia — no API key needed.
 *
 * Run from the guide folder:
 *   node fetch-images-mexicocity.js
 *
 * Output:  images/place-1.jpg  →  images/place-41.jpg
 * Drop the resulting images/ folder into:
 *   aperfectday/thecuriousmexican/MexicoCity/images/
 *
 * After running, resize with:
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

// ── Place list ────────────────────────────────────────────────────────────────
const PLACES = [
  // Centro Histórico
  { id:  1, search: 'Zócalo Mexico City main square',                       wikiTitle: 'Zócalo' },
  { id:  2, search: 'Palacio Nacional Diego Rivera murals Mexico City',      wikiTitle: 'National Palace (Mexico)' },
  { id:  3, search: 'Palacio de Bellas Artes Mexico City',                   wikiTitle: 'Palace of Fine Arts (Mexico City)' },
  { id:  4, search: 'Templo Mayor Aztec ruins Mexico City',                  wikiTitle: 'Templo Mayor' },
  { id:  5, search: 'Bósforo mezcal bar Centro Histórico Mexico City',       wikiTitle: null },
  { id:  6, search: 'El Huequito tacos al pastor Mexico City',               wikiTitle: null },
  { id:  7, search: 'La Lagunilla tianguis flea market Mexico City',         wikiTitle: 'Lagunilla Market' },
  { id:  8, search: 'Cantina La Opera historic bar Mexico City',             wikiTitle: null },

  // Roma Norte
  { id:  9, search: 'Licorería Limantour cocktail bar Roma Mexico City',     wikiTitle: null },
  { id: 10, search: 'Contramar seafood restaurant Roma Norte Mexico City',   wikiTitle: null },
  { id: 11, search: 'Panadería Rosetta bakery Roma Mexico City',             wikiTitle: null },
  { id: 12, search: 'Expendio de Maíz Sin Nombre restaurant Mexico City',   wikiTitle: null },
  { id: 13, search: 'La Clandestina mezcal bar Roma Mexico City',            wikiTitle: null },
  { id: 14, search: 'Parque México Condesa oval park Mexico City',           wikiTitle: 'Parque México' },
  { id: 15, search: 'Gin Chan sushi restaurant Roma Norte Mexico City',      wikiTitle: null },
  { id: 16, search: 'ramen restaurant Roma Norte Mexico City',               wikiTitle: null },
  { id: 17, search: 'Canton Mexicalli Chinese Mexican restaurant CDMX',     wikiTitle: null },
  { id: 18, search: 'natural wine bar Roma Norte Mexico City',               wikiTitle: null },

  // Condesa
  { id: 19, search: 'Avenida Amsterdam Condesa boulevard Mexico City',       wikiTitle: 'Avenida Ámsterdam' },
  { id: 20, search: 'Baltra Bar cocktail bar Condesa Mexico City',           wikiTitle: null },
  { id: 21, search: 'rooftop restaurant Condesa Mexico City',                wikiTitle: null },
  { id: 22, search: 'Máximo Bistrot restaurant Roma Norte Mexico City',      wikiTitle: null },
  { id: 23, search: 'breakfast restaurant San Miguel Chapultepec Mexico City', wikiTitle: null },
  { id: 24, search: 'Parque España Condesa park Mexico City',                wikiTitle: 'Parque España (Mexico City)' },

  // Polanco & Chapultepec
  { id: 25, search: 'Museo Nacional de Antropología Mexico City',            wikiTitle: 'National Museum of Anthropology (Mexico)' },
  { id: 26, search: 'Bosque de Chapultepec forest Mexico City',              wikiTitle: 'Chapultepec' },
  { id: 27, search: 'Castillo de Chapultepec castle Mexico City',            wikiTitle: 'Chapultepec Castle' },
  { id: 28, search: 'Pujol restaurant Polanco Mexico City Enrique Olvera',   wikiTitle: null },
  { id: 29, search: 'Quintonil restaurant Polanco Mexico City',              wikiTitle: null },

  // Coyoacán
  { id: 30, search: 'Museo Frida Kahlo Casa Azul Coyoacán Mexico City',      wikiTitle: 'Frida Kahlo Museum' },
  { id: 31, search: 'Jardín Centenario Coyoacán plaza Mexico City',          wikiTitle: 'Coyoacán' },
  { id: 32, search: 'Mercado de Coyoacán Mexico City',                       wikiTitle: 'Coyoacán Market' },
  { id: 33, search: 'El Jarocho café de olla Coyoacán Mexico City',          wikiTitle: null },
  { id: 34, search: 'Xochimilco trajineras canals Mexico City',              wikiTitle: 'Xochimilco' },

  // Juárez & San Rafael
  { id: 35, search: 'speakeasy cocktail bar Juárez Mexico City',             wikiTitle: null },
  { id: 36, search: 'El Califa de León Michelin taco Mexico City',           wikiTitle: null },
  { id: 37, search: 'Mariscos Orizaba seafood tostadas Mexico City',         wikiTitle: null },
  { id: 38, search: 'mixiote tacos Mexico City street food',                 wikiTitle: null },
  { id: 39, search: 'natural wine shop Roma Mexico City',                    wikiTitle: null },
  { id: 40, search: 'bohemian cocktail bar Juárez Mexico City',              wikiTitle: null },
  { id: 41, search: 'Mercado Jamaica flower market Mexico City',             wikiTitle: 'Mercado Jamaica' },
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
async function wikiArticleImage(title) {
  const encoded = encodeURIComponent(title);
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encoded}&prop=pageimages&pithumbsize=${MAX_WIDTH}&format=json&origin=*`;
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
  const encoded = encodeURIComponent(query);
  const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encoded}&srnamespace=6&srlimit=5&format=json&origin=*`;
  try {
    const res  = await get(searchUrl);
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

  if (wikiTitle) {
    process.stdout.write(`  [${id}] Wikipedia "${wikiTitle}" … `);
    imageUrl = await wikiArticleImage(wikiTitle);
    process.stdout.write(imageUrl ? 'found\n' : 'no image\n');
    await sleep(SLEEP_MS);
  }

  if (!imageUrl && wikiTitle) {
    process.stdout.write(`  [${id}] Commons "${wikiTitle}" … `);
    imageUrl = await commonsSearch(wikiTitle);
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
    console.warn(`  ✗ [${id}] "${search}" — no image found on Wikimedia`);
    return false;
  }

  try {
    const res = await getFollowRedirects(imageUrl);
    if (res.status !== 200) { console.warn(`  ✗ [${id}] HTTP ${res.status}`); return false; }
    const contentType = res.headers['content-type'] || '';
    if (!contentType.startsWith('image/')) { console.warn(`  ✗ [${id}] bad content-type: ${contentType}`); return false; }
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
  console.log(`\n📸  Fetching images for ${PLACES.length} Mexico City places from Wikimedia…\n`);

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
    console.log('⚠️  Failed — replace manually from Wikimedia Commons:');
    failed.forEach(p => {
      console.log(`   place-${p.id}.jpg  →  ${p.search}`);
      console.log(`   https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(p.search)}&ns6=1`);
    });
    console.log();
  }

  console.log('Next step:');
  console.log('  node ../../../general/_scripts/resize-images.js .');
  console.log('  Then run deploy-anais-mexicocity.bat\n');
}

main();
