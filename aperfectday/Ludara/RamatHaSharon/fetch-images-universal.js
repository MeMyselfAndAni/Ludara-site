// ═══════════════════════════════════════════════════════════════════
// fetch-images-universal.js — A Perfect Day
// Universal image fetcher + resizer for any city guide
//
// Run FROM the guide folder:
//   cd aperfectday\Ludara\RamatHaSharon
//   node fetch-images-universal.js
//
// Change only these 2 lines for each new city:
// ═══════════════════════════════════════════════════════════════════

const CITY    = 'Ramat HaSharon';
const COUNTRY = 'Israel';

// ── DEPENDENCIES ─────────────────────────────────────────────────
const https    = require('https');
const http     = require('http');
const fs       = require('fs');
const path     = require('path');
const readline = require('readline');

const OUTPUT_DIR = path.join(__dirname, 'images');

// ── LANGUAGE MAP ──────────────────────────────────────────────────
const LANGUAGE_MAP = {
  'Israel':         { code: 'he', name: 'Hebrew'     },
  'France':         { code: 'fr', name: 'French'     },
  'Thailand':       { code: 'th', name: 'Thai'       },
  'Mexico':         { code: 'es', name: 'Spanish'    },
  'Spain':          { code: 'es', name: 'Spanish'    },
  'Georgia':        { code: 'ka', name: 'Georgian'   },
  'Japan':          { code: 'ja', name: 'Japanese'   },
  'South Korea':    { code: 'ko', name: 'Korean'     },
  'Italy':          { code: 'it', name: 'Italian'    },
  'Germany':        { code: 'de', name: 'German'     },
  'Portugal':       { code: 'pt', name: 'Portuguese' },
  'Brazil':         { code: 'pt', name: 'Portuguese' },
  'Greece':         { code: 'el', name: 'Greek'      },
  'Turkey':         { code: 'tr', name: 'Turkish'    },
  'Czech Republic': { code: 'cs', name: 'Czech'      },
  'Poland':         { code: 'pl', name: 'Polish'     },
  'Netherlands':    { code: 'nl', name: 'Dutch'      },
  'United States':  { code: 'en', name: 'English'    },
  'UK':             { code: 'en', name: 'English'    },
  'Australia':      { code: 'en', name: 'English'    },
  'South Africa':   { code: 'en', name: 'English'    },
};

// ── LOAD PLACES FROM data.js ──────────────────────────────────────
function loadPlaces() {
  const dataPath = path.join(__dirname, 'data.js');
  if (!fs.existsSync(dataPath)) {
    console.error('ERROR: data.js not found in ' + __dirname);
    process.exit(1);
  }
  try {
    const code = fs.readFileSync(dataPath, 'utf8');
    eval(code.replace(/^const PLACES/m, 'var PLACES'));
    if (typeof PLACES !== 'undefined' && Array.isArray(PLACES)) return PLACES;
  } catch(e) {
    console.error('ERROR: Could not parse PLACES from data.js — ' + e.message);
    process.exit(1);
  }
  console.error('ERROR: PLACES array not found in data.js');
  process.exit(1);
}

// ── GOOGLE TRANSLATE (no API key needed) ──────────────────────────
function translate(text, targetLang) {
  return new Promise((resolve) => {
    if (targetLang === 'en') return resolve(null); // no translation needed
    const timer = setTimeout(() => resolve(null), 6000);
    const q = encodeURIComponent(text);
    const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=' + targetLang + '&dt=t&q=' + q;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        clearTimeout(timer);
        try {
          const parsed = JSON.parse(data);
          const result = parsed[0].map(seg => seg[0]).join('').trim();
          resolve(result || null);
        } catch(e) { resolve(null); }
      });
    }).on('error', () => { clearTimeout(timer); resolve(null); });
  });
}

// ── WEBSITE OG:IMAGE ─────────────────────────────────────────────
function fetchPage(url, langCode) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), 8000);
    try {
      const proto = url.startsWith('https') ? https : http;
      let data = '';
      const req = proto.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; APerfectDayGuide/1.0; +https://ludara.ai)',
          'Accept': 'text/html',
          'Accept-Language': langCode + ',en;q=0.8',
        },
      }, (res) => {
        if ([301, 302, 303].includes(res.statusCode) && res.headers.location) {
          clearTimeout(timer);
          return resolve(fetchPage(res.headers.location, langCode));
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
      if (u.startsWith('/')) { try { u = new URL(u, base).href; } catch(e) { continue; } }
      if (u.startsWith('http') && !u.match(/\.(svg|gif)/i)) return u;
    }
  }
  return null;
}

