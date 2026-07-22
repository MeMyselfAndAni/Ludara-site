// fetch-images-seoul-safe.js
// (Re)downloads the license-safe Wikimedia Commons images that changed during the
// image-safety cleanup: the 12 landmark entries (54-65) plus the Jogyesa file (18)
// whose Commons page had moved. Overwrites images/place-{id}.jpg for these ids only.
// The other images (already Wikimedia + ZenKimchi) are left untouched.
//
// Run from this folder:   node fetch-images-seoul-safe.js
// No npm packages needed (Node's built-in https). Attribution is in credits.js.

const https = require('https');
const fs = require('fs');
const path = require('path');

const FILES = {
  18: 'Seoul-Buddhist.temple-Jogyesa-01.jpg',
  54: 'Bukchon-ro 11-gil street with hanok houses at blue hour in Bukchon Hanok Village Seoul.jpg',
  55: 'Changdeokgung Seoul 3.jpg',
  56: 'Seoul-Samcheong.dong-01.jpg',
  57: 'Cheonggyecheon stream at sunrise with trees in Seoul.jpg',
  58: 'Dongdaemun Design Plaza at night, Seoul, Korea.jpg',
  59: 'Korea National Museum of Korea.jpg',
  60: 'Leeum, Samsung Museum of Art.jpg',
  61: '가로수길에 있는 에맥앤볼리오스 매장.jpg',
  62: '연남동 (20240803) 2.jpg',
  63: 'Yeouido Hangang Park from Mapo Bridge 1.jpg',
  64: 'Bukhansan Spring in Korea.jpg',
  65: 'Gwanghwamun Square 4.jpg'
};

const WIDTH = 900;   // Commons serves a pre-resized thumbnail — keeps files web-light (~100-250KB)
const OUT_DIR = path.join(__dirname, 'images');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function urlFor(fname) {
  return 'https://commons.wikimedia.org/wiki/Special:FilePath/' +
    encodeURIComponent(fname) + '?width=' + WIDTH;
}

function download(id, fname) {
  return new Promise((resolve) => {
    const dest = path.join(OUT_DIR, 'place-' + id + '.jpg');
    const get = (url, redirects) => {
      https.get(url, { headers: { 'User-Agent': 'LudaraAPerfectDay/1.0 (mmlando@gmail.com)' } }, res => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
          if (redirects > 6) { console.log('  [FAIL] place-' + id + ': too many redirects'); return resolve(); }
          res.resume();
          return get(res.headers.location, redirects + 1);
        }
        if (res.statusCode !== 200) { res.resume(); console.log('  [FAIL] place-' + id + ': HTTP ' + res.statusCode); return resolve(); }
        const out = fs.createWriteStream(dest);
        res.pipe(out);
        out.on('finish', () => out.close(() => {
          const kb = Math.round(fs.statSync(dest).size / 1024);
          console.log('  [ok]   place-' + id + '.jpg  (' + kb + ' KB)');
          resolve();
        }));
        out.on('error', () => { console.log('  [FAIL] place-' + id + ': write error'); resolve(); });
      }).on('error', () => { console.log('  [FAIL] place-' + id + ': request error'); resolve(); });
    };
    get(urlFor(fname), 0);
  });
}

(async () => {
  console.log('\nRe-downloading ' + Object.keys(FILES).length + ' license-safe Wikimedia images...\n');
  for (const [id, fname] of Object.entries(FILES)) {
    await download(id, fname);
    await new Promise(r => setTimeout(r, 250));
  }
  console.log('\nDone. Attribution for every place is in credits.js and shows under each photo.');
})();
