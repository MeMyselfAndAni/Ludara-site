/**
 * download-missing-images.js
 * Two jobs in one script:
 *
 *   1. MISSING  — 8 images fetch-images-universal.js failed to grab
 *   2. REPLACEMENTS — 13 existing images that are wrong or unappetising
 *
 * Run from the A Perfect Day folder:
 *   node download-missing-images.js
 *
 * Requires: sharp (npm install sharp) for resizing to ≤600 px.
 * Without sharp, images are saved at original size.
 */

const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');

const IMAGES_DIR = path.join(__dirname, 'images');

// ─── 8 images that were never downloaded ───────────────────────────────────
const MISSING = [
  {
    id:   5,
    name: 'Vini da Gigio',
    url:  'https://vinidagigio.it/wp-content/uploads/2022/12/ViniDaGigio_AFfotografo_24.jpg',
  },
  {
    id:   10,
    name: 'Cantina Do Mori',
    url:  'https://veneziaautentica.com/wp-content/uploads/2016/07/_sam8325-custom.jpg',
  },
  {
    id:   11,
    name: "All'Arco",
    url:  'https://veneziaautentica.com/wp-content/uploads/2016/07/osteria-allarco-2.jpg',
  },
  {
    id:   15,
    name: 'Osteria alle Testiere',
    url:  'https://www.gastromondiale.com/wp-content/uploads/2024/02/1179_image-asset.jpg',
  },
  {
    id:   16,
    name: 'Al Covo',
    url:  'https://wendy-lyn.com/wp-content/uploads/2020/05/IMG_9109-2.jpg',
  },
  {
    id:   26,
    name: 'Osteria Mocenigo',
    url:  'https://media.evendo.com/locations-resized/RestaurantImages/360x548/12a833eb-88f4-472a-90da-0a672ea9265f',
  },
  {
    id:   27,
    name: 'La Zucca',
    url:  'https://images.squarespace-cdn.com/content/v1/58a58836a5790a772d0d0fd3/1548921002564-G6AXI8WGZ38PXIVZDV89/La-Zucca-Venice-02.jpg',
  },
  {
    id:   30,
    name: 'Il Pavone',
    url:  'https://veneziaautentica.com/wp-content/uploads/2018/07/Il-Pavone-di-Paolo-Pelosin-Shop.jpg',
  },
];

