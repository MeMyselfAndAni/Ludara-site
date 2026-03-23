// fetch-images-drizzleanddip-capetown.js
// Downloads Sam Linsell's photos from drizzleanddip.com
// for the A Perfect Day Cape Town guide.
//
// Run from: aperfectday/drizzleanddip/capetown/
// Command:  node fetch-images-drizzleanddip-capetown.js
//
// Requires: npm install node-fetch (or Node 18+ which has native fetch)
// Output:   images/place-1.jpg through images/place-43.jpg

const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');

const IMAGES_DIR = path.join(__dirname, 'images');
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR);

// ─── Place ID → Image URL mapping ────────────────────────────────────────────
// All images are Sam's own photography from drizzleanddip.com
const IMAGES = {
  1:  'https://drizzleanddip.com/wp-content/uploads/2025/12/main-amura-pic.jpg',           // Amura
  2:  'https://drizzleanddip.com/wp-content/uploads/2021/09/O6A0323.jpg',                   // Fyn
  3:  'https://drizzleanddip.com/wp-content/uploads/2023/03/DSF5849.jpg',                   // Salon Pot Luck
  4:  'https://drizzleanddip.com/wp-content/uploads/2023/07/DSF7880.jpg',                   // Pier
  5:  'https://drizzleanddip.com/wp-content/uploads/2023/07/pier-1.jpg',                    // COY (reuse Pier shot)
  6:  'https://drizzleanddip.com/wp-content/uploads/2023/11/DSF0167.jpg',                   // Ouzeri
  7:  'https://drizzleanddip.com/wp-content/uploads/2017/06/Ongetem-1.jpg',                 // Ongetem
  8:  'https://drizzleanddip.com/wp-content/uploads/2021/03/O6A5236.jpg',                   // Blondie (Ëlgr image)
  9:  'https://drizzleanddip.com/wp-content/uploads/2017/06/DSF9153.jpg',                   // Pot Luck Club
  10: 'https://drizzleanddip.com/wp-content/uploads/2017/06/7O6A9293.jpg',                  // El Burro (Kalk Bay mood)
  11: 'https://drizzleanddip.com/wp-content/uploads/2023/11/DSF0107.jpg',                   // Bao Down (Ouzeri interior)
  12: 'https://drizzleanddip.com/wp-content/uploads/2022/03/O6A5636.jpg',                   // IL Leone (Post & Pepper interior)
  13: 'https://drizzleanddip.com/wp-content/uploads/2017/06/Ramen-bowl.jpg',                // Ramenhead
  14: 'https://drizzleanddip.com/wp-content/uploads/2023/12/7O9A9730.jpg',                  // Kyoto (SCAPE table)
  15: 'https://drizzleanddip.com/wp-content/uploads/2017/06/7O9A0028-scaled.jpg',           // Galjoen
  16: 'https://drizzleanddip.com/wp-content/uploads/2017/06/7O9A0051-scaled.jpg',           // Hemelhuijs (Galjoen detail)
  17: 'https://drizzleanddip.com/wp-content/uploads/2017/06/DSF0032.jpg',                   // Athletic Club (Arlecchino interior)
  18: 'https://drizzleanddip.com/wp-content/uploads/2017/01/7O6A9494.jpg',                  // Oranjezicht Market
  19: 'https://drizzleanddip.com/wp-content/uploads/2022/09/7O6A0139-1.jpg',                // Neighbourgoods (Tintswalo mood)
  20: 'https://drizzleanddip.com/wp-content/uploads/2017/06/Arlecchino-1.jpg',              // Arlecchino
  21: 'https://drizzleanddip.com/wp-content/uploads/2017/06/IMG_6927.jpg',                  // Kleinsky's (Bistro 1682)
  22: 'https://drizzleanddip.com/wp-content/uploads/2023/11/DSF0167.jpg',                   // He Sheng (reuse Ouzeri)
  23: 'https://drizzleanddip.com/wp-content/uploads/2023/12/7O9A9786.jpg',                  // Sundoo's (SCAPE detail)
  24: 'https://drizzleanddip.com/wp-content/uploads/2017/06/salsify-2.jpg',                 // Salsify
  25: 'https://drizzleanddip.com/wp-content/uploads/2022/02/O6A5146.jpg',                   // La Colombe
  26: 'https://drizzleanddip.com/wp-content/uploads/2016/12/7O6A9017.jpg',                  // Chefs Warehouse Beau Constantia
  27: 'https://drizzleanddip.com/wp-content/uploads/2017/06/IMG_6927.jpg',                  // Bistro 1682
  28: 'https://drizzleanddip.com/wp-content/uploads/2017/06/7O6A9286.jpg',                  // Olympia Cafe
  29: 'https://drizzleanddip.com/wp-content/uploads/2017/06/7O6A9294.jpg',                  // Harbour House
  30: 'https://drizzleanddip.com/wp-content/uploads/2018/10/O6A1643.jpg',                   // The Foodbarn
  31: 'https://drizzleanddip.com/wp-content/uploads/2017/06/FullSizeRender-2.jpg',          // Aegir (Noordhoek)
  32: 'https://drizzleanddip.com/wp-content/uploads/2022/09/7O6A0139-1.jpg',                // Tintswalo Atlantic
  33: 'https://drizzleanddip.com/wp-content/uploads/2022/03/O6A5601.jpg',                   // Post & Pepper
  34: 'https://drizzleanddip.com/wp-content/uploads/2017/06/octopus.jpg',                   // Arum at Boschendal
  35: 'https://drizzleanddip.com/wp-content/uploads/2017/06/IMG_9549.jpg',                  // The Table at De Meye
  36: 'https://drizzleanddip.com/wp-content/uploads/2018/10/O6A2035.jpg',                   // Good to Gather (Kraal)
  37: 'https://drizzleanddip.com/wp-content/uploads/2015/07/7O6A7896.jpg',                  // Delaire Graff
  38: 'https://drizzleanddip.com/wp-content/uploads/2022/03/O6A5636.jpg',                   // Spek & Bone (Post & Pepper detail)
  39: 'https://drizzleanddip.com/wp-content/uploads/2019/08/O6A0382.jpg',                   // La Petite Colombe
  40: 'https://drizzleanddip.com/wp-content/uploads/2022/06/O6A7834.jpg',                   // Epice
  41: 'https://drizzleanddip.com/wp-content/uploads/2016/12/7O6A9027.jpg',                  // Chefs Warehouse Maison (Beau Constantia)
  42: 'https://drizzleanddip.com/wp-content/uploads/2021/08/O6A9335.jpg',                   // Babylonstoren
  43: 'https://drizzleanddip.com/wp-content/uploads/2017/03/7O6A1468.jpg',                  // Wolfgat
};

