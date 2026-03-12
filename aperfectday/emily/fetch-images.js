/**
 * fetch-images.js
 * ───────────────
 * Run ONCE to pre-fetch photos for all 64 Tbilisi places and save them locally.
 * After running, images live in ./images/place-1.jpg … place-64.jpg
 * The script also patches index.html to use these local paths.
 *
 * Prerequisites:
 *   npm install node-fetch   (or just use Node 18+ which has fetch built-in)
 *
 * Usage:
 *   node fetch-images.js
 *
 * Your Google API key must have Places API enabled.
 */

const fs   = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = 'AIzaSyAFnO6GpVK_EBLTOMa15zYe9eNWuDJEBEU';
const IMG_DIR = path.join(__dirname, 'images');
const HTML_FILE = path.join(__dirname, 'index.html');

// ── Helpers ───────────────────────────────────────────────────────────────────

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Main ──────────────────────────────────────────────────────────────────────

async function fetchPhoto(id, searchTerm) {
  const filename = `place-${id}.jpg`;
  const filepath  = path.join(IMG_DIR, filename);

  if (fs.existsSync(filepath)) {
    console.log(`  ✓ ${id} already exists — skipping`);
    return `images/${filename}`;
  }

  try {
    // Step 1: Find Place ID
    const findUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json`
      + `?input=${encodeURIComponent(searchTerm)}`
      + `&inputtype=textquery`
      + `&fields=place_id,photos`
      + `&key=${API_KEY}`;

    const findRes = await get(findUrl);
    const findData = JSON.parse(findRes.body.toString());

    if (!findData.candidates || !findData.candidates[0]) {
      console.warn(`  ✗ ${id} "${searchTerm}" — no candidate found`);
      return null;
    }

    const candidate = findData.candidates[0];
    const photos = candidate.photos;

    if (!photos || !photos.length) {
      // Try fetching place details for photos
      const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json`
        + `?place_id=${candidate.place_id}`
        + `&fields=photos`
        + `&key=${API_KEY}`;
      const detailRes = await get(detailUrl);
      const detailData = JSON.parse(detailRes.body.toString());
      const detailPhotos = detailData.result && detailData.result.photos;
      if (!detailPhotos || !detailPhotos.length) {
        console.warn(`  ✗ ${id} "${searchTerm}" — no photos found`);
        return null;
      }
      photos.push(...detailPhotos);
    }

    // Step 2: Download photo
    const ref = photos[0].photo_reference;
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo`
      + `?maxwidth=600`
      + `&photo_reference=${ref}`
      + `&key=${API_KEY}`;

    const photoRes = await get(photoUrl);

    // Follow redirect (Places Photo API returns a redirect)
    if (photoRes.status === 302 || photoRes.status === 301) {
      const redirectRes = await get(photoRes.headers.location);
      fs.writeFileSync(filepath, redirectRes.body);
    } else if (photoRes.status === 200) {
      fs.writeFileSync(filepath, photoRes.body);
    } else {
      console.warn(`  ✗ ${id} — photo download failed (${photoRes.status})`);
      return null;
    }

    console.log(`  ✓ ${id} "${searchTerm}" — saved`);
    return `images/${filename}`;

  } catch (err) {
    console.error(`  ✗ ${id} — error: ${err.message}`);
    return null;
  }
}

async function main() {
  // Create images directory
  if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR);

  // Extract PLACES array from index.html
  const html = fs.readFileSync(HTML_FILE, 'utf8');
  // Just verify PLACES exists — we extract ids/searches separately
  if (!html.includes('const PLACES = [')) {
    console.error('Could not find PLACES array in index.html');
    process.exit(1);
  }

  // Parse id and search fields using regex (avoids eval)
  const idMatches     = [...html.matchAll(/\{id:(\d+),/g)];
  const searchMatches = [...html.matchAll(/search:"([^"]+)"/g)];

  const places = idMatches.map((m, i) => ({
    id:     parseInt(m[1]),
    search: searchMatches[i] ? searchMatches[i][1] : `place ${m[1]} Tbilisi`
  }));

  console.log(`\nFetching images for ${places.length} places...\n`);

  const results = {}; // id -> local path or null

  for (const p of places) {
    process.stdout.write(`[${p.id}/${places.length}] `);
    const localPath = await fetchPhoto(p.id, p.search);
    results[p.id] = localPath;
    await sleep(200); // gentle rate limiting
  }

  // ── Patch index.html ───────────────────────────────────────────────────────
  // The app uses Google Places API at runtime to load thumbnails.
  // We inject a `localPhoto` field into each PLACES entry so the app
  // can use it instead of making API calls.

  let patched = html;
  for (const [id, localPath] of Object.entries(results)) {
    if (!localPath) continue;
    // Add localPhoto field after the id field: {id:N, -> {id:N,localPhoto:"images/place-N.jpg",
    patched = patched.replace(
      new RegExp(`(\\{id:${id},)`),
      `$1localPhoto:"${localPath}",`
    );
  }

  // Patch the loadThumb function to prefer local photos
  const oldThumb = `function loadThumb(id){`;
  const newThumb = `function loadThumb(id){
  const p = PLACES.find(x => x.id === id);
  if(p && p.localPhoto){
    const el = document.getElementById('thumb-'+id);
    if(el){ el.innerHTML = '<img src="'+p.localPhoto+'" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">'; }
    const det = document.getElementById('detail-photo');
    if(det && AID === id){ det.innerHTML = '<img src="'+p.localPhoto+'" style="width:100%;height:100%;object-fit:cover;">'; }
    return;
  }
  // fallback to API below:`;

  if (patched.includes(oldThumb)) {
    // Find the closing } of loadThumb and wrap it
    const fnStart = patched.indexOf(oldThumb);
    patched = patched.slice(0, fnStart) + newThumb + patched.slice(fnStart + oldThumb.length);
  }

  fs.writeFileSync(HTML_FILE, patched, 'utf8');

  // Summary
  const ok  = Object.values(results).filter(Boolean).length;
  const bad = Object.values(results).filter(v => !v).length;
  console.log(`\n✅ Done! ${ok} images saved, ${bad} failed.`);
  console.log(`📝 index.html patched with local image paths.`);
  console.log(`\nNext step: commit the images/ folder alongside index.html to your Git repo.`);
  console.log(`  git add images/ index.html && git commit -m "Add pre-fetched place images"`);
}

main();
