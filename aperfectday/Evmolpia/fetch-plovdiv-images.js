// fetch-plovdiv-images.js
// Downloads the 7 Wikimedia Commons landmark photos for the Plovdiv guide
// into ./images/place-{id}.jpg. Run once, from the Evmolpia folder:
//     node fetch-plovdiv-images.js
// No npm packages needed (uses Node's built-in https). Node 18+ recommended.
//
// Licences (kept in credits.js, shown on each card):
//   1 Roman Theatre        MrPanyGoff          CC BY-SA 3.0
//   2 Nebet Tepe           Laurens R. Krol     CC BY 4.0
//   3 Ethnographic Museum  Klearchos Kapoutsis CC BY 2.0
//   4 Balabanov House      Whitepixels         CC0 (Public Domain)
//   5 Ancient Stadium      Laurens R. Krol     CC BY 4.0
//   6 Dzhumaya Mosque      Explorer1940        CC BY-SA 4.0
//   7 Kapana District      Predavatel          Public domain
//  21 Bachkovo Monastery   Michael Desnoyelles CC BY-SA 4.0
//  22 Asen's Fortress      Eric T Gunther      CC BY-SA 3.0

const https = require('https');
const fs = require('fs');
const path = require('path');

const FILES = {
  1: 'Roman Theatre Plovdiv 3.jpg',
  2: '2016-07-30 Bulgaria, Plovdiv, Nebet Tepe DSC 9103 DxO 1.jpg',
  3: 'Regional Ethnographic Museum, Plovdiv.jpg',
  4: 'Plovdiv Balabanov house 01.jpg',
  5: '2016-07-30 Bulgaria, Plovdiv, Philippopolis stadium DSC 9038 DxO PS.jpg',
  6: 'Plovdiv -- Dzhumaya Mosque 01.jpg',
  7: 'Plovdiv Kapana.jpg',
  21: 'Bachkovo Monastery - Inside court and church.jpg',
  22: "Asen's Fortress view from road.JPG"
};

// Venue photos — each place's own website/hero image (venue-credited in credits.js).
// Six venues (Pavaj, Rahat Tepe, Monkey House, Dwell, Vino Culture, SKLAD) are
// Facebook/Instagram-only, so they have no downloadable photo and keep the emoji card.
const VENUE_URLS = {
  9:  'https://aylyakria.com/wp-content/uploads/2021/09/home-hero-image.jpg',
  10: 'https://static.wixstatic.com/media/2f09d0_5c4d6adbe1c4400488de737071255672~mv2.jpg',
  12: 'https://storage.googleapis.com/smokini/images/000/000/620/image/Smokini_Plovdiv.jpg',
  13: 'https://hemingway.bg/wp-content/uploads/2023/01/%D0%A2%D0%B0%D0%BB%D0%B8%D0%B0%D1%82%D0%B5%D0%BB%D0%B8-%D0%91%D0%BE%D0%BB%D0%BE%D0%BD%D0%B5%D0%B7%D0%B5-1150x750.jpg',
  15: 'https://artnewscafe.com/wp-content/uploads/2022/03/DSC0047-2-scaled.jpg',
  17: 'https://catandmouse.bg/assets/front/img/about/01t.jpg',
  19: 'https://andromeda-art.com/style/images/art/S/S-C2.jpg'
};

const WIDTH = 1000; // downscaled server-side; good for the detail card
const OUT_DIR = path.join(__dirname, 'images');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function urlFor(fname) {
  return 'https://commons.wikimedia.org/wiki/Special:FilePath/' +
    encodeURIComponent(fname) + '?width=' + WIDTH;
}

function download(id, fileUrl) {
  return new Promise((resolve, reject) => {
    const dest = path.join(OUT_DIR, 'place-' + id + '.jpg');
    const get = (url, redirects) => {
      https.get(url, {
        headers: { 'User-Agent': 'LudaraAPerfectDay/1.0 (mmlando@gmail.com)' }
      }, res => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
          if (redirects > 6) return reject(new Error('too many redirects'));
          res.resume();
          return get(res.headers.location, redirects + 1);
        }
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error('HTTP ' + res.statusCode + ' for ' + fname));
        }
        const out = fs.createWriteStream(dest);
        res.pipe(out);
        out.on('finish', () => out.close(() => resolve(dest)));
        out.on('error', reject);
      }).on('error', reject);
    };
    get(fileUrl, 0);
  });
}

(async () => {
  console.log('Downloading Plovdiv landmark photos (Wikimedia Commons)...\n');
  for (const [id, fname] of Object.entries(FILES)) {
    try {
      const p = await download(id, urlFor(fname));
      const kb = Math.round(fs.statSync(p).size / 1024);
      console.log('  [ok]   place-' + id + '.jpg  (' + kb + ' KB)  <- ' + fname);
    } catch (e) {
      console.log('  [FAIL] place-' + id + '.jpg  : ' + e.message);
    }
  }
  console.log('\nDownloading venue photos (each place\'s own website)...\n');
  for (const [id, url] of Object.entries(VENUE_URLS)) {
    try {
      const p = await download(id, url);
      const kb = Math.round(fs.statSync(p).size / 1024);
      console.log('  [ok]   place-' + id + '.jpg  (' + kb + ' KB)');
    } catch (e) {
      console.log('  [FAIL] place-' + id + '.jpg  : ' + e.message);
    }
  }
  console.log('\nDone. Images are in ' + OUT_DIR);
  console.log('16 of 22 places now have a photo; the 6 Facebook/Instagram-only');
  console.log('venues (Pavaj, Rahat Tepe, Monkey House, Dwell, Vino Culture, SKLAD) keep the emoji card.');
  console.log('Open index.html to see them.');
})();
