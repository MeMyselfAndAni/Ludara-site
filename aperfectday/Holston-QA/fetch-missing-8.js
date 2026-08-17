// ═══════════════════════════════════════════════════════════════════
// fetch-missing-8.js — A Perfect Day / Nashville
// Fetches og:image from each restaurant's own website
// and saves it as place-N.jpg in the images/ folder.
//
// Run FROM the Nashville guide folder:
//   cd C:\Nashville
//   node fetch-missing-8.js
// ═══════════════════════════════════════════════════════════════════

const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');

const OUTPUT_DIR = path.join(__dirname, 'images');

const MISSING = [
  { id:  9, name: 'Rolf & Daughters',   url: 'https://www.rolfanddaughters.com/' },
  { id: 16, name: 'The Catbird Seat',   url: 'https://www.thecatbirdseatrestaurant.com/' },
  { id: 22, name: 'Butcher & Bee',      url: 'https://www.butcherandbee.com/nashville/' },
  { id: 24, name: 'Barista Parlor',     url: 'https://baristaparlor.com/pages/about-us' },
  { id: 25, name: 'Mas Tacos',          url: 'https://mastacosnashville.com/' },
  { id: 26, name: 'Bad Idea',           url: 'https://www.badideanashville.com/' },
  { id: 28, name: 'Frothy Monkey',      url: 'https://frothymonkey.com/locations/12south/' },
  { id: 36, name: 'Fido',               url: 'https://www.fidocoffee.com/' },
];

// ── fetch a page with browser-like headers ────────────────────────
function fetchPage(url, hops = 5) {
  return new Promise((resolve) => {
    if (hops <= 0) return resolve(null);
    const timer = setTimeout(() => resolve(null), 12000);
    const proto = url.startsWith('https') ? https : http;
    let html = '';
    const req = proto.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,*/*;q=0.9',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    }, (res) => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        clearTimeout(timer);
        const next = res.headers.location.startsWith('http')
          ? res.headers.location
          : new URL(res.headers.location, url).href;
        return resolve(fetchPage(next, hops - 1));
      }
      res.setEncoding('utf8');
      res.on('data', d => { html += d; if (html.length > 300000) req.destroy(); });
      res.on('end', () => { clearTimeout(timer); resolve(html); });
    });
    req.on('error', () => { clearTimeout(timer); resolve(null); });
  });
}

// ── extract og:image or twitter:image ────────────────────────────
function extractOgImage(html, base) {
  const patterns = [
    /property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]*property=["']og:image["']/i,
    /name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i,
    /name=["']og:image["'][^>]*content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]*name=["']og:image["']/i,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m && m[1]) {
      let u = m[1].trim();
      if (u.startsWith('//'))  u = 'https:' + u;
      if (u.startsWith('/'))   { try { u = new URL(u, base).href; } catch(e) { continue; } }
      if (u.startsWith('http') && !u.match(/\.(svg|gif)/i)) return u;
    }
  }
  return null;
}

// ── download image ─────────────────────────────────────────────────
function download(imgUrl, dest, hops = 5) {
  return new Promise((resolve) => {
    if (hops <= 0) return resolve(false);
    const timer = setTimeout(() => resolve(false), 20000);
    const proto = imgUrl.startsWith('https') ? https : http;
    const file  = fs.createWriteStream(dest);
    const req   = proto.get(imgUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    }, (res) => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        clearTimeout(timer); file.close(); fs.unlink(dest, () => {});
        const next = res.headers.location.startsWith('http')
          ? res.headers.location
          : new URL(res.headers.location, imgUrl).href;
        return resolve(download(next, dest, hops - 1));
      }
      if (res.statusCode !== 200) {
        clearTimeout(timer); file.close(); fs.unlink(dest, () => {});
        return resolve(false);
      }
      res.pipe(file);
      file.on('finish', () => {
        clearTimeout(timer); file.close();
        const size = fs.existsSync(dest) ? fs.statSync(dest).size : 0;
        if (size < 5000) { fs.unlink(dest, () => {}); return resolve(false); }
        resolve(true);
      });
    });
    req.on('error', () => { clearTimeout(timer); file.close(); fs.unlink(dest, () => {}); resolve(false); });
  });
}

// ── main ─────────────────────────────────────────────────────────
async function run() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log('\n══════════════════════════════════════════════════');
  console.log('  A Perfect Day — Fetch Missing Restaurant Images');
  console.log('══════════════════════════════════════════════════\n');

  const ok = [], failed = [];

  for (const place of MISSING) {
    const dest = path.join(OUTPUT_DIR, `place-${place.id}.jpg`);
    process.stdout.write(`place-${place.id}: ${place.name}\n  → fetching ${place.url} ... `);

    const html = await fetchPage(place.url);
    if (!html) {
      console.log('❌ page fetch failed');
      failed.push(place);
      continue;
    }

    const imgUrl = extractOgImage(html, place.url);
    if (!imgUrl) {
      console.log('❌ no og:image found');
      // Show first 2000 chars of html for debugging
      console.log('  (hint: check the URL manually and add direct_image to data.js)');
      failed.push(place);
      continue;
    }

    process.stdout.write(`found og:image\n  → downloading ... `);
    const success = await download(imgUrl, dest);
    if (success) {
      const kb = Math.round(fs.statSync(dest).size / 1024);
      console.log(`✅ ${kb}KB saved`);
      ok.push(place);
    } else {
      console.log(`❌ download failed\n  URL was: ${imgUrl}`);
      failed.push(place);
    }
    console.log();
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n══════════════════════════════════════════════════');
  console.log('  RESULTS');
  console.log('══════════════════════════════════════════════════');
  console.log(`  ✅ Downloaded: ${ok.length}`);
  console.log(`  ❌ Failed:     ${failed.length}`);

  if (failed.length > 0) {
    console.log('\n  Still missing — try these websites manually:');
    for (const p of failed) {
      console.log(`  place-${p.id}.jpg  ${p.name}  →  ${p.url}`);
    }
    console.log('\n  TIP: Open each URL in Chrome → F12 → Network → Img tab');
    console.log('       Reload page → find the large hero image → copy URL');
    console.log('       Paste as direct_image in data.js and re-run the main script.');
  } else {
    console.log('\n  All images fetched! Now run the main fetch script to resize:\n');
    console.log('  node fetch-images-universal.js');
  }
  console.log('══════════════════════════════════════════════════\n');
}

run();
