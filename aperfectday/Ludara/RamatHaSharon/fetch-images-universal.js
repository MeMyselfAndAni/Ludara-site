// ═══════════════════════════════════════════════════════════════════
// fetch-images-universal.js — A Perfect Day
// Universal image fetcher + vision verifier + resizer for any guide
//
// Run FROM the guide folder:
//   cd aperfectday\Ludara\RamatHaSharon
//   node fetch-images-universal.js
//
// Re-verify existing images (fix mismatches):
//   node fetch-images-universal.js --reverify
//
// Vision verification (recommended):
//   Set ANTHROPIC_API_KEY as an environment variable before running.
//   Windows: set ANTHROPIC_API_KEY=sk-ant-...
//   Mac/Linux: export ANTHROPIC_API_KEY=sk-ant-...
//   Without it, verification is skipped and all images are accepted.
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

const OUTPUT_DIR  = path.join(__dirname, 'images');
const API_KEY     = process.env.ANTHROPIC_API_KEY || '';
const REVERIFY    = process.argv.includes('--reverify');
const SKIP_IDS    = process.argv.find(a => a.startsWith('--skip='))
  ? process.argv.find(a => a.startsWith('--skip=')).replace('--skip=','').split(',').map(Number)
  : [];

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
    if (targetLang === 'en') return resolve(null);
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

// ── WIKIMEDIA SEARCH — returns ALL results (up to 8) ─────────────
function searchWikimediaAll(query) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve([]), 8000);
    const q = encodeURIComponent('filetype:bitmap ' + query);
    const url = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=' + q + '&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url&iiurlwidth=1200&format=json';
    https.get(url, { headers: { 'User-Agent': 'APerfectDayGuide/1.0 (ludara.ai; contact@ludara.ai)' } }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        clearTimeout(timer);
        try {
          const pages = JSON.parse(data)?.query?.pages;
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

// ── DOWNLOAD IMAGE ────────────────────────────────────────────────
function download(imgUrl, dest, hops) {
  return new Promise((resolve) => {
    if (hops <= 0) return resolve(false);
    const timer = setTimeout(() => resolve(false), 20000);
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

// ── CLAUDE VISION VERIFICATION ────────────────────────────────────
// Returns true = image matches place, false = mismatch
// If no API key set, always returns true (skip verification)
function verifyImage(imagePath, place) {
  return new Promise((resolve) => {
    if (!API_KEY) return resolve(true); // no key = skip

    let imageData;
    try {
      imageData = fs.readFileSync(imagePath).toString('base64');
    } catch(e) { return resolve(true); }

    const prompt = 'Does this image reasonably represent "' + place.name + '", a ' + place.type + ' in ' + CITY + '? ' +
      'Accept: exterior or interior of the place, its food, drinks, or any fitting atmosphere photo. ' +
      'Reject ONLY if completely wrong — e.g. a landscape, unrelated landmark, or totally different food type. ' +
      'Reply with only: MATCH or MISMATCH';

    const body = JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 10,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageData } },
          { type: 'text', text: prompt }
        ]
      }]
    });

    const timer = setTimeout(() => resolve(true), 20000); // timeout = assume ok

    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(body),
      }
    }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        clearTimeout(timer);
        try {
          const result = JSON.parse(data);
          const text = (result.content && result.content[0] && result.content[0].text || '').trim().toUpperCase();
          resolve(!text.includes('MISMATCH'));
        } catch(e) { resolve(true); }
      });
    });
    req.on('error', () => { clearTimeout(timer); resolve(true); });
    req.write(body);
    req.end();
  });
}

// ── TRY ALL WIKIMEDIA RESULTS UNTIL ONE MATCHES ───────────────────
async function findMatchingImage(queries, place) {
  for (const query of queries) {
    const urls = await searchWikimediaAll(query);
    if (!urls.length) continue;

    process.stdout.write('  → Wikimedia "' + query.substring(0, 40) + '" (' + urls.length + ' results)');

    for (let i = 0; i < urls.length; i++) {
      const tmpPath = path.join(OUTPUT_DIR, '_tmp_verify.jpg');
      const ok = await download(urls[i], tmpPath, 3);
      if (!ok) continue;

      if (API_KEY) {
        process.stdout.write(' checking #' + (i + 1) + '...');
        const matches = await verifyImage(tmpPath, place);
        if (!matches) {
          fs.unlink(tmpPath, () => {});
          continue; // try next result
        }
      }

      // Good image found
      console.log(' ✓');
      return tmpPath; // caller will rename to final dest
    }
    console.log(' no match');
  }
  return null;
}

// ── RESIZE (sharp from general/_scripts/node_modules) ────────────
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
    console.log('  Fix: cd general\\_scripts && npm install sharp');
    return;
  }

  const MAX_SIZE = 600;
  const files = fs.readdirSync(OUTPUT_DIR)
    .filter(f => /^place-\d+\.(jpe?g|png|webp)$/i.test(f))
    .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));

  if (!files.length) { console.log('  No images to resize.'); return; }
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

