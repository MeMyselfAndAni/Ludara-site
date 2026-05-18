// ═══════════════════════════════════════════════════════════════════
// fetch-images-universal.js — A Perfect Day
// Exact-match image fetcher: searches Wikimedia by exact place name
// only. No generic fallbacks. Places not found go to needs_images.txt
// for manual image supply.
//
// Run FROM the guide folder:
//   cd HolyLandWithMaria
//   node fetch-images-universal.js
//
// Vision verification (recommended):
//   set ANTHROPIC_API_KEY=sk-ant-...   (Windows)
//   export ANTHROPIC_API_KEY=sk-ant-... (Mac/Linux)
//   Without it, the first downloadable result is accepted.
//
// Provide your own images:
//   Copy any JPG as images/place-N.jpg before running.
//   The script detects and skips those automatically.
//
// Change only these 2 lines for each guide:
// ═══════════════════════════════════════════════════════════════════

const CITY    = 'Israel';
const COUNTRY = 'Israel';

// ── DEPENDENCIES ─────────────────────────────────────────────────
const https    = require('https');
const http     = require('http');
const fs       = require('fs');
const path     = require('path');
const readline = require('readline');

const OUTPUT_DIR = path.join(__dirname, 'images');
const API_KEY    = process.env.ANTHROPIC_API_KEY || '';
const FORCE      = process.argv.includes('--force');
const SKIP_IDS   = (process.argv.find(a => a.startsWith('--skip=')) || '')
  .replace('--skip=', '').split(',').map(Number).filter(Boolean);

// ── CACHE ─────────────────────────────────────────────────────────
const CACHE_FILE = path.join(OUTPUT_DIR, '.verified.json');

function loadCache() {
  try { if (fs.existsSync(CACHE_FILE)) return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')); } catch(e) {}
  return {};
}
function saveCache(cache) {
  try { fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2)); } catch(e) {}
}
function isCached(cache, id) {
  return cache[String(id)]?.ok === true;
}
function markCached(cache, id) {
  cache[String(id)] = { ok: true, ts: Date.now() };
}

// ── DETECT HEBREW SCRIPT ──────────────────────────────────────────
function isHebrew(text) {
  return /[א-׿]/.test(text);
}

// ── LOAD PLACES ───────────────────────────────────────────────────
function loadPlaces() {
  const dataPath = path.join(__dirname, 'data.js');
  if (!fs.existsSync(dataPath)) { console.error('ERROR: data.js not found'); process.exit(1); }
  try {
    const code = fs.readFileSync(dataPath, 'utf8');
    eval(code.replace(/^const PLACES/m, 'var PLACES'));
    if (Array.isArray(PLACES)) return PLACES;
  } catch(e) { console.error('ERROR parsing data.js: ' + e.message); process.exit(1); }
  process.exit(1);
}

// ── GOOGLE TRANSLATE ──────────────────────────────────────────────
function translate(text, targetLang) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), 5000);
    const q = encodeURIComponent(text);
    const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=' + targetLang + '&dt=t&q=' + q;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        clearTimeout(timer);
        try { resolve(JSON.parse(d)[0].map(s => s[0]).join('').trim() || null); }
        catch(e) { resolve(null); }
      });
    }).on('error', () => { clearTimeout(timer); resolve(null); });
  });
}

// ── WIKIMEDIA SEARCH — top N results ─────────────────────────────
function searchWikimedia(query, limit) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve([]), 8000);
    const q = encodeURIComponent(query);
    const url = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search'
      + '&gsrsearch=' + q + '&gsrnamespace=6&gsrlimit=' + limit
      + '&prop=imageinfo&iiprop=url&iiurlwidth=1200&format=json';
    https.get(url, { headers: { 'User-Agent': 'APerfectDayGuide/1.0 (ludara.ai)' } }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        clearTimeout(timer);
        try {
          const pages = JSON.parse(d)?.query?.pages;
          if (!pages) return resolve([]);
          const urls = Object.values(pages)
            .map(p => p.imageinfo?.[0]?.thumburl || p.imageinfo?.[0]?.url)
            .filter(u => u && !u.match(/\.(svg|gif)/i));
          resolve(urls);
        } catch(e) { resolve([]); }
      });
    }).on('error', () => { clearTimeout(timer); resolve([]); });
  });
}

