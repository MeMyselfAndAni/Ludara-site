// fetch-images-wanderlush-tbilisi.js
// Fetches photos from Wikimedia Commons / Wikipedia for the
// A Perfect Day — Wander-Lush / Tbilisi guide.
//
// Run from:  aperfectday/wanderlush/tbilisi/
// Command:   node fetch-images-wanderlush-tbilisi.js
//
// Step 1 of 3. After this, run:
//   node fetch-images-wanderlush-tbilisi-missing.js   (for any that failed)
//   node resize-images.js ..\..\wanderlush\tbilisi    (from general\_scripts\)
//
// Wikimedia API requires a User-Agent — we use ours as required.

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const IMAGES_DIR = path.join(__dirname, 'images');
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR);

const USER_AGENT = 'APerfectDayGuide/1.0 (ludara.ai; contact@ludara.ai) node-https';

// ── Place definitions ─────────────────────────────────────────────────────────
// wikiTitle: exact Wikipedia article title  → fetches lead image from that article
// wikiTitle: null                           → falls back to Wikimedia Commons search
//                                             using the `search` term below
//
// Strategy:
//   - Famous landmarks: use their Wikipedia article (most reliable, great photos)
//   - Restaurants / cafes / private venues: null → Commons search for food/mood shot
// ─────────────────────────────────────────────────────────────────────────────

