// ═══════════════════════════════════════════════════════════════════
// recover-credits.js — A Perfect Day
// PIXEL-VERIFIED photo credit recovery.
//
// For every place-N.jpg already on disk, this script:
//   1. computes a perceptual hash (dHash) of your actual image,
//   2. searches Wikimedia Commons for that place,
//   3. fingerprints each candidate and compares pixels,
//   4. records the author + license ONLY when a candidate truly matches.
//
// Images it cannot match by pixels are the hand-picked / non-Wikimedia
// ones; they are listed in credits-report.txt as NEEDS REPLACEMENT and
// are NOT given a guessed credit.
//
// Run from the guide folder:
//   cd Venice
//   node recover-credits.js
//
// Needs `sharp` (same dependency your fetcher uses). No API key required.
//
// Flags:
//   --force        re-check entries already in credits.js
//   --threshold=N  max Hamming distance to count as a match (default 10)
// ═══════════════════════════════════════════════════════════════════

const CITY = 'Venice';

const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');

const OUTPUT_DIR   = path.join(__dirname, 'images');
const CREDITS_FILE = path.join(__dirname, 'credits.js');
const REPORT_FILE  = path.join(__dirname, 'credits-report.txt');
const FORCE        = process.argv.includes('--force');
const THRESHOLD    = (() => {
  const a = process.argv.find(x => x.startsWith('--threshold='));
  return a ? parseInt(a.split('=')[1], 10) : 10;
})();

// ── locate sharp (try local, then Ludara general/_scripts) ────────
function loadSharp() {
  const tries = [
    'sharp',
    path.join(__dirname, 'node_modules', 'sharp'),
    path.join(__dirname, '..', '..', 'general', '_scripts', 'node_modules', 'sharp'),
    path.join(__dirname, '..', '_scripts', 'node_modules', 'sharp'),
  ];
  for (const t of tries) { try { return require(t); } catch (e) {} }
  console.error('ERROR: sharp not found. Run from a folder where sharp is installed,');
  console.error('or `npm install sharp` in the Venice folder, then retry.');
  process.exit(1);
}
const sharp = loadSharp();

// ── LOAD PLACES + existing credits ────────────────────────────────
function loadPlaces() {
  const p = path.join(__dirname, 'data.js');
  if (!fs.existsSync(p)) { console.error('ERROR: data.js not found'); process.exit(1); }
  const code = fs.readFileSync(p, 'utf8');
  eval(code.replace(/^const PLACES/m, 'var PLACES'));
  if (typeof PLACES !== 'undefined' && Array.isArray(PLACES)) return PLACES;
  console.error('ERROR: PLACES not found'); process.exit(1);
}
function loadExistingCredits() {
  try {
    if (!fs.existsSync(CREDITS_FILE)) return {};
    const code = fs.readFileSync(CREDITS_FILE, 'utf8');
    eval(code.replace(/^const PHOTO_CREDITS/m, 'var PHOTO_CREDITS')
            .replace(/^function photoCreditHtml[\s\S]*$/m, ''));
    return (typeof PHOTO_CREDITS !== 'undefined') ? PHOTO_CREDITS : {};
  } catch (e) { return {}; }
}

function stripHtml(s) {
  if (!s) return '';
  return String(s).replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

// ── PERCEPTUAL HASH (dHash, 64-bit) ───────────────────────────────
async function dHash(input) {
  // input: file path or Buffer. Resize to 9x8 grayscale, compare adjacent cols.
  const W = 9, H = 8;
  const buf = await sharp(input).grayscale().resize(W, H, { fit: 'fill' }).raw().toBuffer();
  let bits = '';
  for (let r = 0; r < H; r++)
    for (let c = 0; c < W - 1; c++)
      bits += (buf[r * W + c] < buf[r * W + c + 1]) ? '1' : '0';
  return bits; // 64 chars
}
function hamming(a, b) {
  if (!a || !b || a.length !== b.length) return 999;
  let d = 0; for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
}

// ── WIKIMEDIA SEARCH WITH ATTRIBUTION ─────────────────────────────
function searchWikimediaWithMeta(query) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve([]), 9000);
    const q = encodeURIComponent('filetype:bitmap ' + query);
    const url = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search'
      + '&gsrsearch=' + q + '&gsrnamespace=6&gsrlimit=10'
      + '&prop=imageinfo&iiprop=url%7Cextmetadata&iiurlwidth=1200&format=json';
    https.get(url, { headers: { 'User-Agent': 'APerfectDayGuide/1.0 (ludara.ai; contact@ludara.ai)' } }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        clearTimeout(timer);
        try {
          const pages = JSON.parse(data)?.query?.pages;
          if (!pages) return resolve([]);
          const arr = Object.values(pages).sort((a, b) => (a.index || 0) - (b.index || 0));
          resolve(arr.map(p => {
            const ii = p.imageinfo && p.imageinfo[0];
            if (!ii) return null;
            const u = ii.thumburl || ii.url;
            if (!u || u.match(/\.(svg|gif)/i)) return null;
            const em = ii.extmetadata || {};
            return {
              url: u, title: p.title || '', source: ii.descriptionurl || '',
              author: stripHtml(em.Artist && em.Artist.value),
              license: stripHtml(em.LicenseShortName && em.LicenseShortName.value),
            };
          }).filter(Boolean));
        } catch (e) { resolve([]); }
      });
    }).on('error', () => { clearTimeout(timer); resolve([]); });
  });
}