// ── DOWNLOAD ──────────────────────────────────────────────────────
function download(imgUrl, dest, hops) {
  return new Promise((resolve) => {
    if (hops <= 0) return resolve(false);
    const timer = setTimeout(() => resolve(false), 15000);
    const proto = imgUrl.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    const req = proto.get(imgUrl, { headers: { 'User-Agent': 'APerfectDayGuide/1.0' } }, (res) => {
      if ([301, 302, 303].includes(res.statusCode) && res.headers.location) {
        clearTimeout(timer); file.close(); fs.unlink(dest, () => {});
        return resolve(download(res.headers.location, dest, hops - 1));
      }
      if (res.statusCode !== 200) {
        clearTimeout(timer); file.close(); fs.unlink(dest, () => {});
        return resolve(false);
      }
      res.pipe(file);
      file.on('finish', () => {
        clearTimeout(timer); file.close();
        const size = fs.existsSync(dest) ? fs.statSync(dest).size : 0;
        if (size < 8000) { fs.unlink(dest, () => {}); return resolve(false); }
        resolve(true);
      });
    });
    req.on('error', () => { clearTimeout(timer); file.close(); fs.unlink(dest, () => {}); resolve(false); });
  });
}

// ── WEBSITE OG:IMAGE ─────────────────────────────────────────────
function fetchOgImage(url) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), 7000);
    const proto = url.startsWith('https') ? https : http;
    let data = '';
    const req = proto.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'text/html' }
    }, (res) => {
      if ([301,302,303].includes(res.statusCode) && res.headers.location) {
        clearTimeout(timer); return resolve(fetchOgImage(res.headers.location));
      }
      res.setEncoding('utf8');
      res.on('data', d => { data += d; if (data.length > 100000) req.destroy(); });
      res.on('end', () => {
        clearTimeout(timer);
        const patterns = [
          /property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
          /content=["']([^"']+)["'][^>]*property=["']og:image["']/i,
        ];
        for (const p of patterns) {
          const m = data.match(p);
          if (m?.[1]) {
            let u = m[1].trim();
            if (u.startsWith('//')) u = 'https:' + u;
            if (u.startsWith('/')) { try { u = new URL(u, url).href; } catch(e) { continue; } }
            if (u.startsWith('http') && !u.match(/\.(svg|gif)/i)) return resolve(u);
          }
        }
        resolve(null);
      });
    });
    req.on('error', () => { clearTimeout(timer); resolve(null); });
  });
}

// ── CLAUDE VISION VERIFY ──────────────────────────────────────────
function verifyImage(imagePath, placeName) {
  return new Promise((resolve) => {
    if (!API_KEY) return resolve(true);
    let imageData;
    try { imageData = fs.readFileSync(imagePath).toString('base64'); }
    catch(e) { return resolve(true); }

    const prompt = 'Does this image show "' + placeName + '" specifically — a recognisable photo of '
      + 'this exact place, building, site, or its food/interior? '
      + 'Reject generic stock photos, random landscapes, or images of unrelated places. '
      + 'Reply only: MATCH or MISMATCH';

    const body = JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 10,
      messages: [{ role: 'user', content: [
        { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageData } },
        { type: 'text', text: prompt }
      ]}]
    });

    const timer = setTimeout(() => resolve(true), 15000);
    const req = https.request({
      hostname: 'api.anthropic.com', path: '/v1/messages', method: 'POST',
      headers: {
        'Content-Type': 'application/json', 'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01', 'Content-Length': Buffer.byteLength(body),
      }
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        clearTimeout(timer);
        try {
          const text = (JSON.parse(d).content?.[0]?.text || '').trim().toUpperCase();
          resolve(!text.includes('MISMATCH'));
        } catch(e) { resolve(true); }
      });
    });
    req.on('error', () => { clearTimeout(timer); resolve(true); });
    req.write(body); req.end();
  });
}

