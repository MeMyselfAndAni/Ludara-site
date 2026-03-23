// fetch-images-wanderlush-tbilisi-missing.js
// Fallback for any of the 9 new images that failed in the main script.
// Uses broader search terms.
//
// Run from: aperfectday/wanderlush/tbilisi/
// Auto-detects which place-N.jpg files are still missing.

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const IMAGES_DIR = path.join(__dirname, 'images');
const USER_AGENT = 'APerfectDayGuide/1.0 (ludara.ai; contact@ludara.ai) node-https';

// Broader fallback terms for the 9 new entries
const FALLBACKS = [
  { id:10, search:"Tbilisi covered market food court historic building" },
  { id:17, search:"Armenian ruins Tbilisi historic church collapsed" },
  { id:18, search:"Sachino Palace Tbilisi balcony historic Georgian" },
  { id:19, search:"Tbilisi Mtkvari river cliff stone church Georgia" },
  { id:29, search:"Soviet mosaic building Georgia coloured glass architecture" },
  { id:39, search:"old pharmacy interior antique wooden cabinets" },
  { id:40, search:"Georgia boutique hotel interior design Tbilisi" },
  { id:50, search:"Georgia ice cream dessert Tbilisi colourful food" },
  { id:51, search:"Tbilisi restaurant alfresco garden Old Town evening" },
];

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
      const imgUrl = page?.imageinfo?.[0]?.thumburl;
      if (imgUrl && (imgUrl.includes('.jpg') || imgUrl.includes('.jpeg') || imgUrl.includes('.png'))) {
        return imgUrl;
      }
    }
    return null;
  } catch { return null; }
}

function downloadImage(imageUrl, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const req = https.get(imageUrl, { headers: { 'User-Agent': USER_AGENT } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close(); fs.unlinkSync(destPath);
        return downloadImage(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close(); if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(true); });
    });
    req.on('error', (err) => {
      file.close(); if (fs.existsSync(destPath)) fs.unlinkSync(destPath); reject(err);
    });
    req.setTimeout(20000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

async function main() {
  const toFetch = FALLBACKS.filter(p => !fs.existsSync(path.join(IMAGES_DIR, `place-${p.id}.jpg`)));

  if (toFetch.length === 0) {
    console.log('\n✅ No missing images — all place-N.jpg files exist!');
    console.log('Next: node resize-images.js ..\\..\\wanderlush\\tbilisi\n');
    return;
  }

  console.log('\n🔄 Wander-Lush Tbilisi — Missing Images Fallback');
  console.log('=================================================');
  console.log(`${toFetch.length} still missing. Trying broader searches...\n`);

  const stillFailed = [];

  for (const p of toFetch) {
    const destPath = path.join(IMAGES_DIR, `place-${p.id}.jpg`);
    process.stdout.write(`  [${String(p.id).padStart(2, '0')}] "${p.search}" ... `);
    try {
      const imageUrl = await searchCommonsImage(p.search);
      if (!imageUrl) { console.log('✗ still nothing'); stillFailed.push(p); continue; }
      await downloadImage(imageUrl, destPath);
      console.log('✓');
    } catch (err) {
      console.log(`✗ ${err.message}`); stillFailed.push(p);
    }
    await new Promise(r => setTimeout(r, 400));
  }

  console.log('\n=================================================');
  if (stillFailed.length === 0) {
    console.log('✅ All missing images resolved!');
  } else {
    console.log(`⚠️  ${stillFailed.length} still missing:`);
    stillFailed.forEach(p => console.log(`  - place-${p.id}.jpg`));
    console.log('\nFor these, grab a free image from https://unsplash.com');
    console.log('Search for: Tbilisi, Georgia food, Georgian restaurant etc.');
    console.log('Save as place-N.jpg in the images/ folder.');
  }
  console.log('\nNext: node resize-images.js ..\\..\\wanderlush\\tbilisi');
  console.log('(Run from general\\_scripts\\ where sharp is installed)\n');
}

main().catch(console.error);
