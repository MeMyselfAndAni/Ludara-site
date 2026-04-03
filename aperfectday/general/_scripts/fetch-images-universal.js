// ═══════════════════════════════════════════════════════════════════
// fetch-images-universal.js — A Perfect Day
// Universal image fetcher for any city guide
//
// Run FROM the guide folder:
//   cd aperfectday\Ludara\RamatHaSharon
//   node fetch-images-universal.js
//
// The script:
//   1. Reads place names from your data.js automatically
//   2. Detects the local language from city/country
//   3. Asks you to confirm before starting
//   4. Searches in local language first, then English fallback
//   5. Downloads images and reports what failed by name
// ═══════════════════════════════════════════════════════════════════

const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');
const readline = require('readline');

// ── CONFIG: set these two lines for each city ─────────────────────
const CITY    = 'Ramat HaSharon';   // used for searching
const COUNTRY = 'Israel';           // used for language detection
// ─────────────────────────────────────────────────────────────────

const OUTPUT_DIR = path.join(__dirname, 'images');

// ── LANGUAGE MAP ─────────────────────────────────────────────────
// country → { code, name, rtl }
const LANGUAGE_MAP = {
  'Israel':        { code: 'he', name: 'Hebrew',     rtl: true  },
  'France':        { code: 'fr', name: 'French',     rtl: false },
  'Thailand':      { code: 'th', name: 'Thai',       rtl: false },
  'Mexico':        { code: 'es', name: 'Spanish',    rtl: false },
  'Spain':         { code: 'es', name: 'Spanish',    rtl: false },
  'Georgia':       { code: 'ka', name: 'Georgian',   rtl: false },
  'Japan':         { code: 'ja', name: 'Japanese',   rtl: false },
  'South Korea':   { code: 'ko', name: 'Korean',     rtl: false },
  'Italy':         { code: 'it', name: 'Italian',    rtl: false },
  'Germany':       { code: 'de', name: 'German',     rtl: false },
  'Portugal':      { code: 'pt', name: 'Portuguese', rtl: false },
  'Brazil':        { code: 'pt', name: 'Portuguese', rtl: false },
  'Greece':        { code: 'el', name: 'Greek',      rtl: false },
  'Turkey':        { code: 'tr', name: 'Turkish',    rtl: false },
  'Czech Republic':{ code: 'cs', name: 'Czech',      rtl: false },
  'Poland':        { code: 'pl', name: 'Polish',     rtl: false },
  'Netherlands':   { code: 'nl', name: 'Dutch',      rtl: false },
  'United States': { code: 'en', name: 'English',    rtl: false },
  'UK':            { code: 'en', name: 'English',    rtl: false },
  'Australia':     { code: 'en', name: 'English',    rtl: false },
  'South Africa':  { code: 'en', name: 'English',    rtl: false },
};

// ── LOAD PLACES FROM data.js ──────────────────────────────────────
function loadPlaces() {
  const dataPath = path.join(__dirname, 'data.js');
  if (!fs.existsSync(dataPath)) {
    console.error('ERROR: data.js not found in', __dirname);
    process.exit(1);
  }
  const code = fs.readFileSync(dataPath, 'utf8');
  // Execute data.js to get PLACES array
  const mod = { exports: {} };
  try {
    eval(code.replace(/^const PLACES/m, 'var PLACES') + '\nmodule.exports = PLACES;');
    if (typeof PLACES !== 'undefined') return PLACES;
  } catch(e) {}
  // Fallback: extract with regex
  const match = code.match(/const PLACES\s*=\s*(\[[\s\S]*?\]);/);
  if (match) {
    try { return eval(match[1]); } catch(e) {}
  }
  console.error('ERROR: Could not parse PLACES from data.js');
  process.exit(1);
}