// ── WIKIMEDIA SEARCH ─────────────────────────────────────────────
function searchWikimedia(query) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), 8000);
    const q = encodeURIComponent('filetype:bitmap ' + query);
    const url = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=' + q + '&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url&iiurlwidth=1200&format=json';
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

// ── DOWNLOAD IMAGE ────────────────────────────────────────────────
function download(imgUrl, dest, hops) {
  return new Promise((resolve) => {
    if (hops <= 0) return resolve(false);
    const timer = setTimeout(() => { resolve(false); }, 20000);
    const proto = imgUrl.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    const req = proto.get(imgUrl, {
      headers: { 'User-Agent': 'APerfectDayGuide/1.0 (ludara.ai; contact@ludara.ai)' }
    }, (res) => {
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
        if (size < 10000) { fs.unlink(dest, () => {}); return resolve(false); }
        resolve(true);
      });
    });
    req.on('error', () => { clearTimeout(timer); file.close(); fs.unlink(dest, () => {}); resolve(false); });
  });
}

// ── RESIZE (uses sharp from general/_scripts/node_modules) ────────
async function resizeImages() {
  let sharp;
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
    console.log('  Run manually: node ..\\..\\general\\_scripts\\resize-images.js .');
    return;
  }

  const MAX_SIZE = 600;
  const files = fs.readdirSync(OUTPUT_DIR)
    .filter(f => /^place-\d+\.(jpe?g|png|webp)$/i.test(f))
    .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));

  if (!files.length) { console.log('  No images found to resize.'); return; }

  console.log('  Resizing ' + files.length + ' images (max ' + MAX_SIZE + 'px)...\n');
  let resized = 0, skipped = 0, failed = 0;

  for (const file of files) {
    const filepath = path.join(OUTPUT_DIR, file);
    try {
      const meta = await sharp(filepath).metadata();
      if (meta.width <= MAX_SIZE && meta.height <= MAX_SIZE) {
        console.log('  ✓ ' + file + ' (' + meta.width + 'x' + meta.height + ') — already small');
        skipped++; continue;
      }
      const tmpPath = filepath + '.tmp';
      await sharp(filepath)
        .resize(MAX_SIZE, MAX_SIZE, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85, progressive: true })
        .toFile(tmpPath);
      const newMeta = await sharp(tmpPath).metadata();
      fs.renameSync(tmpPath, filepath);
      const kb = Math.round(fs.statSync(filepath).size / 1024);
      console.log('  ✓ ' + file + '  ' + meta.width + 'x' + meta.height + ' → ' + newMeta.width + 'x' + newMeta.height + ' (' + kb + 'KB)');
      resized++;
    } catch(err) {
      console.error('  ✗ ' + file + ' — ' + err.message);
      failed++;
    }
  }
  console.log('\n  Resize: ' + resized + ' resized · ' + skipped + ' already small · ' + failed + ' failed');
}

// ── CONFIRM PROMPT ────────────────────────────────────────────────
function confirm(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => { rl.close(); resolve(answer.trim().toLowerCase()); });
  });
}

