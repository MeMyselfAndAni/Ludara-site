// diagnose-images.js — run from HolyLandWithMaria folder
// Tests each step of the image pipeline for one Hebrew and one English place name
// node diagnose-images.js

const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');

const API_KEY    = process.env.ANTHROPIC_API_KEY || '';
const OUTPUT_DIR = path.join(__dirname, 'images');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

const TEST_PLACES = [
  { id: 999991, name: 'מצדה' },          // Hebrew — should translate to "Masada"
  { id: 999992, name: 'Masada' },         // English — famous, must find on Wikipedia
  { id: 999993, name: 'Western Wall' },   // English — very famous
];

function get(url) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), 10000);
    const proto = url.startsWith('https') ? https : http;
    proto.get(url, { headers: { 'User-Agent': 'APerfectDayDiag/1.0' } }, (res) => {
      if ([301,302,303].includes(res.statusCode) && res.headers.location) {
        clearTimeout(timer);
        return resolve(get(res.headers.location));
      }
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { clearTimeout(timer); resolve(d); });
    }).on('error', () => { clearTimeout(timer); resolve(null); });
  });
}

async function testTranslate(text) {
  const q = encodeURIComponent(text);
  const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=' + q;
  const d = await get(url);
  if (!d) return null;
  try { return JSON.parse(d)[0].map(s => s[0]).join('').trim(); }
  catch(e) { return 'PARSE ERROR: ' + d.slice(0, 100); }
}

async function testWikipedia(title) {
  const t = encodeURIComponent(title);
  const url = 'https://en.wikipedia.org/w/api.php?action=query&titles=' + t
    + '&prop=pageimages&pithumbsize=800&pilicense=any&format=json&redirects=1';
  const d = await get(url);
  if (!d) return null;
  try {
    const pages = JSON.parse(d)?.query?.pages;
    if (!pages) return 'NO PAGES IN RESPONSE';
    const page = Object.values(pages)[0];
    if (page.missing !== undefined) return 'ARTICLE NOT FOUND';
    const thumb = page?.thumbnail?.source;
    return thumb || 'ARTICLE EXISTS BUT NO THUMBNAIL';
  } catch(e) { return 'PARSE ERROR: ' + String(e); }
}

async function testDownload(url, dest) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve('TIMEOUT'), 15000);
    const proto = url.startsWith('https') ? https : http;
    const file  = fs.createWriteStream(dest);
    proto.get(url, { headers: { 'User-Agent': 'APerfectDayDiag/1.0' } }, (res) => {
      if (res.statusCode !== 200) {
        clearTimeout(timer); file.close(); fs.unlink(dest, () => {});
        return resolve('HTTP ' + res.statusCode);
      }
      res.pipe(file);
      file.on('finish', () => {
        clearTimeout(timer); file.close();
        const size = fs.existsSync(dest) ? fs.statSync(dest).size : 0;
        resolve(size > 8000 ? size + ' bytes' : 'TOO SMALL (' + size + ')');
      });
    }).on('error', e => { clearTimeout(timer); resolve('ERROR: ' + e.message); });
  });
}

async function testVerify(imagePath, name) {
  if (!API_KEY) return 'SKIPPED (no API_KEY)';
  let imageData;
  try { imageData = fs.readFileSync(imagePath).toString('base64'); }
  catch(e) { return 'CANNOT READ IMAGE'; }

  const body = JSON.stringify({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 10,
    messages: [{ role: 'user', content: [
      { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageData } },
      { type: 'text', text: 'Does this image show "' + name + '"? Reply only: MATCH or MISMATCH' }
    ]}]
  });

  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve('TIMEOUT'), 20000);
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
          const parsed = JSON.parse(d);
          const text = parsed.content?.[0]?.text || '';
          const err  = parsed.error?.message || '';
          resolve(text || 'API ERROR: ' + err || 'EMPTY RESPONSE: ' + d.slice(0,200));
        } catch(e) { resolve('PARSE ERROR: ' + d.slice(0,200)); }
      });
    });
    req.on('error', e => { clearTimeout(timer); resolve('REQUEST ERROR: ' + e.message); });
    req.write(body); req.end();
  });
}

async function run() {
  console.log('\n═══════════════════════════════════════════════════');
  console.log('  Image Pipeline Diagnostic');
  console.log('  API key: ' + (API_KEY ? '✅ set (' + API_KEY.slice(0,12) + '...)' : '❌ NOT SET'));
  console.log('═══════════════════════════════════════════════════\n');

  for (const place of TEST_PLACES) {
    console.log('─── Testing: "' + place.name + '" ───────────────────');

    // Step 1: Translate
    const isHebrew = /[א-׿]/.test(place.name);
    let displayName = place.name;
    if (isHebrew) {
      process.stdout.write('  1. Translate to English... ');
      const translated = await testTranslate(place.name);
      console.log(translated || 'FAILED (null)');
      if (translated && !translated.startsWith('PARSE') && !translated.startsWith('ERROR')) {
        displayName = translated;
      }
    } else {
      console.log('  1. Translate: skipped (English name)');
    }

    // Step 2: Wikipedia lookup
    process.stdout.write('  2. Wikipedia thumbnail for "' + displayName + '"... ');
    const thumbUrl = await testWikipedia(displayName);
    console.log(thumbUrl ? thumbUrl.slice(0, 80) + '...' : 'NULL');

    if (!thumbUrl || thumbUrl.startsWith('ARTICLE') || thumbUrl.startsWith('NO') || thumbUrl.startsWith('PARSE')) {
      console.log('  ⚠️  Cannot proceed without image URL\n');
      continue;
    }

    // Step 3: Download
    const tmpPath = path.join(OUTPUT_DIR, '_diag_' + place.id + '.jpg');
    process.stdout.write('  3. Download image... ');
    const dlResult = await testDownload(thumbUrl, tmpPath);
    console.log(dlResult);

    if (!dlResult.includes('bytes')) {
      console.log('  ⚠️  Download failed\n');
      continue;
    }

    // Step 4: Verify
    process.stdout.write('  4. Claude verify as "' + displayName + '"... ');
    const verifyResult = await testVerify(tmpPath, displayName);
    console.log(verifyResult);

    // Cleanup
    try { fs.unlinkSync(tmpPath); } catch(e) {}
    console.log();
  }

  console.log('═══════════════════════════════════════════════════');
  console.log('  Done. Paste output above to diagnose the failure.');
  console.log('═══════════════════════════════════════════════════\n');
}

run().catch(e => console.error('Fatal:', e));
