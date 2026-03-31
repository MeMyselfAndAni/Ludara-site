// fetch-images-london.js  v2
// Downloads images for A Perfect Day — London guide
//
// Uses Wikipedia's pageimages API — returns the actual hero image
// from each Wikipedia article, guaranteed to exist and be high quality.
// Much more reliable than guessing exact Wikimedia Commons filenames.
//
// Run from:  aperfectday\general\_scripts\
// Output:    ..\..\ludara\london\images\place-N.jpg
// Usage:     node fetch-images-london.js

const https  = require('https');
const http   = require('http');
const fs     = require('fs');
const path   = require('path');

const OUT_DIR = path.resolve(__dirname, '..', '..', 'ludara', 'london', 'images');
const WP_API  = 'https://en.wikipedia.org/w/api.php';
const THUMB   = 1000;

// ── Wikipedia article titles per place ───────────────────────────────────────
// For each id: the Wikipedia article whose hero image best represents that place.
// Where a place has no Wikipedia article, a nearby landmark or neighbourhood is reused.
const ARTICLES = {

  // WESTMINSTER
  1:  'Buckingham Palace',
  2:  'Westminster Abbey',
  3:  'Cabinet War Rooms',
  4:  'Palace of Westminster',
  5:  "St James's Park",
  59: 'Daunt Books',

  // SOUTH BANK
  7:  'Tate Modern',
  8:  "Shakespeare's Globe",
  9:  'Millennium Bridge, London',

  // BOROUGH & BERMONDSEY — all distinct
  11: 'Borough Market',
  12: 'Taco',                      // El Pastor — 'Tacos al pastor' has no image
  13: 'Cacio e pepe',              // Padella: the signature pasta dish
  14: 'Espresso',                  // Monmouth — 'Specialty coffee' has no image
  15: 'Gelato',                    // Gelateria 3Bis: colorful scoops
  16: 'Bermondsey',                // Bermondsey Street
  17: 'Flat white',                // WatchHouse: coffee art
  18: 'Croquette',                 // José: iconic Spanish snack
  19: 'Art exhibition',            // White Cube
  20: 'Glassblowing',             // London Glassblowing: molten glass
  21: 'Pie and mash',
  22: 'Sunday roast',             // The Garrison
  60: 'Smithfield, London',       // St John Restaurant
  61: 'Street food',              // Maltby Street Market

  // THE CITY — 25 and 27 now distinct
  23: 'Tower Bridge',
  24: 'Tower of London',
  25: '20 Fenchurch Street',      // Sky Garden building
  26: 'Leadenhall Market',
  27: 'Duck confit',              // Duck & Waffle: the dish
  28: "St Paul's Cathedral",
  62: 'Barbican Centre',

  // COVENT GARDEN & SOHO — all distinct
  29: 'Covent Garden',
  30: "Neal's Yard",
  31: 'French cuisine',           // Clos Maggiore
  32: 'Tapas',                    // Barrafina
  33: 'Gin',                      // Mr Fogg's Gin Parlour
  34: 'Inigo Jones',              // St Paul's Church CG — no WP image, use the architect
  35: "Ronnie Scott's Jazz Club",
  36: 'Chinatown, London',
  37: 'Cocktail',                 // Opium — different from Chinatown
  38: 'Frith Street',             // Bob Bob Ricard

  // CAMDEN & KING'S CROSS
  40: 'Wellcome Collection',
  41: 'Roundhouse (venue)',
  42: 'St Pancras railway station', // German Gymnasium

  // NOTTING HILL — all distinct
  43: 'Portobello Road',
  44: 'British cuisine',          // Core — chef portrait not suitable for place card
  45: 'Italian cuisine',          // Luna Rossa
  46: 'Greek cuisine',            // Kalamaras
  47: 'Electric Cinema, Notting Hill',

  // KENSINGTON — museum interiors not logos
  48: 'Archaeopteryx',            // NHM: the most famous fossil in the museum
  49: 'Ardabil Carpet',          // V&A: most famous object inside the museum
  50: "Stephenson's Rocket",     // Science Museum: most iconic exhibit
  52: 'Fulham',                   // Harwood Arms

  // GREENWICH
  53: 'Old Royal Naval College',
  54: 'Cutty Sark',
  55: 'National Maritime Museum',
  56: 'Royal Observatory, Greenwich',
  57: 'Market hall',              // Greenwich Market — 'Greenwich, London' has no image
  58: 'Greenwich Park',

  // SHOREDITCH & SPITALFIELDS
  63: "Dennis Severs' House",
  64: 'Columbia Road Flower Market',
  65: 'Beigel Bake',
  66: 'Shoreditch',
};

