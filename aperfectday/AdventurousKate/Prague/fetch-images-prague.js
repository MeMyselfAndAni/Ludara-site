/**
 * fetch-images-prague.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Fetches one Wikimedia Commons photo per place for the
 * Adventurous Kate / Prague guide (55 places).
 *
 * Run from:
 *   C:\Users\Maria\OneDrive\Dokumentumok\Ludara\Ludara-site\aperfectday\AdventurousKate\Prague\
 *
 * Usage:
 *   node fetch-images-prague.js
 *
 * Output: images/place-1.jpg … images/place-55.jpg
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
  // Old Town
  { id:  1, wikiTitle: 'Old Town Square, Prague',               queries: ['Old Town Square Prague Staromestske namesti'] },
  { id:  2, wikiTitle: 'Prague astronomical clock',             queries: ['Prague Astronomical Clock Orloj'] },
  { id:  3, wikiTitle: 'Josefov',                               queries: ['Josefov Jewish Quarter Prague synagogue'] },
  { id:  4, wikiTitle: 'Charles Bridge',                        queries: ['Charles Bridge Prague Karluv most'] },
  { id:  5, wikiTitle: 'Lokál (restaurant)',                    queries: ['Lokal Prague Czech pub beer restaurant'] },
  { id:  6, wikiTitle: null,                                    queries: ['Prague cocktail bar Gothic cellar vaulted', 'Prague bar dark cellar atmospheric'] },
  { id:  7, wikiTitle: null,                                    queries: ['Manifesto Market Prague food trucks Holesovice', 'Prague outdoor food market shipping containers'] },
  { id:  8, wikiTitle: null,                                    queries: ['Naplavka Prague farmers market riverside Saturday', 'Prague riverside market Vltava'] },

  // Malá Strana & Hradčany
  { id:  9, wikiTitle: 'Prague Castle',                         queries: ['Prague Castle Hradcany skyline'] },
  { id: 10, wikiTitle: 'Petřín',                                queries: ['Petrin Hill Prague tower park'] },
  { id: 11, wikiTitle: 'Lennon Wall',                           queries: ['John Lennon Wall Prague colourful graffiti'] },
  { id: 12, wikiTitle: 'Kampa Island',                          queries: ['Kampa Island Prague museum park river'] },
  { id: 13, wikiTitle: 'Strahov Monastery',                     queries: ['Strahov Monastery Library Prague Baroque'] },
  { id: 14, wikiTitle: 'Four Seasons Hotel Prague',             queries: ['CottoCrudo Four Seasons Prague castle view', 'Prague luxury restaurant castle view'] },

  // New Town
  { id: 15, wikiTitle: 'Dancing House',                         queries: ['Dancing House Prague Fred Ginger Gehry'] },
  { id: 16, wikiTitle: 'Museum of Communism (Prague)',          queries: ['Museum of Communism Prague'] },
  { id: 17, wikiTitle: 'Wenceslas Square',                      queries: ['Wenceslas Square Prague Vaclavske namesti'] },
  { id: 18, wikiTitle: 'Paternoster lift',                      queries: ['paternoster elevator Prague moving lift', 'paternoster open elevator Europe'] },
  { id: 19, wikiTitle: null,                                    queries: ['river surfing Prague Vltava wave', 'Prague river surfing wave artificial'] },
  { id: 20, wikiTitle: null,                                    queries: ['Czech wine bar Prague interior', 'Prague wine bar Vinohrady'] },

  // Vinohrady
  { id: 21, wikiTitle: 'Vinohrady',                             queries: ['Vinohrady Prague Art Nouveau apartment buildings'] },
  { id: 22, wikiTitle: 'Riegrovy sady',                         queries: ['Riegrovy sady beer garden Prague skyline views'] },
  { id: 23, wikiTitle: null,                                    queries: ['Spanish tapas restaurant Prague', 'El Camino tapas Prague Vinohrady'] },
  { id: 24, wikiTitle: null,                                    queries: ['Italian fine dining restaurant Prague', 'Aromi restaurant Prague truffle pasta'] },
  { id: 25, wikiTitle: null,                                    queries: ['Vietnamese pho restaurant Prague', 'Prague Vietnamese restaurant bowl noodles'] },
  { id: 26, wikiTitle: null,                                    queries: ['Asian fusion restaurant Prague soft shell crab', 'Prague Asian fusion cuisine taco'] },
  { id: 27, wikiTitle: 'Georgian cuisine',                      queries: ['Georgian restaurant khachapuri Prague', 'khachapuri cheese bread Georgian food'] },

  // Karlín
  { id: 28, wikiTitle: null,                                    queries: ['Czech butcher restaurant meat Prague', 'Kantyna Prague butcher burger restaurant'] },
  { id: 29, wikiTitle: null,                                    queries: ['Kasarna Karlin Prague cultural courtyard', 'Prague creative courtyard barracks culture'] },
  { id: 30, wikiTitle: null,                                    queries: ['borscht soup Czech Republic Prague lunch', 'Georgian khachapuri soup bowl Prague'] },
  { id: 31, wikiTitle: null,                                    queries: ['Eska Prague restaurant bakery fermentation Karlin', 'Prague modern Czech restaurant bakery'] },
  { id: 32, wikiTitle: null,                                    queries: ['axe throwing bar Prague house of axes', 'axe throwing activity group bar Prague'] },
  { id: 33, wikiTitle: null,                                    queries: ['Prague beer festival outdoor burger', 'Prague outdoor food festival beer summer'] },

  // Letná & Beyond
  { id: 34, wikiTitle: 'Letenské sady',                         queries: ['Letna Park beer garden Prague city view'] },
  { id: 35, wikiTitle: null,                                    queries: ['Dejvice farmers market Prague Kulatak Saturday', 'Prague local farmers market organic vegetables'] },
  { id: 36, wikiTitle: null,                                    queries: ['private spa wellness Prague sauna jacuzzi', 'private spa two people jacuzzi sauna'] },
  { id: 37, wikiTitle: 'Sapa, Prague',                          queries: ['Sapa Market Prague Vietnamese Little Hanoi', 'Prague Vietnamese market community'] },
  { id: 38, wikiTitle: null,                                    queries: ['beer bath spa Czech Republic Prague', 'beer spa bath tub Prague Krusovice'] },
  { id: 39, wikiTitle: null,                                    queries: ['Taro restaurant Prague Asian tasting menu', 'Prague Asian fusion tasting menu open kitchen'] },
  { id: 40, wikiTitle: null,                                    queries: ['Italian food market restaurant Prague Vinohrady', 'The Italians wine food Prague pizza salume'] },
  { id: 41, wikiTitle: null,                                    queries: ['Czech butcher restaurant grill Prague Vinohrady', 'Cestr Prague Czech beef restaurant chandeliers'] },
  { id: 42, wikiTitle: null,                                    queries: ['Krystal Bistro Prague Art Deco Czech food', 'Prague Art Deco cafe restaurant Vinohrady'] },

  // Further afield & day trips
  { id: 43, wikiTitle: 'Únětický pivovar',                      queries: ['Unetice Brewery Prague Czech craft beer garden', 'Unetice village brewery beer garden Prague'] },
  { id: 44, wikiTitle: 'Sedlec Ossuary',                        queries: ['Sedlec Ossuary bone church Kutna Hora', 'Kutna Hora bone chapel skull decoration'] },
  { id: 45, wikiTitle: null,                                    queries: ['Prague food tour Czech street food tasting', 'Czech food tour Prague group tasting'] },
  { id: 46, wikiTitle: null,                                    queries: ['Prague Castle walking tour guide group', 'Prague historic walking tour guide tourists'] },
  { id: 47, wikiTitle: 'Vyšehrad',                              queries: ['Vysehrad Prague fortress cemetery view', 'Vysehrad Neo-Gothic church Prague river'] },
  { id: 48, wikiTitle: 'Prague Zoo',                            queries: ['Prague Zoo animals giraffes elephants Troja'] },
  { id: 49, wikiTitle: null,                                    queries: ['Yamato Prague sushi Japanese restaurant', 'Japanese sushi restaurant Prague omakase'] },
  { id: 50, wikiTitle: null,                                    queries: ['PRU58 Prague restaurant Karlin Asian', 'Prague Asian restaurant Karlin modern'] },
  { id: 51, wikiTitle: 'Vltava',                                queries: ['Vltava River bike path Prague cycling forest', 'Prague cycling path river forest Vltava'] },
  { id: 52, wikiTitle: 'Egg coffee',                            queries: ['Vietnamese egg coffee cup foam', 'ca phe trung egg coffee Vietnam Prague'] },
  { id: 53, wikiTitle: null,                                    queries: ['Coda restaurant Prague Czech modern Vinohrady', 'Prague modern Czech restaurant svickova'] },
  { id: 54, wikiTitle: 'Větrník',                               queries: ['vetrnik Czech pastry eclair cream Prague', 'Czech pastry vetrnik cream puff eclair'] },
  { id: 55, wikiTitle: 'Café Savoy',                            queries: ['Cafe Savoy Prague Neo-Renaissance interior cafe', 'Prague beautiful historic cafe breakfast'] },
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

  // Strategy 1: Wikipedia article thumbnail
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
    console.warn(`  ✗ [${place.id}] no image found`);
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

  console.log(`\n📸  Fetching images for ${PLACES.length} Prague places from Wikimedia…\n`);

  let ok = 0, fail = 0;
  const failed = [];

  for (let i = 0; i < PLACES.length; i++) {
    const p = PLACES[i];
    console.log(`\n[${i + 1}/${PLACES.length}] place-${p.id}`);
    const success = await fetchPhoto(p);
    if (success) { ok++; } else { fail++; failed.push(p); }
    await sleep(SLEEP_MS);
  }

  console.log('\n' + '─'.repeat(60));
  console.log(`✅  Done!  ${ok} saved,  ${fail} failed.\n`);

  if (failed.length) {
    console.log('⚠️  Failed — grab manually from Commons:');
    failed.forEach(p => {
      console.log(`\n   place-${p.id}.jpg`);
      console.log(`   https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(p.queries[0])}&ns6=1`);
    });
    console.log();
  }

  console.log('Next: node resize-images.js  →  then deploy-kate-prague.bat\n');
}

main();