// ── DOWNLOAD TO BUFFER ────────────────────────────────────────────
function downloadBuffer(imgUrl, hops) {
  return new Promise((resolve) => {
    if (hops <= 0) return resolve(null);
    const timer = setTimeout(() => resolve(null), 20000);
    const proto = imgUrl.startsWith('https') ? https : http;
    proto.get(imgUrl, { headers: { 'User-Agent': 'APerfectDayGuide/1.0 (ludara.ai; contact@ludara.ai)' } }, (res) => {
      if ([301, 302, 303].includes(res.statusCode) && res.headers.location) {
        clearTimeout(timer); return resolve(downloadBuffer(res.headers.location, hops - 1));
      }
      if (res.statusCode !== 200) { clearTimeout(timer); return resolve(null); }
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => { clearTimeout(timer); resolve(Buffer.concat(chunks)); });
    }).on('error', () => { clearTimeout(timer); resolve(null); });
  });
}

// ── MATCH ONE PLACE BY PIXELS ─────────────────────────────────────
async function matchPlace(place, localHash) {
  const queries = [place.name + ' ' + CITY, place.name];
  if (place.type) queries.push(place.type);
  const seen = new Set();
  let best = { dist: 999, cand: null };

  for (const query of queries) {
    const cands = await searchWikimediaWithMeta(query);
    for (const cand of cands) {
      if (seen.has(cand.url)) continue;
      seen.add(cand.url);
      const buf = await downloadBuffer(cand.url, 3);
      if (!buf) continue;
      let h; try { h = await dHash(buf); } catch (e) { continue; }
      const d = hamming(localHash, h);
      if (d < best.dist) best = { dist: d, cand };
      if (d <= 2) return best; // near-perfect, stop early
    }
    if (best.dist <= THRESHOLD) break; // good enough, no need for weaker queries
  }
  return best;
}

// ── MAIN ──────────────────────────────────────────────────────────
(async () => {
  const PLACES = loadPlaces();
  const existing = loadExistingCredits();
  const credits = {};
  const report = [];
  let matched = 0, kept = 0, unmatched = 0;

  console.log('\nPixel-verified credit recovery for ' + PLACES.length + ' places (threshold ' + THRESHOLD + ')\n');

  for (const place of PLACES) {
    const imgPath = path.join(OUTPUT_DIR, 'place-' + place.id + '.jpg');
    if (!fs.existsSync(imgPath)) continue;

    if (existing[place.id] && !FORCE) {
      credits[place.id] = existing[place.id];
      kept++;
      report.push('#' + place.id + ' ' + place.name + ': KEPT (' + (existing[place.id].author || '?') + ')');
      continue;
    }

    let localHash;
    try { localHash = await dHash(imgPath); }
    catch (e) { report.push('#' + place.id + ' ' + place.name + ': ERROR reading local image'); continue; }

    process.stdout.write('#' + place.id + ' ' + place.name + ' ... ');
    const best = await matchPlace(place, localHash);

    if (best.cand && best.dist <= THRESHOLD && best.cand.author) {
      credits[place.id] = { author: best.cand.author, license: best.cand.license || '', url: best.cand.source || '' };
      matched++;
      console.log('MATCH d=' + best.dist + ' (' + best.cand.author + ')');
      report.push('#' + place.id + ' ' + place.name + ': MATCH d=' + best.dist + ' | ' + best.cand.author
        + ' (' + (best.cand.license || 'no license') + ') | ' + best.cand.source);
    } else {
      unmatched++;
      const note = best.cand ? ('closest d=' + best.dist + ' ' + best.cand.source) : 'no candidates';
      console.log('NO MATCH (' + note + ')');
      report.push('#' + place.id + ' ' + place.name + ': NEEDS REPLACEMENT (' + note + ')');
    }
  }

  // ── write credits.js ──
  const esc = s => String(s || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const out = [
    '// Photo attribution per place id. author / license / url (source page).',
    '// Pixel-verified against the source by recover-credits.js. Images with no',
    '// entry here either need replacement or show no credit line.',
    'const PHOTO_CREDITS = {',
  ];
  Object.keys(credits).map(Number).sort((a, b) => a - b).forEach(id => {
    const c = credits[id];
    out.push("  " + id + ": { author: '" + esc(c.author) + "', license: '" + esc(c.license)
      + "', url: '" + esc(c.url) + "' },");
  });
  out.push('};', '',
    'function photoCreditHtml(id){',
    "  var c = (typeof PHOTO_CREDITS !== 'undefined') ? PHOTO_CREDITS[id] : null;",
    "  if(!c || !c.author) return '';",
    "  var label = 'Photo: ' + c.author + (c.license ? ' \\u2014 ' + c.license : '');",
    "  var href  = c.url || '#';",
    '  return \'<a href="\' + href + \'" target="_blank" rel="noopener nofollow">\' + label + \'</a>\';',
    '}');
  fs.writeFileSync(CREDITS_FILE, out.join('\n') + '\n');
  fs.writeFileSync(REPORT_FILE, report.join('\n') + '\n');

  console.log('\nDone. matched ' + matched + ', kept ' + kept + ', needs replacement ' + unmatched);
  console.log('Wrote credits.js and credits-report.txt');
})();