// ─── Download function ────────────────────────────────────────────────────────
function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(destPath)) {
      console.log(`  ✓ Already exists: ${path.basename(destPath)}`);
      return resolve();
    }

    const client = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(destPath);

    const req = client.get(url, {
      headers: {
        'User-Agent': 'APerfectDayGuide/1.0 (ludara.ai; contact@ludara.ai)',
      }
    }, (res) => {
      // Handle redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(destPath);
        return downloadImage(res.headers.location, destPath).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }

      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    });

    req.on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(err);
    });

    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error(`Timeout: ${url}`));
    });
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🌍 Drizzle & Dip — Cape Town Image Downloader');
  console.log('================================================');
  console.log(`Downloading ${Object.keys(IMAGES).length} images to images/\n`);

  const failed = [];

  for (const [id, url] of Object.entries(IMAGES)) {
    const filename = `place-${id}.jpg`;
    const destPath = path.join(IMAGES_DIR, filename);
    process.stdout.write(`  [${String(id).padStart(2, '0')}] ${filename} ... `);

    try {
      await downloadImage(url, destPath);
      console.log('✓');
    } catch (err) {
      console.log(`✗ FAILED: ${err.message}`);
      failed.push({ id, url, error: err.message });
    }

    // Small delay to be polite to her server
    await new Promise(r => setTimeout(r, 300));
  }

  console.log('\n================================================');
  if (failed.length === 0) {
    console.log(`✅ All ${Object.keys(IMAGES).length} images downloaded successfully!`);
    console.log('\nNext step: run the resize script from general/_scripts/');
    console.log('  node resize-images.js ..\\drizzleanddip\\capetown');
  } else {
    console.log(`⚠️  ${Object.keys(IMAGES).length - failed.length} succeeded, ${failed.length} failed:`);
    failed.forEach(f => console.log(`  - place-${f.id}.jpg: ${f.error}`));
    console.log('\nFor failed images, grab them manually from drizzleanddip.com');
  }
  console.log('');
}

main().catch(console.error);
