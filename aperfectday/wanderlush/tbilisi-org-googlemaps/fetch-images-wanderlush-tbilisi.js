// fetch-images-wanderlush-tbilisi.js
// Fetches the 9 NEW images from Wikimedia Commons for the
// A Perfect Day — Wander-Lush / Tbilisi guide.
//
// 42 of 51 images have been reused from the previous guide version.
// This script only fetches the 9 new entries:
//   10  Bazari Orbeliani
//   17  Karmir Avetaran (Armenian cathedral ruins)
//   18  Queen Darejan's Palace
//   19  St. Abo Tbileli chapel
//   29  Trade Union Palace of Culture
//   39  Apotheka Bar
//   40  Communal Hotel Plekhanovi
//   50  The Cone Culture
//   51  Deda Tbilisi
//
// Run from:  aperfectday/wanderlush/tbilisi/
// Command:   node fetch-images-wanderlush-tbilisi.js
//
// If any fail, run: node fetch-images-wanderlush-tbilisi-missing.js
// Then resize:      node resize-images.js ..\..\wanderlush\tbilisi
//                   (from general\_scripts\ where sharp is installed)

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const IMAGES_DIR = path.join(__dirname, 'images');
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR);

const USER_AGENT = 'APerfectDayGuide/1.0 (ludara.ai; contact@ludara.ai) node-https';

const PLACES = [
  { id:10, name:"Bazari Orbeliani",              wikiTitle: null,                       search:"Bazari Orbeliani market food hall Tbilisi" },
  { id:17, name:"Karmir Avetaran Church",        wikiTitle: "Karmir Avetaran Church",   search:"Armenian cathedral ruins Tbilisi Avlabari" },
  { id:18, name:"Queen Darejan's Palace",        wikiTitle: "Sachino Palace",           search:"Queen Darejan Palace Sachino Avlabari Tbilisi" },
  { id:19, name:"St. Abo Tbileli Chapel",        wikiTitle: null,                       search:"Metekhi cliff river chapel Tbilisi stone" },
  { id:29, name:"Trade Union Palace of Culture", wikiTitle: null,                       search:"Trade Union Palace Culture Tbilisi Soviet mosaic" },
  { id:39, name:"Apotheka Bar",                  wikiTitle: null,                       search:"historic pharmacy interior bar cocktails antique" },
  { id:40, name:"Communal Hotel Plekhanovi",     wikiTitle: null,                       search:"Tbilisi boutique hotel interior wine bar" },
  { id:50, name:"The Cone Culture",              wikiTitle: null,                       search:"artisan ice cream cone Georgia Tbilisi" },
  { id:51, name:"Deda Tbilisi",                  wikiTitle: null,                       search:"Tbilisi outdoor restaurant ruins BBQ atmosphere" },
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

async function getWikipediaImage(title) {
  const encoded = encodeURIComponent(title);
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encoded}&prop=pageimages&pithumbsize=1200&format=json`;
  try {
    const res = await httpsGet(url);
    if (res.status !== 200) return null;
    const data = JSON.parse(res.body);
    const pages = data.query?.pages;
    if (!pages) return null;
    const page = Object.values(pages)[0];
    return page?.thumbnail?.source || null;
  } catch { return null; }
}

async function searchCommonsImage(searchTerm) {
  const encoded = encodeURIComponent(searchTerm);
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encoded}&gsrnamespace=6&gsrlimit=6&prop=imageinfo&iiprop=url&iiurlwidth=1200&format=json`;
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
    if (fs.existsSync(destPath)) {
      process.stdout.write('(already exists) ');
      return resolve(true);
    }
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
  const toFetch = PLACES.filter(p => !fs.existsSync(path.join(IMAGES_DIR, `place-${p.id}.jpg`)));

  if (toFetch.length === 0) {
    console.log('\n✅ All 9 new images already present!');
    console.log('Next: node resize-images.js ..\\..\\wanderlush\\tbilisi\n');
    return;
  }

  console.log('\n🗺  Wander-Lush Tbilisi — Fetch 9 New Images');
  console.log('=============================================');
  console.log(`Fetching ${toFetch.length} images (42 already reused from previous version)\n`);

  const failed = [];

  for (const p of toFetch) {
    const destPath = path.join(IMAGES_DIR, `place-${p.id}.jpg`);
    process.stdout.write(`  [${String(p.id).padStart(2, '0')}] ${p.name} ... `);

    try {
      let imageUrl = null;
      if (p.wikiTitle) {
        imageUrl = await getWikipediaImage(p.wikiTitle);
        if (imageUrl) process.stdout.write('[wiki] ');
      }
      if (!imageUrl) {
        imageUrl = await searchCommonsImage(p.search);
        if (imageUrl) process.stdout.write('[commons] ');
      }
      if (!imageUrl) { console.log('✗ not found'); failed.push(p); continue; }
      await downloadImage(imageUrl, destPath);
      console.log('✓');
    } catch (err) {
      console.log(`✗ ${err.message}`); failed.push(p);
    }
    await new Promise(r => setTimeout(r, 400));
  }

  console.log('\n=============================================');
  if (failed.length === 0) {
    console.log(`✅ All ${toFetch.length} new images downloaded! 51/51 ready.`);
  } else {
    console.log(`⚠️  ${failed.length} failed:`);
    failed.forEach(p => console.log(`  - place-${p.id}.jpg (${p.name})`));
    console.log('\nRun fetch-images-wanderlush-tbilisi-missing.js for these.');
  }
  console.log('\nNext: node resize-images.js ..\\..\\wanderlush\\tbilisi');
  console.log('(Run from general\\_scripts\\ where sharp is installed)\n');
}

main().catch(console.error);