// ─── 13 existing images that need to be replaced ───────────────────────────
const REPLACEMENTS = [
  {
    id:     7,
    name:   'Antica Adelaide',
    reason: 'generic food-flatlay stock photo',
    url:    'https://visit-venice-italy.global.ssl.fastly.net/pics/restaurants/restaurant-antica-adelaide-venice-01.jpg?width=616&quality=70',
  },
  {
    id:     19,
    name:   'Gallerie dell\'Accademia',
    reason: 'museum logo only — replacing with Veronese painting',
    url:    'https://www.gallerieaccademia.it/sites/default/files/styles/whats_on/public/2022-08/203%20Veronese%20Convito%20in%20casa%20Levi%20COVER.jpg?itok=YQ1grBp1',
  },
  {
    id:     20,
    name:   'Punta della Dogana',
    reason: 'very low-res distant aerial (13 KB)',
    url:    'https://imagesofvenice.com/wp-content/uploads/2022/02/ven_museum-guide-41A_blog.jpg',
  },
  {
    id:     25,
    name:   'Bevilacqua',
    reason: 'wrong street scene — replacing with loom weaving photo',
    url:    'https://51ffe22c.delivery.rocketcdn.me/wp-content/uploads/2022/11/Velluto-in-seta-a-mano-Salute-Angela-Colonna_1080x675.jpg',
  },
  {
    id:     28,
    name:   'Palazzo Fortuny',
    reason: 'B&W old photo — replacing with colour building shot',
    url:    'https://www.meetingvenice.it/sites/default/files/schede/preview/palazzo_fortuny_e_museo.jpg',
  },
  {
    id:     29,
    name:   'Damocle Edizioni',
    reason: 'random "g rizzo" street scene — replacing with bookshop photo',
    url:    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/27/04/da/getlstd-property-photo.jpg?w=1200&h=-1&s=1',
  },
  {
    id:     8,
    name:   'Campo de\' Mori',
    reason: 'non-descriptive image — replacing with medieval merchant statues shot',
    url:    'https://lovevenice.net/wp-content/uploads/2023/11/campo-dei-mori-venice.jpg',
  },
  {
    id:     9,
    name:   'Fondamenta della Misericordia',
    reason: 'non-descriptive image — replacing with canal-side evening walk photo',
    url:    'https://hotelarcadia.net/wp-content/uploads/2025/03/1920x840-16-articolo.jpg',
  },
  {
    id:     12,
    name:   'Mercato di Rialto',
    reason: 'non-descriptive image — replacing with fish market photo',
    url:    'https://veneziaautentica.com/wp-content/uploads/2016/07/Rialto-Market.jpg',
  },
  {
    id:     13,
    name:   'Antiche Carampane',
    reason: 'non-descriptive image — replacing with restaurant feature photo',
    url:    'http://thegastronome.net/wp-content/uploads/2023/10/trattoria-antiche-carampane-feature.jpg',
  },
  {
    id:     17,
    name:   'Libreria Acqua Alta',
    reason: 'non-descriptive image — replacing with gondola-filled bookshop interior',
    url:    'https://veneziaautentica.com/wp-content/uploads/2016/08/libreria-acqua-alta-3-4.jpg',
  },
  {
    id:     31,
    name:   'Murano',
    reason: 'non-descriptive image — replacing with glassblowing action shot',
    url:    'https://cdn.venicexplorer.com/fileadmin/venice-images/murano_glass_blowing.jpg',
  },
  {
    id:     33,
    name:   'Torcello',
    reason: 'non-descriptive image — replacing with Byzantine cathedral interior',
    url:    'https://static.wixstatic.com/media/37d0c7_52791d3441d3443b999971bd16fc7d8a~mv2.jpg/v1/fill/w_618,h_477,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/37d0c7_52791d3441d3443b999971bd16fc7d8a~mv2.jpg',
  },
];

// ───────────────────────────────────────────────────────────────────────────

// Try to load sharp for resizing — not required
let sharp;
try { sharp = require('sharp'); } catch (_) { sharp = null; }

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const file  = fs.createWriteStream(dest);

    const req = proto.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (A Perfect Day image downloader)' },
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlink(dest, () => {});
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    });

    req.on('error', err => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err);
    });
    req.setTimeout(15000, () => {
      req.destroy(new Error('timeout'));
    });
  });
}

async function resizeTo600(src) {
  if (!sharp) return;
  const buf = await sharp(src)
    .resize(600, 600, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();
  fs.writeFileSync(src, buf);
}

async function processGroup(label, items) {
  console.log(`\n── ${label} ──`);
  const failed = [];

  for (const entry of items) {
    const { id, name, url } = entry;
    const dest = path.join(IMAGES_DIR, `place-${id}.jpg`);
    process.stdout.write(`  place-${id}  ${name} … `);
    try {
      await download(url, dest);
      if (sharp) await resizeTo600(dest);
      const size = fs.statSync(dest).size;
      console.log(`✓  ${(size / 1024).toFixed(0)} KB`);
    } catch (err) {
      console.log(`✗  ${err.message}`);
      failed.push(entry);
    }
  }

  return failed;
}

async function run() {
  if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR);
  if (!sharp) {
    console.log('ℹ  sharp not found — images saved at original size.');
    console.log('   Run:  npm install sharp    to enable ≤600 px resizing.\n');
  }

  const failedMissing      = await processGroup('MISSING (8 never downloaded)', MISSING);
  const failedReplacements = await processGroup('REPLACEMENTS (13 bad existing images)', REPLACEMENTS);

  const allFailed = [...failedMissing, ...failedReplacements];

  console.log('\n─────────────────────────────');
  if (allFailed.length === 0) {
    console.log('All 21 images downloaded successfully.');
  } else {
    console.log(`\nFailed (${allFailed.length}) — download these manually:`);
    for (const { id, name, url } of allFailed) {
      console.log(`\n  Save as:  images/place-${id}.jpg   (${name})`);
      console.log(`  From:     ${url}`);
    }
  }
}

run().catch(console.error);