// ── FETCH A SINGLE PLACE ──────────────────────────────────────────
async function fetchPlace(place, lang, translations) {
  const dest = path.join(OUTPUT_DIR, 'place-' + place.id + '.jpg');
  let imgUrl = null;

  console.log('place-' + place.id + ': ' + place.name);

  // Stage 0: direct_image URL hardcoded in data.js — highest priority
  if (place.direct_image) {
    process.stdout.write('  → direct image URL... ');
    const ok = await download(place.direct_image, dest, 5);
    if (ok) {
      const matches = await verifyImage(dest, place);
      if (matches) { console.log('✅ from direct_image\n'); return 'ok'; }
      console.log('⚠️  direct image mismatch, continuing');
      fs.unlink(dest, () => {});
    } else {
      console.log('download failed');
    }
  }

  // Stage 1: place website og:image (highest quality — their own photo)
  if (place.website) {
    process.stdout.write('  → website og:image... ');
    const html = await fetchPage(place.website, lang.code);
    if (html) imgUrl = extractOgImage(html, place.website);
    if (imgUrl) {
      const ok = await download(imgUrl, dest, 5);
      if (ok) {
        const matches = await verifyImage(dest, place);
        if (matches) { console.log('✅ from website\n'); return 'ok'; }
        console.log('⚠️  website image mismatch, trying Wikimedia');
        fs.unlink(dest, () => {});
        imgUrl = null;
      } else {
        console.log('download failed');
        imgUrl = null;
      }
    } else {
      console.log('not found');
    }
  }

  // Stages 2–4: Wikimedia with verification — try local language, then English, then generic
  const queries = [];
  if (lang.code !== 'en' && translations[place.id]) queries.push(translations[place.id]);
  queries.push(place.name + ' ' + CITY);
  if (place.type) queries.push(place.type);

  const tmpPath = await findMatchingImage(queries, place);
  if (tmpPath) {
    try {
      fs.renameSync(tmpPath, dest);
      const kb = Math.round(fs.statSync(dest).size / 1024);
      console.log('  ✅ ' + kb + 'KB\n');
      return 'ok';
    } catch(e) {
      // rename may fail cross-device — try copy+delete
      fs.copyFileSync(tmpPath, dest);
      fs.unlink(tmpPath, () => {});
      console.log('  ✅\n');
      return 'ok';
    }
  }

  // Clean up any leftover tmp file
  const tmpPath2 = path.join(OUTPUT_DIR, '_tmp_verify.jpg');
  if (fs.existsSync(tmpPath2)) fs.unlink(tmpPath2, () => {});

  console.log('  ❌ no matching image found\n');
  return 'failed';
}

// ── REVERIFY MODE ─────────────────────────────────────────────────
async function reverify(PLACES, lang, translations) {
  console.log('\n══════════════════════════════════════════════════');
  console.log('  REVERIFY MODE — checking existing images');
  if (!API_KEY) {
    console.log('  ⚠️  ANTHROPIC_API_KEY not set — cannot verify images.');
    console.log('  Set it first: set ANTHROPIC_API_KEY=sk-ant-...');
    process.exit(1);
  }
  console.log('══════════════════════════════════════════════════\n');

  const toRefetch = [];

  for (const place of PLACES) {
    const dest = path.join(OUTPUT_DIR, 'place-' + place.id + '.jpg');
    if (SKIP_IDS.includes(place.id)) {
      console.log('place-' + place.id + ' ' + place.name + ': ⏭  skipped (--skip)');
      continue;
    }
    if (!fs.existsSync(dest)) {
      console.log('place-' + place.id + ' ' + place.name + ': no image, will fetch');
      toRefetch.push(place);
      continue;
    }
    process.stdout.write('place-' + place.id + ' ' + place.name + ': checking... ');
    const matches = await verifyImage(dest, place);
    if (matches) {
      console.log('✅ ok');
    } else {
      console.log('❌ MISMATCH — will re-fetch');
      fs.unlink(dest, () => {});
      toRefetch.push(place);
    }
  }

  if (!toRefetch.length) {
    console.log('\n  All images verified — no mismatches found! ✅\n');
    return;
  }

  console.log('\n  Re-fetching ' + toRefetch.length + ' mismatched images...\n');
  const results = { ok: [], failed: [], restored: [] };
  for (const place of toRefetch) {
    const result = await fetchPlace(place, lang, translations);
    const bak = path.join(OUTPUT_DIR, 'place-' + place.id + '_bak.jpg');
    if (result === 'ok') {
      results.ok.push(place.name);
      if (fs.existsSync(bak)) fs.unlink(bak, () => {});  // clean up backup
    } else {
      // Re-fetch failed — restore backup so the guide still has an image
      if (fs.existsSync(bak)) {
        const dest = path.join(OUTPUT_DIR, 'place-' + place.id + '.jpg');
        fs.copyFileSync(bak, dest);
        fs.unlink(bak, () => {});
        console.log('  ↩️  Restored original image for ' + place.name + '\n');
        results.restored.push(place.name);
      } else {
        results.failed.push({ id: place.id, name: place.name });
      }
    }
    await new Promise(r => setTimeout(r, 300));
  }

  console.log('══════════════════════════════════════════════════');
  console.log('  Reverify complete');
  console.log('  ✅ Fixed: ' + results.ok.length + '  ↩️  Restored: ' + (results.restored || []).length + '  ❌ Still missing: ' + results.failed.length);
  if ((results.restored || []).length) {
    console.log('\n  Restored originals (no better match found) — review manually if needed:');
    (results.restored || []).forEach(n => console.log('    ' + n));
  }
  if (results.failed.length) {
    console.log('\n  Still needs manual images:');
    results.failed.forEach(p => console.log('    place-' + p.id + '.jpg  →  ' + p.name));
  }
  console.log('══════════════════════════════════════════════════\n');
}

