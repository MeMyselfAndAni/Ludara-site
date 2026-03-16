// ═══════════════════════════════════════════════════════════════════════════
// fetch-images-wikimedia.js
// Downloads free, beautiful images from Wikipedia & Wikimedia Commons
// for every place in an A Perfect Day guide.
//
// HOW TO RUN:
//   1. Copy this file into aperfectday/HLO/london/
//   2. Open a terminal in that folder
//   3. Run:  node fetch-images-wikimedia.js
//
// No API key needed. No npm install needed. Completely free.
//
// STRATEGY (tries each in order until one works):
//   1. Wikipedia page image  — best quality, curated main article photo
//   2. Wikimedia Commons search — broader search across all Commons images
//   3. Skip and keep emoji placeholder
// ═══════════════════════════════════════════════════════════════════════════

const fs    = require('fs');
const path  = require('path');
const https = require('https');
const http  = require('http');

const IMAGES_DIR = path.join(__dirname, 'images');
const DATA_FILE  = path.join(__dirname, 'data.js');
const THUMB_SIZE  = 600;  // 600px wide — ~50-120KB per image, plenty for place cards
const DELAY_MS    = 2000;  // 2s between places — Wikimedia rate limit is strict
const RETRY_DELAY = 10000; // 10s wait after a 429 before retrying