// ── FETCH ONE PLACE ───────────────────────────────────────────────
async function fetchPlace(place) {
  const dest = path.join(OUTPUT_DIR, 'place-' + place.id + '.jpg');
  const tmp  = path.join(OUTPUT_DIR, '_tmp.jpg');

  // Stage 1: website og:image
  if (place.website) {
    process.stdout.write('  → website... ');
    const imgUrl = await fetchOgImage(place.website);
    if (imgUrl) {
      const ok = await download(imgUrl, dest, 3);
      if (ok) {
        const match = await verifyImage(dest, place.name);
        if (match) { console.log('✅ website\n'); return true; }
        fs.unlink(dest, () => {});
      }
    }
    console.log('not found');
  }

  // Stage 2: Wikimedia — try English, English+Israel, Hebrew translation, Hebrew+ישראל
  const queries = [];
  if (isHebrew(place.name)) {
    // Hebrew name: search Hebrew first, then translate to English
    queries.push(place.name);
    queries.push(place.name + ' ישראל');
    const english = await translate(place.name, 'en');
    if (english && english !== place.name) {
      queries.push(english);
      queries.push(english + ' Israel');
    }
  } else {
    // English name: search English first, then translate to Hebrew
    queries.push(place.name);
    queries.push(place.name + ' Israel');
    const hebrew = await translate(place.name, 'he');
    if (hebrew && hebrew !== place.name) {
      queries.push(hebrew);
      queries.push(hebrew + ' ישראל');
    }
  }

  for (const query of queries) {
    process.stdout.write('  → Wikimedia "' + query.slice(0, 45) + '"... ');
    const urls = await searchWikimedia(query, 5);   // top 5 results
    if (!urls.length) { console.log('0 results'); continue; }

    let found = false;
    for (let i = 0; i < urls.length; i++) {
      const ok = await download(urls[i], tmp, 3);
      if (!ok) continue;
      process.stdout.write('checking #' + (i+1) + '... ');
      const match = await verifyImage(tmp, place.name);
      if (match) {
        try { fs.renameSync(tmp, dest); }
        catch(e) { fs.copyFileSync(tmp, dest); fs.unlink(tmp, () => {}); }
        const kb = Math.round(fs.statSync(dest).size / 1024);
        console.log('✅ ' + kb + 'KB\n');
        found = true;
        break;
      }
      fs.unlink(tmp, () => {});
    }
    if (found) return true;
    console.log('no match');
  }

  console.log('  ❌ not found — add manually as place-' + place.id + '.jpg\n');
  return false;
}

// ── RESIZE ────────────────────────────────────────────────────────
async function resizeImages() {
  let sharp;
  for (const p of ['sharp',
    path.join(__dirname,'..','..','general','_scripts','node_modules','sharp'),
    path.join(__dirname,'..','..','..','general','_scripts','node_modules','sharp')
  ]) { try { sharp = require(p); break; } catch(e) {} }

  if (!sharp) { console.log('  ⚠️  sharp not found — skipping resize (run: npm install sharp)'); return; }

  const MAX = 600;
  const files = fs.readdirSync(OUTPUT_DIR)
    .filter(f => /^place-\d+\.(jpe?g|png|webp)$/i.test(f))
    .sort((a,b) => parseInt(a)-parseInt(b));

  let resized = 0, skipped = 0;
  for (const file of files) {
    const fp = path.join(OUTPUT_DIR, file);
    try {
      const meta = await sharp(fp).metadata();
      if (meta.width <= MAX && meta.height <= MAX) { skipped++; continue; }
      const tmp = fp + '.tmp';
      await sharp(fp).resize(MAX,MAX,{fit:'inside',withoutEnlargement:true})
        .jpeg({quality:85,progressive:true}).toFile(tmp);
      fs.renameSync(tmp, fp);
      resized++;
    } catch(e) {}
  }
  console.log('  Resize: ' + resized + ' resized, ' + skipped + ' already small');
}

