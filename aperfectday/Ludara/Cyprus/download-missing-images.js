// ─────────────────────────────────────────────────────────────────────────────
// download-missing-images.js — Cyprus guide
// Downloads the 16 images that fetch-images-universal.js couldn't find.
//
// Run from the Cyprus folder:
//   node download-missing-images.js
//
// Requires: npm install sharp node-fetch@2   (one-time setup)
// ─────────────────────────────────────────────────────────────────────────────

const fs   = require('fs');
const path = require('path');

// ── Try to load deps; print helpful message if missing ───────────────────────
let fetch, sharp;
try { fetch = require('node-fetch'); } catch(e) {
  console.error('Missing dependency. Run:  npm install node-fetch@2 sharp');
  process.exit(1);
}
try { sharp = require('sharp'); } catch(e) {
  // sharp is optional — will save raw if absent
  sharp = null;
  console.warn('sharp not found — images saved as-is (no resize). Install with: npm install sharp');
}

const IMAGES_DIR = path.join(__dirname, 'images');
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR);

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'image/webp,image/jpeg,image/png,*/*',
};

// ── Exact image sources — all found via venue websites or travel sites ────────
const DIRECT_URLS = {
  // Elysium Hotel restaurants — sourced from elysium-hotel.com dining pages
  'place-2.jpg':  'https://www.elysium-hotel.com/media/rscd4vjs/lemonia-2-400x267.webp',
  'place-3.jpg':  'https://www.elysium-hotel.com/media/kgobjdqc/epicurean_restaurant_a_p.webp',
  'place-5.jpg':  'https://www.elysium-hotel.com/media/snsb23gi/oshin_restaurant_b_f.webp',
  'place-6.jpg':  'https://www.elysium-hotel.com/media/evkeceat/mediterraneo_restaurant_a_f.webp',
  'place-8.jpg':  'https://www.elysium-hotel.com/media/vopbqdw2/cafe-occidental-2-400x267.webp',
  'place-9.jpg':  'https://www.elysium-hotel.com/media/lmocys0v/mare_nostrum_pool_bar_p.webp',
  // Remaining places — sourced from TripAdvisor, visitcyprus.com, chooseyourcyprus.com, cypruspassion.com
  'place-13.jpg': 'https://media-cdn.tripadvisor.com/media/photo-o/08/39/83/13/filiotis-fish-tavern.jpg',
  'place-17.jpg': 'https://chooseyourcyprus.com/wp-content/uploads/yootheme/cache/c9/AKAMAS-BIG-2-c9eba83a.jpg',
  'place-19.jpg': 'https://chooseyourcyprus.com/wp-content/uploads/yootheme/cache/90/796X1200-32-902b03cc.jpg',
  'place-21.jpg': 'https://media-cdn.tripadvisor.com/media/photo-w/12/2f/82/b7/nice-welcome-and-pleasant.jpg',
  'place-27.jpg': 'https://chooseyourcyprus.com/wp-content/uploads/yootheme/cache/1e/kalidonia3-1ead409c.jpg',
  'place-29.jpg': 'https://www.visitcyprus.com/wp-content/uploads/2015/12/64cc39b77ed73850331f330b81fb3b3f.jpg',
  'place-30.jpg': 'https://vlassideswinery.com/wp-content/uploads/2019/05/winery-page-banner-1.jpg',
  'place-34.jpg': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/07/5b/5a/e5/karseras-family-winery.jpg?w=1200&h=1200&s=1',
  'place-35.jpg': 'https://www.visitcyprus.com/wp-content/uploads/2015/11/d043ec6f29e114ac52b8083afc5702cc.jpg',
};

// ── No more Wiki lookups needed — all URLs found directly ────────────────────
const WIKI_LOOKUPS = {};

// ── Force-replace — overwrites existing files (wrong images that need fixing) ─
const FORCE_REPLACE = {
  // place-10 was a MAP diagram — replacing with Roman mosaic photo from chooseyourcyprus.com
  'place-10.jpg': 'https://chooseyourcyprus.com/wp-content/uploads/yootheme/cache/58/796X1200-25-5822a0c8.jpg',
  // place-11 was an architectural blueprint — replacing with sanctuary ruins photo
  'place-11.jpg': 'https://www.thisispafos.com/wp-content/uploads/2024/07/sanctuary-of-aphrodite.jpg',
  // place-26 was a bikini woman — replacing with Millomeris waterfall photo
  'place-26.jpg': 'https://chooseyourcyprus.com/wp-content/uploads/yootheme/cache/8e/Millomeris-trail-8e0b0ab8.jpg',
  // place-29 Agros — visitcyprus.com village photo
  'place-29.jpg': 'https://www.visitcyprus.com/wp-content/uploads/2015/12/64cc39b77ed73850331f330b81fb3b3f.jpg',
};