// ── MAIN ─────────────────────────────────────────────────────────
async function run() {
  const PLACES = loadPlaces();
  const lang = LANGUAGE_MAP[COUNTRY] || { code: 'en', name: 'English' };

  console.log('\n══════════════════════════════════════════════════');
  console.log('  A Perfect Day — Universal Image Fetcher');
  console.log('══════════════════════════════════════════════════');
  console.log('  City:     ' + CITY);
  console.log('  Country:  ' + COUNTRY);
  console.log('  Language: ' + lang.name + ' (' + lang.code + ')');
  console.log('  Places:   ' + PLACES.length);
  console.log('  Output:   ' + OUTPUT_DIR);
  if (!LANGUAGE_MAP[COUNTRY]) {
    console.log('  ⚠️  "' + COUNTRY + '" not in language map — will search in English only.');
    console.log('  Add it to LANGUAGE_MAP at the top of this script if needed.');
  }
  console.log('──────────────────────────────────────────────────');

  const answer = await confirm('  Proceed? (y to continue, any other key to abort): ');
  if (answer !== 'y' && answer !== 'yes') {
    console.log('  Aborted.\n'); process.exit(0);
  }

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Pre-translate place names to local language
  const translations = {};
  if (lang.code !== 'en') {
    console.log('\n  Translating place names to ' + lang.name + '...\n');
    for (const place of PLACES) {
      const t = await translate(place.name + ' ' + CITY, lang.code);
      translations[place.id] = t;
      console.log('  ' + place.name + ' → ' + (t || '(failed, using English)'));
      await new Promise(r => setTimeout(r, 150));
    }
  }

  console.log('\n  Fetching images...\n');
  const results = { ok: [], skipped: [], failed: [] };

  for (const place of PLACES) {
    const dest = path.join(OUTPUT_DIR, 'place-' + place.id + '.jpg');

    if (fs.existsSync(dest) && fs.statSync(dest).size > 10000) {
      console.log('place-' + place.id + ' ' + place.name + ': ⏭  exists');
      results.skipped.push(place.name);
      continue;
    }

    console.log('place-' + place.id + ': ' + place.name);
    let imgUrl = null;

    // Stage 1: place website og:image
    if (place.website) {
      process.stdout.write('  → website og:image... ');
      const html = await fetchPage(place.website, lang.code);
      if (html) imgUrl = extractOgImage(html, place.website);
      console.log(imgUrl ? '✓ found' : 'not found');
    }

    // Stage 2: Wikimedia in local language
    if (!imgUrl && lang.code !== 'en' && translations[place.id]) {
      process.stdout.write('  → Wikimedia [' + lang.code.toUpperCase() + '] "' + translations[place.id] + '"... ');
      imgUrl = await searchWikimedia(translations[place.id]);
      console.log(imgUrl ? '✓ found' : 'not found');
    }

    // Stage 3: Wikimedia English name + city
    if (!imgUrl) {
      const q = place.name + ' ' + CITY;
      process.stdout.write('  → Wikimedia [EN] "' + q + '"... ');
      imgUrl = await searchWikimedia(q);
      console.log(imgUrl ? '✓ found' : 'not found');
    }

    // Stage 4: Wikimedia place type as generic fallback
    if (!imgUrl && place.type) {
      process.stdout.write('  → fallback "' + place.type + '"... ');
      imgUrl = await searchWikimedia(place.type);
      console.log(imgUrl ? '✓ found' : 'not found');
    }

    if (!imgUrl) {
      console.log('  ❌ no image found\n');
      results.failed.push({ id: place.id, name: place.name });
      continue;
    }

    process.stdout.write('  → downloading... ');
    const success = await download(imgUrl, dest, 5);
    if (success) {
      console.log('✅ ' + Math.round(fs.statSync(dest).size / 1024) + 'KB\n');
      results.ok.push(place.name);
    } else {
      console.log('❌ download failed\n');
      results.failed.push({ id: place.id, name: place.name });
    }
    await new Promise(r => setTimeout(r, 300));
  }

  // ── RESIZE ───────────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════════════════');
  console.log('  RESIZE');
  console.log('══════════════════════════════════════════════════');
  await resizeImages();

  // ── SUMMARY ──────────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════════════════');
  console.log('  SUMMARY');
  console.log('══════════════════════════════════════════════════');
  console.log('  ✅ Downloaded:   ' + results.ok.length);
  console.log('  ⏭  Already had: ' + results.skipped.length);
  console.log('  ❌ Failed:       ' + results.failed.length);
  if (results.failed.length > 0) {
    console.log('\n  Failed — add images manually:');
    results.failed.forEach(p => {
      console.log('    place-' + p.id + '.jpg  →  ' + p.name);
    });
    console.log('\n  Save any JPG as place-N.jpg in the images/ folder.');
  } else {
    console.log('\n  All images fetched and resized successfully!');
  }
  console.log('══════════════════════════════════════════════════\n');
}

run();