// ── TRANSLATE via Google Translate (no key needed) ────────────────
function translate(text, targetLang) {
  return new Promise((resolve) => {
    if (targetLang === 'en') return resolve(text); // already English
    const timer = setTimeout(() => resolve(null), 6000);
    const q = encodeURIComponent(text);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${q}`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        clearTimeout(timer);
        try {
          const parsed = JSON.parse(data);
          const translated = parsed[0].map(seg => seg[0]).join('');
          resolve(translated || null);
        } catch(e) { resolve(null); }
      });
    }).on('error', () => { clearTimeout(timer); resolve(null); });
  });
}

// ── WEBSITE OG:IMAGE FETCH ────────────────────────────────────────
function safeFetch(url, langCode) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), 8000);
    try {
      const proto = url.startsWith('https') ? https : http;
      let data = '';
      const req = proto.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; APerfectDayGuide/1.0; +https://ludara.ai)',
          'Accept': 'text/html',
          'Accept-Language': `${langCode},en;q=0.8`,
        },
      }, (res) => {
        if ([301,302,303].includes(res.statusCode) && res.headers.location) {
          clearTimeout(timer);
          return resolve(safeFetch(res.headers.location, langCode));
        }
        res.setEncoding('utf8');
        res.on('data', d => { data += d; if (data.length > 200000) req.destroy(); });
        res.on('end', () => { clearTimeout(timer); resolve(data); });
      });
      req.on('error', () => { clearTimeout(timer); resolve(null); });
    } catch(e) { clearTimeout(timer); resolve(null); }
  });
}

function extractOgImage(html, base) {
  const patterns = [
    /property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]*property=["']og:image["']/i,
    /name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m && m[1]) {
      let u = m[1].trim();
      if (u.startsWith('//')) u = 'https:' + u;
      if (u.startsWith('/')) { try { u = new URL(u, base).href; } catch(e){} }
      if (u.startsWith('http') && !u.match(/\.(svg|gif)/i)) return u;
    }
  }
  return null;
}

// ── WIKIMEDIA SEARCH ──────────────────────────────────────────────
function searchWikimedia(query) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), 8000);
    const q = encodeURIComponent('filetype:bitmap ' + query);
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${q}&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url&iiurlwidth=1200&format=json`;
    https.get(url, { headers: { 'User-Agent': 'APerfectDayGuide/1.0 (ludara.ai; contact@ludara.ai)' } }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        clearTimeout(timer);
        try {
          const pages = JSON.parse(data)?.query?.pages;
          if (!pages) return resolve(null);
          for (const page of Object.values(pages)) {
            const u = page.imageinfo?.[0]?.thumburl || page.imageinfo?.[0]?.url;
            if (u && !u.match(/\.(svg|gif)/i)) return resolve(u);
          }
          resolve(null);
        } catch(e) { resolve(null); }
      });
    }).on('error', () => { clearTimeout(timer); resolve(null); });
  });
}

// ── DOWNLOAD ──────────────────────────────────────────────────────
function download(imgUrl, dest, hops) {
  return new Promise((resolve) => {
    if (hops <= 0) return resolve(false);
    const timer = setTimeout(() => resolve(false), 20000);
    const proto = imgUrl.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    const req = proto.get(imgUrl, {
      headers: { 'User-Agent': 'APerfectDayGuide/1.0 (ludara.ai; contact@ludara.ai)' }
    }, (res) => {
      if ([301,302,303].includes(res.statusCode) && res.headers.location) {
        clearTimeout(timer); file.close(); fs.unlink(dest, ()=>{});
        return resolve(download(res.headers.location, dest, hops-1));
      }
      if (res.statusCode !== 200) {
        clearTimeout(timer); file.close(); fs.unlink(dest, ()=>{}); return resolve(false);
      }
      res.pipe(file);
      file.on('finish', () => {
        clearTimeout(timer); file.close();
        const size = fs.existsSync(dest) ? fs.statSync(dest).size : 0;
        if (size < 10000) { fs.unlink(dest, ()=>{}); return resolve(false); }
        resolve(true);
      });
    });
    req.on('error', () => { clearTimeout(timer); file.close(); fs.unlink(dest, ()=>{}); resolve(false); });
  });
}

