/**
 * fetch-images-mexicocity-final5.js
 * Fetches the last 5 stubborn missing images with different search angles.
 * Run from the guide folder: node fetch-images-mexicocity-final5.js
 */

const fs    = require('fs');
const path  = require('path');
const https = require('https');

const IMG_DIR   = path.join(__dirname, 'images');
const MIN_WIDTH = 500;   // slightly relaxed for harder-to-find images
const MAX_WIDTH = 1200;
const SLEEP_MS  = 400;

const PLACES = [
  // place-8: Cantina La Ópera — try 'cantina' or 'pulqueria' Mexico City interiors
  { id:  8, attempts: [
    { wikiTitle: 'Cantina', search: null },
    { wikiTitle: null, search: 'Pulquería Mexico City interior' },
    { wikiTitle: null, search: 'bar interior Mexico vintage' },
  ]},
  // place-9: Licorería Limantour — cocktail bar
  { id:  9, attempts: [
    { wikiTitle: 'Cocktail', search: null },
    { wikiTitle: null, search: 'cocktail glasses bar counter night' },
    { wikiTitle: null, search: 'bar drinks night colorful cocktails' },
  ]},
  // place-13: La Clandestina mezcal bar
  { id: 13, attempts: [
    { wikiTitle: 'Agave spirits', search: null },
    { wikiTitle: null, search: 'agave mezcal bottles shelf bar' },
    { wikiTitle: null, search: 'mezcal tasting Mexico agave spirits' },
  ]},
  // place-22: Máximo Bistrot fine dining
  { id: 22, attempts: [
    { wikiTitle: 'Nouvelle cuisine', search: null },
    { wikiTitle: null, search: 'fine dining plate French inspired cuisine' },
    { wikiTitle: null, search: 'restaurant elegant dinner plate food' },
  ]},
  // place-23: Mari Gold breakfast
  { id: 23, attempts: [
    { wikiTitle: 'Chilaquiles', search: null },
    { wikiTitle: null, search: 'chilaquiles Mexican breakfast eggs' },
    { wikiTitle: null, search: 'huevos rancheros Mexican breakfast dish' },
  ]},
];

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'APerfectDayGuide/1.0 (ludara.ai; contact@ludara.ai) node-https' }
    }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end',  () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
      res.on('error', reject);
    });
    req.on('error', reject);
  });
}