const PLACES = [
  // ── Landmarks & Creative Spaces ─────────────────────────────────────────────
  { id:1,  name:"Fabrika",                        wikiTitle: null,                                    search:"Fabrika Tbilisi creative hub" },
  { id:2,  name:"Abanotubani Sulfur Baths",       wikiTitle: "Abanotubani",                           search:"Abanotubani sulfur baths Tbilisi" },
  { id:3,  name:"Narikala Fortress",              wikiTitle: "Narikala",                              search:"Narikala fortress Tbilisi" },
  { id:4,  name:"Mother of Georgia",              wikiTitle: "Kartlis Deda",                          search:"Mother of Georgia statue Tbilisi" },
  { id:5,  name:"Gabriadze Marionette Theatre",   wikiTitle: "Rezo Gabriadze Marionette Theatre",     search:"Gabriadze theatre clock tower Tbilisi" },
  { id:6,  name:"Opera & Ballet Theatre",         wikiTitle: "Tbilisi Opera and Ballet Theatre",      search:"Tbilisi Opera Theatre Rustaveli" },
  { id:7,  name:"Georgian National Museum",       wikiTitle: "Georgian National Museum",              search:"Georgian National Museum Tbilisi Rustaveli" },
  { id:8,  name:"Rike Park & Bridge of Peace",    wikiTitle: "Bridge of Peace (Tbilisi)",             search:"Bridge of Peace Tbilisi Rike Park" },
  { id:9,  name:"Bitadze Tea Museum",             wikiTitle: null,                                    search:"Georgian tea Tbilisi tea museum" },
  { id:10, name:"Bazari Orbeliani",               wikiTitle: null,                                    search:"Bazari Orbeliani market Tbilisi food hall" },

  // ── Churches & Spiritual ─────────────────────────────────────────────────────
  { id:11, name:"Holy Trinity Cathedral (Sameba)", wikiTitle: "Holy Trinity Cathedral, Tbilisi",     search:"Sameba Cathedral Tbilisi" },
  { id:12, name:"Anchiskhati Basilica",            wikiTitle: "Anchiskhati",                         search:"Anchiskhati Basilica oldest church Tbilisi" },
  { id:13, name:"Sioni Cathedral",                 wikiTitle: "Sioni Cathedral",                     search:"Sioni Cathedral Tbilisi" },
  { id:14, name:"Metekhi Church",                  wikiTitle: "Metekhi Church",                      search:"Metekhi Church cliff Tbilisi river" },
  { id:15, name:"Ateshgah Fire Temple",            wikiTitle: null,                                   search:"Ateshgah Zoroastrian fire temple Tbilisi" },
  { id:16, name:"Juma Mosque",                     wikiTitle: "Tbilisi Mosque",                      search:"Tbilisi mosque minaret sulfur baths" },
  { id:17, name:"Karmir Avetaran",                 wikiTitle: "Karmir Avetaran Church",              search:"Armenian cathedral ruins Tbilisi Avlabari" },
  { id:18, name:"Queen Darejan's Palace",          wikiTitle: "Sachino Palace",                      search:"Queen Darejan Palace Avlabari Tbilisi" },
  { id:19, name:"St. Abo Tbileli Chapel",          wikiTitle: null,                                   search:"Metekhi cliff river chapel Tbilisi" },

  // ── Walking, Nature & Views ──────────────────────────────────────────────────
  { id:20, name:"Betlemi Street Stairs",           wikiTitle: null,                                   search:"Betlemi Street Tbilisi old town balconies" },
  { id:21, name:"Tabor Monastery Viewpoint",       wikiTitle: null,                                   search:"Tabor Monastery Tbilisi viewpoint panorama" },
  { id:22, name:"King Parnavaz Garden",            wikiTitle: null,                                   search:"Tbilisi sunset Avlabari river view" },
  { id:23, name:"Leghvtakhevi Waterfall",          wikiTitle: "Leghvtakhevi",                        search:"Leghvtakhevi waterfall gorge Tbilisi" },
  { id:24, name:"National Botanical Garden",       wikiTitle: "Tbilisi Botanical Garden",            search:"Tbilisi Botanical Garden Narikala" },
  { id:25, name:"Mtatsminda Pantheon & Funicular", wikiTitle: "Mtatsminda",                          search:"Mtatsminda Pantheon Tbilisi funicular" },
  { id:26, name:"Turtle Lake & Ethnography Museum",wikiTitle: "Open-Air Museum of Ethnography (Tbilisi)", search:"Turtle Lake Tbilisi ethnography museum" },
  { id:27, name:"Rike–Narikala Cable Car",         wikiTitle: null,                                   search:"Tbilisi cable car ropeway aerial view" },

  // ── Soviet Heritage ──────────────────────────────────────────────────────────
  { id:28, name:"Stalin's Underground Printing Press", wikiTitle: "Stalin's Underground Printing House", search:"Stalin underground printing press Tbilisi museum" },
  { id:29, name:"Trade Union Palace of Culture",   wikiTitle: null,                                   search:"Trade Union Palace Culture Tbilisi Soviet mosaic Tsereteli" },
  { id:30, name:"Saburtalo Skybridge",             wikiTitle: "Nutsubidze Skybridge",                search:"Nutsubidze Skybridge Tbilisi Brutalist" },
  { id:31, name:"Chronicles of Georgia",           wikiTitle: "Chronicles of Georgia (monument)",    search:"Chronicles of Georgia monument pillars Tbilisi" },

  // ── Markets ──────────────────────────────────────────────────────────────────
  { id:32, name:"Dezerter Bazaar",                 wikiTitle: null,                                   search:"Dezerter Bazaar Tbilisi open air market spices" },
  { id:33, name:"Dry Bridge Market",               wikiTitle: "Dry Bridge (Tbilisi)",                search:"Dry Bridge flea market antiques Tbilisi" },

  // ── Cafés & Bars ─────────────────────────────────────────────────────────────
  { id:34, name:"Stamba Hotel",                    wikiTitle: null,                                   search:"Stamba Hotel Tbilisi Soviet printing house interior" },
  { id:35, name:"Wine Factory N1",                 wikiTitle: null,                                   search:"Wine Factory N1 Tbilisi bar wine" },
  { id:36, name:"Vino Underground",                wikiTitle: null,                                   search:"Georgian natural wine amber qvevri bar" },
  { id:37, name:"Coffee LAB",                      wikiTitle: null,                                   search:"specialty coffee Tbilisi roastery cafe" },
  { id:38, name:"Funicular Cafe — Ponchiki",       wikiTitle: null,                                   search:"Mtatsminda funicular Tbilisi ponchiki donuts" },
  { id:39, name:"Apotheka Bar",                    wikiTitle: null,                                   search:"historic pharmacy bar cocktails interior" },
  { id:40, name:"Communal Hotel Plekhanovi",       wikiTitle: null,                                   search:"Tbilisi boutique hotel wine bar Chugureti" },

  // ── Restaurants ──────────────────────────────────────────────────────────────
  { id:41, name:"Shemomechama",                    wikiTitle: null,                                   search:"Georgian food restaurant Tbilisi khinkali lobiani" },
  { id:42, name:"Amo Rame Bani",                   wikiTitle: null,                                   search:"khinkali dumplings Georgian restaurant Tbilisi" },
  { id:43, name:"Cafe Daphna",                     wikiTitle: null,                                   search:"Cafe Daphna Tbilisi pink interior khinkali" },
  { id:44, name:"Barbarestan",                     wikiTitle: null,                                   search:"Barbarestan restaurant Tbilisi Georgian cuisine" },
  { id:45, name:"Ninia's Garden",                  wikiTitle: null,                                   search:"Georgian courtyard restaurant garden Tbilisi summer" },
  { id:46, name:"Sasadilo Zeche",                  wikiTitle: null,                                   search:"Georgian canteen workers lunch Soviet Tbilisi" },
  { id:47, name:"Amra — Abkhazian Cuisine",        wikiTitle: null,                                   search:"Abkhazian food ajika Tbilisi restaurant" },
  { id:48, name:"Cafe Leila",                      wikiTitle: null,                                   search:"Georgian sweets pastry cafe Tbilisi rose cardamom" },
  { id:49, name:"ATI Restaurant",                  wikiTitle: null,                                   search:"Tbilisi restaurant view rooftop Georgian fine dining" },
  { id:50, name:"The Cone Culture",                wikiTitle: null,                                   search:"ice cream cone Tbilisi artisan ajika" },
  { id:51, name:"Deda Tbilisi",                    wikiTitle: null,                                   search:"Tbilisi ruin bar outdoor BBQ restaurant Old Town" },
];