// ── IDs removed from the guide (skip silently) ────────────────────────────────
const SKIP = new Set([6, 10, 39, 51]);

// ── IDs that had duplicate/wrong images — delete before re-downloading ────────
const FORCE_REFRESH = new Set([
  12, 13, 15,           // were all Borough Market
  14,                   // specialty coffee → espresso
  17, 18, 19, 20, 22, 61, // were all Bermondsey
  27,                   // was same as 25 (20 Fenchurch Street)
  31, 33, 34,           // were all Covent Garden
  37,                   // was same as 36 (Chinatown)
  44, 45, 46,           // were all Notting Hill (44 also had a chef portrait)
  48, 49, 50,           // museum logos → specific exhibits
  57,                   // Greenwich market
]);

// ── Helpers ───────────────────────────────────────────────────────────────────
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    let data = '';
    proto.get(url, {
      headers: { 'User-Agent': 'APerfectDayGuide/1.0 (ludara.ai; contact@ludara.ai)' }
    }, res => {
      if ([301, 302].includes(res.statusCode))
        return fetchJSON(res.headers.location).then(resolve).catch(reject);
      res.on('data', c => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { reject(e); } });
    }).on('error', reject);
  });
}

async function getWikiImage(title) {
  const url = `${WP_API}?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&pithumbsize=${THUMB}&pilimit=1&format=json`;
  const data = await fetchJSON(url);
  const pages = data.query && data.query.pages;
  if (!pages) return null;
  const page = Object.values(pages)[0];
  return (page && page.thumbnail && page.thumbnail.source) || null;
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const file  = fs.createWriteStream(dest);
    proto.get(url, {
      headers: { 'User-Agent': 'APerfectDayGuide/1.0 (ludara.ai; contact@ludara.ai)' }
    }, res => {
      if ([301, 302].includes(res.statusCode)) {
        file.close(); fs.unlink(dest, () => {});
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close(); fs.unlink(dest, () => {});
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', err => { file.close(); fs.unlink(dest, () => {}); reject(err); });
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    console.log('Created:', OUT_DIR);
  }

  console.log('Output directory:', OUT_DIR);
  console.log('');

  const ids = Object.keys(ARTICLES).map(Number).sort((a, b) => a - b);
  let ok = 0, skip = 0, fail = 0;

  for (const id of ids) {
    if (SKIP.has(id)) { skip++; continue; }

    const dest = path.join(OUT_DIR, `place-${id}.jpg`);

    // Delete and re-download if this was a duplicate/wrong image
    if (FORCE_REFRESH.has(id) && fs.existsSync(dest)) {
      fs.unlinkSync(dest);
      console.log(`  🗑  place-${id}.jpg deleted (was duplicate) — re-downloading...`);
    }

    if (fs.existsSync(dest)) {
      console.log(`  ⏭  place-${id}.jpg already exists`);
      skip++; continue;
    }

    const title = ARTICLES[id];
    process.stdout.write(`  ↓  place-${id}.jpg  "${title}"...`);

    try {
      const imgUrl = await getWikiImage(title);
      if (!imgUrl) {
        console.log(' ✗  No image on Wikipedia — add a FALLBACK for this id');
        fail++; continue;
      }
      await download(imgUrl, dest);
      const kb = (fs.statSync(dest).size / 1024).toFixed(0);
      console.log(` ✓  ${kb}KB`);
      ok++;
    } catch(e) {
      console.log(` ✗  ${e.message}`);
      fail++;
    }

    await new Promise(r => setTimeout(r, 350));
  }

  console.log(`\n══════════════════════════════`);
  console.log(`  Downloaded : ${ok}`);
  console.log(`  Skipped    : ${skip}`);
  console.log(`  Failed     : ${fail}`);
  console.log(`══════════════════════════════`);
  if (fail === 0) {
    console.log('\n✅  All done.');
    console.log('   Next: node resize-images.js ..\\..\\ludara\\london');
  } else {
    console.log('\n⚠️  For failed entries, edit the ARTICLES map with a different Wikipedia article title.');
  }
}

main().catch(console.error);