// ── CONFIRM PROMPT ────────────────────────────────────────────────
function confirm(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

// ── MAIN ──────────────────────────────────────────────────────────
async function run() {
  const PLACES = loadPlaces();
  const lang = LANGUAGE_MAP[COUNTRY] || { code: 'en', name: 'English', rtl: false };

  console.log('\n══════════════════════════════════════════════════');
  console.log('  A Perfect Day — Universal Image Fetcher');
  console.log('══════════════════════════════════════════════════');
  console.log(`  City:     ${CITY}`);
  console.log(`  Country:  ${COUNTRY}`);
  console.log(`  Language: ${lang.name} (${lang.code})`);
  console.log(`  Places:   ${PLACES.length}`);
  console.log(`  Output:   ${path.join(__dirname, 'images')}`);
  console.log('──────────────────────────────────────────────────');

  if (lang.code === 'en') {
    console.log('  ℹ️  English-speaking country — searching in English only');
  } else {
    console.log(`  ✓ Will search in ${lang.name} first, then English fallback`);
  }

  // Ask user to confirm language
  if (!LANGUAGE_MAP[COUNTRY]) {
    console.log(`\n  ⚠️  Country "${COUNTRY}" not in language map.`);
  }
  const answer = await confirm('\n  Proceed? (y/n): ');
  if (answer !== 'y' && answer !== 'yes' && answer !== '') {
    console.log('  Aborted.\n'); process.exit(0);
  }

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log('\n  Translating place names to ' + lang.name + '...\n');

  // Pre-translate all place names if not English
  const translations = {};
  if (lang.code !== 'en') {
    for (const place of PLACES) {
      const translated = await translate(`${place.name} ${CITY}`, lang.code);
      translations[place.id] = translated;
      if (translated) {
        console.log(`  ${place.name} → ${translated}`);
      } else {
        console.log(`  ${place.name} → (translation failed, using English)`);
      }
      await new Promise(r => setTimeout(r, 200));
    }
  }

  console.log('\n  Starting image fetch...\n');
  const results = { ok: [], skipped: [], failed: [] };

  for (const place of PLACES) {
    const dest = path.join(OUTPUT_DIR, `place-${place.id}.jpg`);

    if (fs.existsSync(dest) && fs.statSync(dest).size > 10000) {
      console.log(`place-${place.id} ${place.name}: ⏭  exists`);
      results.skipped.push(place.name);
      continue;
    }

    console.log(`place-${place.id}: ${place.name}`);
    let imgUrl = null;

    // Stage 1: place website og:image
    if (place.website) {
      process.stdout.write(`  → website og:image... `);
      const html = await safeFetch(place.website, lang.code);
      if (html) imgUrl = extractOgImage(html, place.website);
      console.log(imgUrl ? '✓ found' : 'not found');
    }

    // Stage 2: Wikimedia — local language (translated name + city)
    if (!imgUrl && lang.code !== 'en' && translations[place.id]) {
      process.stdout.write(`  → Wikimedia [${lang.code.toUpperCase()}] "${translations[place.id]}"... `);
      imgUrl = await searchWikimedia(translations[place.id]);
      console.log(imgUrl ? '✓ found' : 'not found');
    }

    // Stage 3: Wikimedia — English name + city
    if (!imgUrl) {
      const q = `${place.name} ${CITY}`;
      process.stdout.write(`  → Wikimedia [EN] "${q}"... `);
      imgUrl = await searchWikimedia(q);
      console.log(imgUrl ? '✓ found' : 'not found');
    }

    // Stage 4: Wikimedia — place type as generic fallback
    if (!imgUrl && place.type) {
      process.stdout.write(`  → fallback "${place.type}"... `);
      imgUrl = await searchWikimedia(place.type);
      console.log(imgUrl ? '✓ found' : 'not found');
    }

    if (!imgUrl) {
      console.log(`  ❌ no image found\n`);
      results.failed.push({ id: place.id, name: place.name });
      continue;
    }

    process.stdout.write(`  → downloading... `);
    const success = await download(imgUrl, dest, 5);
    if (success) {
      console.log(`✅ ${Math.round(fs.statSync(dest).size / 1024)}KB\n`);
      results.ok.push(place.name);
    } else {
      console.log(`❌ download failed\n`);
      results.failed.push({ id: place.id, name: place.name });
    }
    await new Promise(r => setTimeout(r, 300));
  }

  // ── RESIZE ─────────────────────────────────────────────────────
  console.log('══════════════════════════════════════════════════');
  console.log('  RESIZE');
  console.log('══════════════════════════════════════════════════');
  await resizeImages();

  // ── SUMMARY ────────────────────────────────────────────────────
  console.log('══════════════════════════════════════════════════');
  console.log(`  ✅ Downloaded:   ${results.ok.length}`);
  console.log(`  ⏭  Already had: ${results.skipped.length}`);
  console.log(`  ❌ Failed:       ${results.failed.length}`);

  if (results.failed.length > 0) {
    console.log('\n  Failed — add images manually:');
    results.failed.forEach(p => {
      console.log(`    place-${p.id}.jpg  →  ${p.name}`);
    });
    console.log('\n  Save any JPG as place-N.jpg in the images/ folder,');
    console.log('  then re-run resize-images.js');
  } else {
    console.log('\n  All images fetched successfully!');
  }

  console.log('══════════════════════════════════════════════════\n');
}

run();

// ══════════════════════════════════════════════════════════════════
// RESIZE — integrated from resize-images.js
// Runs automatically after fetch completes. No separate step needed.
// ══════════════════════════════════════════════════════════════════

async function resizeImages() {
  let sharp;
  // Look for sharp in local node_modules, then in general/_scripts/node_modules
  const sharpPaths = [
    'sharp',
    path.join(__dirname, '..', '..', 'general', '_scripts', 'node_modules', 'sharp'),
    path.join(__dirname, '..', '..', '..', 'general', '_scripts', 'node_modules', 'sharp'),
  ];
  for (const p of sharpPaths) {
    try { sharp = require(p); break; } catch(e) {}
  }
  if (!sharp) {
    console.log('  ⚠️  sharp not found — skipping resize.');
    console.log('  Fix: cd general\\_scripts && npm install sharp');
    console.log('  Then re-run this script.\n');
    return;
  }

  const MAX_SIZE = 600;
  const files = fs.readdirSync(OUTPUT_DIR)
    .filter(f => /^place-\d+\.(jpe?g|png|webp)$/i.test(f))
    .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));

  if (!files.length) {
    console.log('  No images to resize.\n');
    return;
  }

  console.log(`\n  Resizing ${files.length} images (max ${MAX_SIZE}px)...\n`);
  let resized = 0, skipped = 0, failed = 0;

  for (const file of files) {
    const filepath = path.join(OUTPUT_DIR, file);
    try {
      const meta = await sharp(filepath).metadata();
      const { width, height } = meta;

      if (width <= MAX_SIZE && height <= MAX_SIZE) {
        console.log(`  ✓ ${file}  (${width}×${height}) — already small`);
        skipped++; continue;
      }

      const tmpPath = filepath + '.tmp';
      await sharp(filepath)
        .resize(MAX_SIZE, MAX_SIZE, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85, progressive: true })
        .toFile(tmpPath);

      const newMeta = await sharp(tmpPath).metadata();
      fs.renameSync(tmpPath, filepath);
      const kb = (fs.statSync(filepath).size / 1024).toFixed(0);
      console.log(`  ✓ ${file}  ${width}×${height} → ${newMeta.width}×${newMeta.height}  (${kb}KB)`);
      resized++;
    } catch(err) {
      console.error(`  ✗ ${file} — ${err.message}`);
      failed++;
    }
  }

  console.log('\n  ─────────────────────────────────────');
  console.log(`  Resize: ${resized} resized · ${skipped} already small · ${failed} failed`);
}