// ── CONFIRM ───────────────────────────────────────────────────────
function confirm(q) {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(q, a => { rl.close(); resolve(a.trim().toLowerCase()); });
  });
}

// ── MAIN ─────────────────────────────────────────────────────────
async function run() {
  const PLACES = loadPlaces();
  const cache  = loadCache();

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  if (FORCE && fs.existsSync(CACHE_FILE)) { fs.unlinkSync(CACHE_FILE); console.log('Cache cleared.'); }

  console.log('\n══════════════════════════════════════════════════');
  console.log('  A Perfect Day — Image Fetcher (exact match only)');
  console.log('══════════════════════════════════════════════════');
  console.log('  Places:   ' + PLACES.length);
  console.log('  Verify:   ' + (API_KEY ? '✅ Claude vision active' : '⚠️  no API key — first result accepted'));
  console.log('  Strategy: English → English+Israel → Hebrew → Hebrew+ישראל → Wikimedia (top 5)');
  console.log('  Manual:   drop your photo as images/place-N.jpg');
  if (SKIP_IDS.length) console.log('  Skipping: ' + SKIP_IDS.join(', '));
  console.log('──────────────────────────────────────────────────');

  const answer = await confirm('  Proceed? (y / n): ');
  if (answer !== 'y' && answer !== 'yes') { console.log('Aborted.'); process.exit(0); }

  const failed = [];
  let fetched = 0, manual = 0, skipped = 0;

  for (const place of PLACES) {
    if (SKIP_IDS.includes(place.id)) { skipped++; continue; }

    const dest = path.join(OUTPUT_DIR, 'place-' + place.id + '.jpg');

    // Already have an image (manual or previously fetched)
    if (fs.existsSync(dest) && fs.statSync(dest).size > 8000) {
      if (isCached(cache, place.id) && !FORCE) {
        process.stdout.write('place-' + place.id + ' ✅ (cached)\n');
        skipped++;
        continue;
      }
      // Image exists but not in cache — could be manual, mark as ok
      markCached(cache, place.id);
      saveCache(cache);
      process.stdout.write('place-' + place.id + ' ✅ (existing)\n');
      manual++;
      continue;
    }

    console.log('place-' + place.id + ': ' + place.name);
    const ok = await fetchPlace(place);
    if (ok) {
      fetched++;
      markCached(cache, place.id);
      saveCache(cache);
    } else {
      failed.push(place);
    }

    await new Promise(r => setTimeout(r, 150)); // small pause — polite to APIs
  }

  // Resize
  console.log('\n══════════════════════════════════════════════════');
  console.log('  RESIZE');
  console.log('══════════════════════════════════════════════════');
  await resizeImages();

  // Summary
  console.log('\n══════════════════════════════════════════════════');
  console.log('  SUMMARY');
  console.log('══════════════════════════════════════════════════');
  console.log('  ✅ Fetched:      ' + fetched);
  console.log('  📁 Already had: ' + (skipped + manual));
  console.log('  ❌ Need manual: ' + failed.length);

  // Write needs_images.txt
  if (failed.length > 0) {
    const lines = ['# Places needing manual images', '# Copy your photo as images/place-N.jpg then rerun', ''];
    failed.forEach(p => lines.push('place-' + p.id + '.jpg\t' + p.name + (p.note ? '\t' + p.note.slice(0,60) : '')));
    const outFile = path.join(__dirname, 'needs_images.txt');
    fs.writeFileSync(outFile, lines.join('\n'), 'utf8');
    console.log('\n  List saved to needs_images.txt');
    console.log('  Drop your photos as images/place-N.jpg and rerun.');
  } else {
    console.log('\n  All places have images!');
  }
  console.log('══════════════════════════════════════════════════\n');
}

run();