async function getFollowRedirects(url, max = 5) {
  let cur = url;
  for (let i = 0; i < max; i++) {
    const res = await get(cur);
    if ((res.status === 301 || res.status === 302 || res.status === 307) && res.headers.location) {
      cur = res.headers.location; continue;
    }
    return res;
  }
  throw new Error(`Too many redirects`);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function wikiArticleImage(title) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&pithumbsize=${MAX_WIDTH}&format=json&origin=*`;
  try {
    const res  = await get(url);
    const data = JSON.parse(res.body.toString());
    const pages = data.query && data.query.pages;
    if (!pages) return null;
    const page = Object.values(pages)[0];
    if (!page || page.missing !== undefined) return null;
    const thumbUrl = page.thumbnail && page.thumbnail.source;
    if (!thumbUrl) return null;
    return thumbUrl.replace(/\/thumb\//, '/').replace(/\/\d+px-[^/]+$/, '');
  } catch { return null; }
}

async function commonsSearch(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=8&format=json&origin=*`;
  try {
    const res  = await get(url);
    const data = JSON.parse(res.body.toString());
    const hits = data.query && data.query.search;
    if (!hits || !hits.length) return null;
    for (const hit of hits) {
      const title = hit.title;
      if (!/\.(jpe?g|png|webp)$/i.test(title)) continue;
      const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|size&iiurlwidth=${MAX_WIDTH}&format=json&origin=*`;
      const infoRes  = await get(infoUrl);
      const infoData = JSON.parse(infoRes.body.toString());
      const infoPages = infoData.query && infoData.query.pages;
      if (!infoPages) continue;
      const infoPage  = Object.values(infoPages)[0];
      const imageinfo = infoPage && infoPage.imageinfo && infoPage.imageinfo[0];
      if (!imageinfo) continue;
      const imgUrl = imageinfo.thumburl || imageinfo.url;
      const width  = imageinfo.thumbwidth || imageinfo.width || 0;
      if (imgUrl && width >= MIN_WIDTH) return imgUrl;
    }
    return null;
  } catch { return null; }
}

async function downloadImage(imageUrl, filepath, id) {
  try {
    const res = await getFollowRedirects(imageUrl);
    if (res.status !== 200) { console.warn(`  ✗ [${id}] HTTP ${res.status}`); return false; }
    const ct = res.headers['content-type'] || '';
    if (!ct.startsWith('image/')) { console.warn(`  ✗ [${id}] bad content-type: ${ct}`); return false; }
    fs.writeFileSync(filepath, res.body);
    console.log(`  ✓ [${id}] saved → place-${id}.jpg  (${(res.body.length / 1024).toFixed(0)} KB)`);
    return true;
  } catch (err) {
    console.error(`  ✗ [${id}] download error: ${err.message}`);
    return false;
  }
}

async function main() {
  if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });
  console.log(`\n📸  Final 5 — trying alternative search angles…\n`);

  let ok = 0;
  const stillMissing = [];

  for (const place of PLACES) {
    const { id, attempts } = place;
    const filepath = path.join(IMG_DIR, `place-${id}.jpg`);

    if (fs.existsSync(filepath)) {
      console.log(`\n[${id}] already exists — skipping`);
      ok++;
      continue;
    }

    console.log(`\n[place-${id}]`);
    let found = false;

    for (const attempt of attempts) {
      let imageUrl = null;

      if (attempt.wikiTitle) {
        process.stdout.write(`  Wikipedia "${attempt.wikiTitle}" … `);
        imageUrl = await wikiArticleImage(attempt.wikiTitle);
        process.stdout.write(imageUrl ? 'found\n' : 'no image\n');
        await sleep(SLEEP_MS);
      }

      if (!imageUrl && attempt.search) {
        process.stdout.write(`  Commons "${attempt.search}" … `);
        imageUrl = await commonsSearch(attempt.search);
        process.stdout.write(imageUrl ? 'found\n' : 'no image\n');
        await sleep(SLEEP_MS);
      }

      if (imageUrl) {
        found = await downloadImage(imageUrl, filepath, id);
        if (found) { ok++; break; }
      }
    }

    if (!found) stillMissing.push(id);
  }

  console.log('\n' + '─'.repeat(60));
  console.log(`✅  Done!  ${ok} saved,  ${stillMissing.length} still missing.\n`);

  if (stillMissing.length) {
    console.log('⚠️  Last resort — grab any freely-licensed photo for these:');
    const suggestions = {
       8: 'https://unsplash.com/s/photos/cantina-mexico  (search: cantina bar interior)',
       9: 'https://unsplash.com/s/photos/cocktail-bar  (search: cocktail bar night)',
      13: 'https://unsplash.com/s/photos/mezcal  (search: mezcal bottles)',
      22: 'https://unsplash.com/s/photos/fine-dining  (search: fine dining plating)',
      23: 'https://unsplash.com/s/photos/brunch-mexico  (search: Mexican brunch)',
    };
    stillMissing.forEach(id => {
      console.log(`   place-${id}.jpg → ${suggestions[id] || 'https://unsplash.com'}`);
    });
    console.log('\n  Save as place-N.jpg (any size — resize script will handle it).');
    console.log('  Unsplash photos are free for use — no attribution required.\n');
  }

  console.log('Next: node ../../../general/_scripts/resize-images.js .');
  console.log('Then: deploy-anais-mexicocity.bat\n');
}

main();