// ── Helpers ───────────────────────────────────────────────────────────────────
async function saveImage(destPath, buffer) {
  if (sharp) {
    await sharp(buffer).resize(800, 800, { fit: 'inside' }).jpeg({ quality: 85 }).toFile(destPath);
  } else {
    fs.writeFileSync(destPath, buffer);
  }
}

async function downloadUrl(url) {
  const res = await fetch(url, { headers: HEADERS, timeout: 15000 });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function wikiThumbnail(title) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const res = await fetch(url, { headers: { 'User-Agent': HEADERS['User-Agent'] }, timeout: 10000 });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.originalimage?.source || data?.thumbnail?.source || null;
}

async function wikiCommonsFile(filename) {
  if (!filename) return null;
  const title = 'File:' + filename;
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json`;
  const res = await fetch(apiUrl, { headers: { 'User-Agent': HEADERS['User-Agent'] }, timeout: 10000 });
  if (!res.ok) return null;
  const data = await res.json();
  const pages = data?.query?.pages || {};
  for (const p of Object.values(pages)) {
    const url = p?.imageinfo?.[0]?.url;
    if (url) return url;
  }
  return null;
}

// ── Main ──────────────────────────────────────────────────────────────────────
(async () => {
  let ok = 0, fail = 0;
  const failed = [];

  // 1 — Direct URL downloads (all places)
  console.log('\n── Downloading all missing images ──────────────────────────────');
  for (const [fname, url] of Object.entries(DIRECT_URLS)) {
    const dest = path.join(IMAGES_DIR, fname);
    if (fs.existsSync(dest)) { console.log(`  ⏭  ${fname} already exists`); ok++; continue; }
    try {
      const buf = await downloadUrl(url);
      await saveImage(dest, buf);
      console.log(`  ✅  ${fname}`);
      ok++;
    } catch(e) {
      console.log(`  ❌  ${fname}: ${e.message}`);
      fail++; failed.push(fname);
    }
  }

  // 2 — Wikipedia / Wikimedia Commons lookups
  console.log('\n── Wikipedia / Wikimedia lookups ───────────────────────────────');
  for (const [fname, [wikiTitle, commonsFile]] of Object.entries(WIKI_LOOKUPS)) {
    const dest = path.join(IMAGES_DIR, fname);
    if (fs.existsSync(dest)) { console.log(`  ⏭  ${fname} already exists`); ok++; continue; }

    let imgUrl = null;

    // Try Wikipedia article thumbnail first
    try { imgUrl = await wikiThumbnail(wikiTitle); } catch(e) {}

    // Fallback: try Wikimedia Commons named file
    if (!imgUrl && commonsFile) {
      try { imgUrl = await wikiCommonsFile(commonsFile); } catch(e) {}
    }

    if (!imgUrl) {
      console.log(`  ❌  ${fname} (${wikiTitle}): no image found`);
      fail++; failed.push(`${fname} — ${wikiTitle}`);
      continue;
    }

    try {
      const buf = await downloadUrl(imgUrl);
      await saveImage(dest, buf);
      console.log(`  ✅  ${fname}  ← ${wikiTitle}`);
      ok++;
    } catch(e) {
      console.log(`  ❌  ${fname}: ${e.message}`);
      fail++; failed.push(`${fname} — ${wikiTitle}`);
    }
  }

  // 3 — Force-replace wrong images (overwrites existing files)
  console.log('\n── Force-replacing wrong images ────────────────────────────────');
  for (const [fname, url] of Object.entries(FORCE_REPLACE)) {
    const dest = path.join(IMAGES_DIR, fname);
    try {
      const buf = await downloadUrl(url);
      await saveImage(dest, buf);
      console.log(`  ✅  ${fname}  (replaced)`);
      ok++;
    } catch(e) {
      console.log(`  ❌  ${fname}: ${e.message}`);
      fail++; failed.push(fname);
    }
  }

  // ── Summary ─────────────────────────────────────────────────────────────────
  console.log('\n════════════════════════════════════════');
  console.log(`  ✅ Downloaded: ${ok}`);
  console.log(`  ❌ Failed:     ${fail}`);
  if (failed.length) {
    console.log('\n  Add manually (save as place-N.jpg in images/):');
    failed.forEach(f => console.log('    ' + f));
  }
  console.log('════════════════════════════════════════\n');
})();
