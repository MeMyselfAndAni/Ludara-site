// fetch-images-wanderlush-tbilisi-missing.js
// Run this AFTER fetch-images-wanderlush-tbilisi.js
// for any place-N.jpg files that were not created.
//
// Uses broader, more generic search terms to maximise Wikimedia Commons hits.
// Run from: aperfectday/wanderlush/tbilisi/
// Command:  node fetch-images-wanderlush-tbilisi-missing.js

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const IMAGES_DIR = path.join(__dirname, 'images');
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR);

const USER_AGENT = 'APerfectDayGuide/1.0 (ludara.ai; contact@ludara.ai) node-https';

// ── Only include places whose place-N.jpg is MISSING ─────────────────────────
// Broader fallback terms — if the specific search failed, try something generic.
// Delete entries for places that already downloaded successfully.

const MISSING = [
  { id:1,  search:"Tbilisi creative space courtyard cafe" },
  { id:5,  search:"Tbilisi puppet theatre marionette Georgia" },
  { id:9,  search:"Georgia tea cups Tbilisi cafe" },
  { id:10, search:"Tbilisi market food hall Orbeliani square" },
  { id:15, search:"Zoroastrian temple fire Georgia Caucasus" },
  { id:17, search:"Armenian ruins church Tbilisi Avlabari" },
  { id:18, search:"Georgian palace balcony Avlabari Tbilisi" },
  { id:19, search:"Mtkvari river Tbilisi cliffside chapel stone" },
  { id:20, search:"Tbilisi old town balcony wooden architecture" },
  { id:21, search:"Tbilisi panorama viewpoint old town rooftops" },
  { id:22, search:"Tbilisi Avlabari river Metekhi evening view" },
  { id:27, search:"Tbilisi aerial cable car cityscape" },
  { id:29, search:"Soviet mosaic building Georgia Tbilisi coloured glass" },
  { id:32, search:"Tbilisi market spices vendors street Georgia" },
  { id:34, search:"Tbilisi industrial hotel lobby Soviet interior" },
  { id:35, search:"Georgia wine bar Tbilisi amber wine Georgian" },
  { id:36, search:"Georgian natural wine qvevri clay amphora" },
  { id:37, search:"specialty coffee Georgia cafe barista" },
  { id:38, search:"Georgian ponchiki donuts fried pastry" },
  { id:39, search:"pharmacy interior historic bar cocktail bottles" },
  { id:40, search:"Tbilisi boutique hotel chugureti interior" },
  { id:41, search:"Georgian khinkali dumplings pkhali food plate" },
  { id:42, search:"Georgian khinkali dumplings artisan restaurant" },
  { id:43, search:"khinkali dumplings colourful cafe restaurant" },
  { id:44, search:"19th century Georgian restaurant historic townhouse" },
  { id:45, search:"Georgian garden restaurant courtyard summer Tbilisi" },
  { id:46, search:"Soviet workers canteen retro cafe Georgia" },
  { id:47, search:"Abkhazian food ajika spicy Georgia cuisine" },
  { id:48, search:"Persian sweets pastry cafe historic interior" },
  { id:49, search:"Tbilisi restaurant rooftop view Georgian food" },
  { id:50, search:"ice cream cone artisan Georgia Tbilisi" },
  { id:51, search:"Tbilisi BBQ outdoor restaurant ruined building" },
];

// ── API helpers (same as main script) ────────────────────────────────────────

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': USER_AGENT } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return httpsGet(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

async function searchCommonsImage(searchTerm) {
  const encoded = encodeURIComponent(searchTerm);
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encoded}&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url&iiurlwidth=1200&format=json`;
  try {
    const res = await httpsGet(url);
    if (res.status !== 200) return null;
    const data = JSON.parse(res.body);
    const pages = data.query?.pages;
    if (!pages) return null;
    for (const page of Object.values(pages)) {
      const url = page?.imageinfo?.[0]?.thumburl;
      if (url && (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png'))) {
        return url;
      }
    }
    return null;
  } catch { return null; }
}

function downloadImage(imageUrl, destPath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(destPath)) {
      process.stdout.write('(already exists) ');
      return resolve(true);
    }
    const file = fs.createWriteStream(destPath);
    const req = https.get(imageUrl, { headers: { 'User-Agent': USER_AGENT } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(destPath);
        return downloadImage(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(true); });
    });
    req.on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(err);
    });
    req.setTimeout(20000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  // Auto-detect which images are actually missing
  const toFetch = MISSING.filter(p => !fs.existsSync(path.join(IMAGES_DIR, `place-${p.id}.jpg`)));

  if (toFetch.length === 0) {
    console.log('\n✅ No missing images — all place-N.jpg files exist!');
    console.log('Run: node resize-images.js ..\\..\\wanderlush\\tbilisi\n');
    return;
  }

  console.log('\n🔄 Wander-Lush Tbilisi — Missing Images Fallback');
  console.log('==================================================');
  console.log(`${toFetch.length} images missing. Trying broader searches...\n`);

  const stillFailed = [];

  for (const p of toFetch) {
    const filename = `place-${p.id}.jpg`;
    const destPath = path.join(IMAGES_DIR, filename);
    process.stdout.write(`  [${String(p.id).padStart(2, '0')}] ${filename} — "${p.search}" ... `);

    try {
      const imageUrl = await searchCommonsImage(p.search);
      if (!imageUrl) {
        console.log('✗ still nothing');
        stillFailed.push(p);
        continue;
      }
      await downloadImage(imageUrl, destPath);
      console.log('✓');
    } catch (err) {
      console.log(`✗ ${err.message}`);
      stillFailed.push(p);
    }

    await new Promise(r => setTimeout(r, 400));
  }

  console.log('\n==================================================');
  if (stillFailed.length === 0) {
    console.log('✅ All missing images now resolved!');
  } else {
    console.log(`⚠️  ${stillFailed.length} still missing after fallback:`);
    stillFailed.forEach(p => console.log(`  - place-${p.id}.jpg (id ${p.id})`));
    console.log('\nFor these, grab a free image manually from:');
    console.log('  https://unsplash.com  (search for Tbilisi / Georgia / relevant term)');
    console.log('  Save as place-N.jpg in the images/ folder');
  }
  console.log('\nNext: node resize-images.js ..\\..\\wanderlush\\tbilisi');
  console.log('(Run from general\\_scripts\\ where sharp is installed)\n');
}

main().catch(console.error);
