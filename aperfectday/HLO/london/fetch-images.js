// ═══════════════════════════════════════════════════════════════════════════
// fetch-images.js — Download Google Places photos for A Perfect Day guides
//
// Usage:
//   node fetch-images.js
//
// Run this from the guide folder:
//   C:\Users\Maria\...\aperfectday\HLO\london\
//
// It reads PLACES from data.js, searches Google Places API for each one,
// downloads the first photo and saves as images/place-{id}.jpg
//
// Requirements: npm install node-fetch  (run once before first use)
// ═══════════════════════════════════════════════════════════════════════════

const fs      = require('fs');
const path    = require('path');
const https   = require('https');

const API_KEY   = 'AIzaSyAFnO6GpVK_EBLTOMa15zYe9eNWuDJEBEU';
const IMAGES_DIR = path.join(__dirname, 'images');
const DATA_FILE  = path.join(__dirname, 'data.js');
const DELAY_MS   = 300;   // ms between API calls — stay within rate limits
const MAX_WIDTH  = 800;   // photo width to request

// ── Load PLACES from data.js ─────────────────────────────────────────────────
function loadPlaces() {
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  // Extract just the PLACES array by evaluating the file in a sandbox
  const sandbox = { PLACES: [], CC: {}, CL: {}, FAVS_KEY: '', BLOGGER_NAME: '', GUIDE_CITY: '' };
  try {
    const fn = new Function(...Object.keys(sandbox), raw + '\nreturn PLACES;');
    return fn(...Object.values(sandbox));
  } catch(e) {
    // Fallback: regex extract
    const match = raw.match(/const PLACES\s*=\s*(\[[\s\S]*?\]);/);
    if (!match) throw new Error('Could not parse PLACES from data.js');
    return eval(match[1]);
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return httpsGet(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks), headers: res.headers }));
    }).on('error', reject);
  });
}

function httpsGetJson(url) {
  return httpsGet(url).then(r => JSON.parse(r.body.toString()));
}

// ── Step 1: Find place_id via Places Text Search ──────────────────────────────
async function findPlaceId(searchQuery) {
  const q   = encodeURIComponent(searchQuery);
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${q}&inputtype=textquery&fields=place_id,name&key=${API_KEY}`;
  const data = await httpsGetJson(url);
  if (data.status === 'OK' && data.candidates && data.candidates.length > 0) {
    return data.candidates[0].place_id;
  }
  return null;
}

// ── Step 2: Get photo reference from place details ────────────────────────────
async function getPhotoRef(placeId) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${API_KEY}`;
  const data = await httpsGetJson(url);
  if (data.status === 'OK' && data.result && data.result.photos && data.result.photos.length > 0) {
    return data.result.photos[0].photo_reference;
  }
  return null;
}

// ── Step 3: Download photo ────────────────────────────────────────────────────
async function downloadPhoto(photoRef, destPath) {
  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${MAX_WIDTH}&photo_reference=${photoRef}&key=${API_KEY}`;
  const res = await httpsGet(url);
  if (res.status === 200) {
    fs.writeFileSync(destPath, res.body);
    return true;
  }
  return false;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
    console.log('Created images/ folder');
  }

  let places;
  try {
    places = loadPlaces();
  } catch(e) {
    console.error('ERROR: Could not load PLACES from data.js:', e.message);
    process.exit(1);
  }

  console.log(`\nFetching photos for ${places.length} places...\n`);

  let success = 0, skipped = 0, failed = 0;

  for (const p of places) {
    const destPath = path.join(IMAGES_DIR, `place-${p.id}.jpg`);

    // Skip if already downloaded
    if (fs.existsSync(destPath)) {
      console.log(`  SKIP  [${p.id}] ${p.name} (already exists)`);
      skipped++;
      continue;
    }

    process.stdout.write(`  [${p.id}] ${p.name} ... `);

    try {
      // Use search field if available, otherwise name + address
      const query = p.search || `${p.name} ${p.address}`;

      const placeId = await findPlaceId(query);
      if (!placeId) { console.log('NO PLACE FOUND'); failed++; await sleep(DELAY_MS); continue; }

      const photoRef = await getPhotoRef(placeId);
      if (!photoRef) { console.log('NO PHOTO'); failed++; await sleep(DELAY_MS); continue; }

      const ok = await downloadPhoto(photoRef, destPath);
      if (ok) {
        const size = Math.round(fs.statSync(destPath).size / 1024);
        console.log(`✓ saved (${size}KB)`);
        success++;
      } else {
        console.log('DOWNLOAD FAILED');
        failed++;
      }
    } catch(e) {
      console.log(`ERROR: ${e.message}`);
      failed++;
    }

    await sleep(DELAY_MS);
  }

  console.log(`\n${'═'.repeat(50)}`);
  console.log(`  Done! ✓ ${success} downloaded · ${skipped} skipped · ${failed} failed`);
  console.log(`  Images saved to: ${IMAGES_DIR}`);
  if (failed > 0) {
    console.log(`\n  Tip: Re-run the script to retry failed items.`);
    console.log(`  For persistent failures, add a manual image as images/place-{id}.jpg`);
  }
  console.log(`${'═'.repeat(50)}\n`);
}

main().catch(e => { console.error('Fatal error:', e); process.exit(1); });