// ── Custom search terms per place ID ─────────────────────────────────────────
// If the default search isn't finding a great image, override it here.
// Key = place id, value = Wikipedia article title to look up directly.
const WIKIPEDIA_OVERRIDES = {
  1:  'Buckingham Palace',
  2:  'Westminster Abbey',
  3:  'Churchill War Rooms',
  4:  'Palace of Westminster',
  5:  'St James\'s Park',
  6:  'London Eye',
  7:  'Tate Modern',
  8:  'Shakespeare\'s Globe',
  9:  'Millennium Bridge, London',
  10: 'OXO Tower',
  11: 'Borough Market',
  16: 'Bermondsey',
  19: 'White Cube',
  20: 'London Glassblowing',
  23: 'Tower Bridge',
  24: 'Tower of London',
  25: 'Sky Garden',
  26: 'Leadenhall Market',
  27: 'Duck & Waffle',
  28: 'St Paul\'s Cathedral',
  29: 'Covent Garden',
  31: 'Clos Maggiore',
  35: 'Ronnie Scott\'s',
  36: 'Chinatown, London',
  39: 'Camden Market',
  40: 'Wellcome Collection',
  41: 'Roundhouse, London',
  43: 'Portobello Road Market',
  47: 'Electric Cinema',
  48: 'Natural History Museum, London',
  49: 'Victoria and Albert Museum',
  50: 'Science Museum, London',
  51: 'Harrods',
  52: 'Harwood Arms',
  53: 'Old Royal Naval College',
  54: 'Cutty Sark',
  55: 'National Maritime Museum',
  56: 'Royal Observatory, Greenwich',
  57: 'Greenwich Market',
  58: 'Greenwich Park',
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchUrl(url, retries = 4, attempt = 1) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'LudaraAI-PhotoFetcher/1.0 (ludara.ai; travel guide photo download; mailto:info@ludara.ai)' } }, res => {
      // Follow redirects
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 303) {
        const loc = res.headers.location;
        if (!loc) return reject(new Error('Redirect with no location'));
        res.resume();
        return fetchUrl(loc, retries).then(resolve).catch(reject);
      }
      // Rate limited — wait and retry
      if (res.statusCode === 429) {
        res.resume();
        if (retries > 0) {
          const wait = RETRY_DELAY * attempt;
          process.stdout.write(`[429 rate limit — waiting ${wait/1000}s] `);
          return sleep(wait).then(() => fetchUrl(url, retries - 1, attempt + 1)).then(resolve).catch(reject);
        }
        return reject(new Error(`HTTP 429 — rate limited after ${attempt} attempts`));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks), contentType: res.headers['content-type'] || '' }));
    });
    req.on('error', async err => {
      if (retries > 0) {
        await sleep(2000 * attempt);
        fetchUrl(url, retries - 1, attempt + 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
    req.setTimeout(20000, () => { req.destroy(new Error('Timeout')); });
  });
}

function fetchJson(url) {
  return fetchUrl(url).then(r => JSON.parse(r.body.toString('utf8')));
}

// ── Strategy 1: Wikipedia page image ─────────────────────────────────────────
async function getWikipediaImage(title) {
  const encoded = encodeURIComponent(title.replace(/ /g, '_'));
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encoded}&prop=pageimages&pithumbsize=${THUMB_SIZE}&pilimit=1&format=json&origin=*`;
  const data = await fetchJson(url);
  const pages = data.query && data.query.pages;
  if (!pages) return null;
  const page = Object.values(pages)[0];
  if (!page || page.missing !== undefined) return null;
  return page.thumbnail ? page.thumbnail.source : null;
}

// ── Strategy 2: Wikimedia Commons search ─────────────────────────────────────
async function getCommonsImage(searchTerm) {
  // Step 1: search for files
  const q = encodeURIComponent(searchTerm);
  const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${q}&srnamespace=6&srlimit=5&format=json&origin=*`;
  const searchData = await fetchJson(searchUrl);
  if (!searchData.query || !searchData.query.search || searchData.query.search.length === 0) return null;

  // Step 2: get image URL for first result
  const title = searchData.query.search[0].title; // e.g. "File:Buckingham Palace.jpg"
  const titleEncoded = encodeURIComponent(title);
  const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${titleEncoded}&prop=imageinfo&iiprop=url&iiurlwidth=${THUMB_SIZE}&format=json&origin=*`;
  const infoData = await fetchJson(infoUrl);
  const pages = infoData.query && infoData.query.pages;
  if (!pages) return null;
  const page = Object.values(pages)[0];
  if (!page || !page.imageinfo || page.imageinfo.length === 0) return null;
  return page.imageinfo[0].thumburl || page.imageinfo[0].url || null;
}

// ── Download and save image ───────────────────────────────────────────────────
async function downloadImage(imageUrl, destPath) {
  const res = await fetchUrl(imageUrl);
  // Verify it's actually an image
  if (!res.contentType.includes('image')) {
    throw new Error(`Not an image: ${res.contentType}`);
  }
  if (res.body.length < 5000) {
    throw new Error(`File too small (${res.body.length} bytes) — probably an error page`);
  }
  fs.writeFileSync(destPath, res.body);
  const kb = Math.round(res.body.length / 1024);
  // Warn if image is suspiciously large (>300KB at 600px wide is unusual)
  if (kb > 300) process.stdout.write(`[${kb}KB — large] `);
  return kb;
}

// ── Load PLACES from data.js ──────────────────────────────────────────────────
function loadPlaces() {
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  try {
    const fn = new Function('let map,markers,placesService,AID,AF,ANF; const CC={},CL={},FAVS_KEY="",BLOGGER_NAME="",GUIDE_CITY="",API_KEY=""; ' + raw + '; return PLACES;');
    return fn();
  } catch(e) {
    // Fallback regex approach
    const match = raw.match(/const PLACES\s*=\s*(\[[\s\S]*?\n\];)/);
    if (!match) throw new Error('Could not parse PLACES from data.js: ' + e.message);
    return eval(match[1]);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  let places;
  try {
    places = loadPlaces();
    console.log(`\nLoaded ${places.length} places from data.js`);
  } catch(e) {
    console.error('ERROR loading data.js:', e.message);
    process.exit(1);
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  Downloading images from Wikipedia / Wikimedia Commons');
  console.log('═══════════════════════════════════════════════════════\n');

  let success = 0, skipped = 0, failed = 0;
  const failures = [];

  for (const p of places) {
    const destPath = path.join(IMAGES_DIR, `place-${p.id}.jpg`);

    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 5000) {
      console.log(`  SKIP  [${String(p.id).padStart(2)}] ${p.name}`);
      skipped++;
      continue;
    }

    process.stdout.write(`  [${String(p.id).padStart(2)}] ${p.name.substring(0,40).padEnd(40)} `);

    let imageUrl = null;
    let source = '';

    try {
      // Strategy 1: Wikipedia override or search field → Wikipedia page image
      const wikiTitle = WIKIPEDIA_OVERRIDES[p.id] || p.search;
      if (wikiTitle) {
        imageUrl = await getWikipediaImage(wikiTitle);
        if (imageUrl) source = 'Wikipedia';
      }

      // Strategy 2: Commons search using place name
      if (!imageUrl) {
        const commonsQuery = (p.search || `${p.name} London`).split(' ').slice(0, 4).join(' ');
        imageUrl = await getCommonsImage(commonsQuery);
        if (imageUrl) source = 'Commons';
      }

      // Strategy 3: Commons search using just place name
      if (!imageUrl && p.name) {
        imageUrl = await getCommonsImage(p.name);
        if (imageUrl) source = 'Commons (name)';
      }

      if (!imageUrl) {
        console.log('NO IMAGE FOUND');
        failed++;
        failures.push({ id: p.id, name: p.name, reason: 'No image found in Wikipedia or Commons' });
        await sleep(DELAY_MS);
        continue;
      }

      const kb = await downloadImage(imageUrl, destPath);
      console.log(`✓ ${kb}KB (${source})`);
      success++;

    } catch(e) {
      console.log(`ERROR: ${e.message.substring(0, 60)}`);
      failed++;
      failures.push({ id: p.id, name: p.name, reason: e.message });
      // Clean up partial file
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
    }

    await sleep(DELAY_MS);
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log(`  ✓ ${success} downloaded   ⊘ ${skipped} skipped   ✗ ${failed} failed`);
  console.log('═══════════════════════════════════════════════════════');

  if (failures.length > 0) {
    console.log('\n  Failed places (add images manually as images/place-{id}.jpg):');
    failures.forEach(f => console.log(`    [${f.id}] ${f.name} — ${f.reason}`));
    console.log('\n  Tip: Re-run this script to retry. Or find an image on:');
    console.log('  https://commons.wikimedia.org/wiki/Special:Search');
    console.log('  and save it as images/place-{id}.jpg\n');
  } else {
    console.log('\n  All done! Now run: deploy-HLO-london.bat\n');
  }
}

main().catch(e => { console.error('\nFatal error:', e); process.exit(1); });