// ── Wikimedia API helpers ─────────────────────────────────────────────────────

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

// Get lead image URL from a Wikipedia article
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

// Search Wikimedia Commons for an image
async function searchCommonsImage(searchTerm) {
  const encoded = encodeURIComponent(searchTerm);
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encoded}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url&iiurlwidth=1200&format=json`;
  try {
    const res = await httpsGet(url);
    if (res.status !== 200) return null;
    const data = JSON.parse(res.body);
    const pages = data.query?.pages;
    if (!pages) return null;
    // Return the first result that is a JPG or PNG (skip SVGs and maps)
    for (const page of Object.values(pages)) {
      const url = page?.imageinfo?.[0]?.thumburl;
      if (url && (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png'))) {
        return url;
      }
    }
    return null;
  } catch { return null; }
}

// Download image from URL to file
function downloadImage(imageUrl, destPath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(destPath)) {
      process.stdout.write('(cached) ');
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
  console.log('\n🗺 Wander-Lush — Tbilisi Image Fetcher (Wikimedia)');
  console.log('====================================================');
  console.log(`Fetching ${PLACES.length} images to images/\n`);

  const failed = [];

  for (const p of PLACES) {
    const filename = `place-${p.id}.jpg`;
    const destPath = path.join(IMAGES_DIR, filename);
    process.stdout.write(`  [${String(p.id).padStart(2, '0')}] ${filename} — ${p.name} ... `);

    try {
      let imageUrl = null;

      // Step 1: Try Wikipedia article if wikiTitle given
      if (p.wikiTitle) {
        process.stdout.write(`[wiki: ${p.wikiTitle}] `);
        imageUrl = await getWikipediaImage(p.wikiTitle);
      }

      // Step 2: Fall back to Commons search
      if (!imageUrl) {
        process.stdout.write(`[commons: "${p.search}"] `);
        imageUrl = await searchCommonsImage(p.search);
      }

      if (!imageUrl) {
        console.log('✗ NO IMAGE FOUND');
        failed.push(p);
        continue;
      }

      await downloadImage(imageUrl, destPath);
      console.log('✓');

    } catch (err) {
      console.log(`✗ ERROR: ${err.message}`);
      failed.push(p);
    }

    // Polite delay — don't hammer Wikimedia
    await new Promise(r => setTimeout(r, 400));
  }

  console.log('\n====================================================');
  if (failed.length === 0) {
    console.log(`✅ All ${PLACES.length} images downloaded!`);
  } else {
    console.log(`⚠️  ${PLACES.length - failed.length} succeeded, ${failed.length} failed:`);
    failed.forEach(p => console.log(`  - place-${p.id}.jpg: ${p.name}`));
    console.log('\nRun fetch-images-wanderlush-tbilisi-missing.js for these.');
  }
  console.log('\nNext: node resize-images.js ..\\..\\wanderlush\\tbilisi');
  console.log('(Run from general\\_scripts\\ where sharp is installed)\n');
}

main().catch(console.error);