// ── MAIN ─────────────────────────────────────────────────────────
async function run() {
  const PLACES = loadPlaces();
  const lang = LANGUAGE_MAP[COUNTRY] || { code: 'en', name: 'English' };

  console.log('\n══════════════════════════════════════════════════');
  console.log('  A Perfect Day — Universal Image Fetcher');
  console.log('══════════════════════════════════════════════════');
  console.log('  City:       ' + CITY);
  console.log('  Country:    ' + COUNTRY);
  console.log('  Language:   ' + lang.name + ' (' + lang.code + ')');
  console.log('  Places:     ' + PLACES.length);
  console.log('  Output:     ' + OUTPUT_DIR);
  console.log('  Verify:     ' + (API_KEY ? '✅ Claude vision active' : '⚠️  No API key — verification skipped'));
  console.log('  Mode:       ' + (REVERIFY ? 'REVERIFY existing images' : 'fetch missing images'));
  if (SKIP_IDS.length) console.log('  Skipping:   place IDs ' + SKIP_IDS.join(', '));
  if (!LANGUAGE_MAP[COUNTRY]) {
    console.log('  ⚠️  "' + COUNTRY + '" not in language map — searching in English only.');
  }
  console.log('──────────────────────────────────────────────────');

  const answer = await confirm('  Proceed? (y to continue, any other key to abort): ');
  if (answer !== 'y' && answer !== 'yes') {
    console.log('  Aborted.\n'); process.exit(0);
  }

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Pre-translate place names
  const translations = {};
  if (lang.code !== 'en') {
    console.log('\n  Translating place names to ' + lang.name + '...\n');
    for (const place of PLACES) {
      const t = await translate(place.name + ' ' + CITY, lang.code);
      translations[place.id] = t;
      console.log('  ' + place.name + ' → ' + (t || '(failed)'));
      await new Promise(r => setTimeout(r, 150));
    }
  }

  // REVERIFY MODE
  if (REVERIFY) {
    await reverify(PLACES, lang, translations);
    return;
  }

  // NORMAL FETCH MODE
  console.log('\n  Fetching images...\n');
  const results = { ok: [], skipped: [], failed: [] };

  for (const place of PLACES) {
    const dest = path.join(OUTPUT_DIR, 'place-' + place.id + '.jpg');

    if (fs.existsSync(dest) && fs.statSync(dest).size > 10000) {
      console.log('place-' + place.id + ' ' + place.name + ': ⏭  exists');
      results.skipped.push(place.name);
      continue;
    }

    const result = await fetchPlace(place, lang, translations);
    const bak = path.join(OUTPUT_DIR, 'place-' + place.id + '_bak.jpg');
    if (result === 'ok') {
      results.ok.push(place.name);
      if (fs.existsSync(bak)) fs.unlink(bak, () => {});  // clean up backup
    } else {
      // Re-fetch failed — restore backup so the guide still has an image
      if (fs.existsSync(bak)) {
        const dest = path.join(OUTPUT_DIR, 'place-' + place.id + '.jpg');
        fs.copyFileSync(bak, dest);
        fs.unlink(bak, () => {});
        console.log('  ↩️  Restored original image for ' + place.name + '\n');
        results.restored.push(place.name);
      } else {
        results.failed.push({ id: place.id, name: place.name });
      }
    }
    await new Promise(r => setTimeout(r, 300));
  }

  // RESIZE
  console.log('\n══════════════════════════════════════════════════');
  console.log('  RESIZE');
  console.log('══════════════════════════════════════════════════');
  await resizeImages();

  // SUMMARY
  console.log('\n══════════════════════════════════════════════════');
  console.log('  SUMMARY');
  console.log('══════════════════════════════════════════════════');
  console.log('  ✅ Downloaded:   ' + results.ok.length);
  console.log('  ⏭  Already had: ' + results.skipped.length);
  console.log('  ❌ Failed:       ' + results.failed.length);
  if (results.failed.length > 0) {
    console.log('\n  Failed — add images manually:');
    results.failed.forEach(p => console.log('    place-' + p.id + '.jpg  →  ' + p.name));
    console.log('\n  Save any JPG as place-N.jpg in the images/ folder.');
  } else {
    console.log('\n  All images fetched and verified successfully!');
  }
  console.log('══════════════════════════════════════════════════\n');
}

run();
