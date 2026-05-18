/**
 * download-missing-images.js
 * Two jobs in one script:
 *
 *   1. MISSING  — 18 images (8 original + 7 expansion IDs 34–40 + 3 new restaurants IDs 41–43)
 *   2. REPLACEMENTS — 17 existing images that are wrong or unappetising
 *                     (place-7 excluded — already fixed via AnticaAdelaide.webp)
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
    url:  'https://vinidagigio.it/wp-content/uploads/2022/12/ViniDaGigio_AFfotografo_29.jpg',
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
    url:  'https://ristorantealcovo.com/wp-content/uploads/2025/12/AL-COVO_DICEMBRE_2025_ICS0044.jpg',
  },
  {
    id:   26,
    name: 'Osteria Mocenigo',
    url:  'https://images.squarespace-cdn.com/content/v1/686ec1ffff951e587a007c40/1752089112670-ISE2JKKQHU0MQCPER8JF/venice-hidden-gem-restaurants-osteria-mocenigo.jpg',
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
  // ── 7 expansion places (IDs 34–40) added May 2026 ────────────────────────
  {
    id:   34,
    name: 'Museo del Vetro',
    url:  'https://imagesofvenice.com/wp-content/uploads/2022/02/ven_museum-guide-31_blog.jpg',
  },
  {
    id:   35,
    name: 'Basilica dei Santi Maria e Donato',
    url:  'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEibJLqq9lXGRoWSmyNHO30kEUkPZdxeCNp05fBB0n2GPtnpubwcT65k8qJFELOLAz7YXPYmucxXNxDjEq_DoNbpTzZTZ1MLN0dC_ULJHX1O5Nvm8ZMbQpGxPlKD64CRZIrNhyYy_mOE3Br6py8R0t2ozkNlAEns3FrskV2NfweIMrvTA4xpx2TbvbKDdg/s2560/Murano_Santa_Maria_e_Donato_27022015_07.jpeg',
  },
  {
    id:   36,
    name: 'Museo del Merletto',
    url:  'https://imagesofvenice.com/wp-content/uploads/2022/02/ven_museum-guide-37_blog.jpg',
  },
  {
    id:   37,
    name: 'Trattoria al Gatto Nero',
    url:  'https://www.elizabethminchilli.com/wp-content/uploads/2014/03/Gatto-Nero-Burano-Venice12-1.jpg',
  },
  {
    id:   38,
    name: 'Cattedrale di Santa Maria Assunta',
    url:  'https://imagesofvenice.com/wp-content/uploads/2021/01/ven_torcello-14_blog.jpg',
  },
  {
    id:   39,
    name: 'Locanda Cipriani',
    url:  'https://imagesofvenice.com/wp-content/uploads/2021/01/ven_torcello-12_blog.jpg',
  },
  {
    id:   40,
    name: 'Teatro La Fenice',
    url:  'https://imagesofvenice.com/wp-content/uploads/2020/02/ven_teatro-la-fenice-4_blog.jpg',
  },
  // ── 3 new restaurants added May 2026 ─────────────────────────────────────
  {
    id:   41,
    name: 'Da Fiore',
    // Photo by Valeria Necchio, sourced from veneziaristoranti.it (Buona Accoglienza association)
    url:  'https://veneziaristoranti.it/wp-content/uploads/2023/10/da-fiore-c-valeria-necchio-6-681x1024.jpg',
  },
  {
    id:   42,
    name: 'Corte Sconta',
    // Sourced from Palazzo San Luca hotel blog (Feb 2025 article about the restaurant)
    url:  'https://palazzosanluca.com/wp-content/uploads/2025/01/WhatsApp-Image-2025-01-29-at-17.12.14_cd5965f4.jpg',
  },
  {
    id:   43,
    name: "Osteria L'Orto dei Mori",
    // NOTE: no hotlinkable URL found — save place-43.jpg manually from the restaurant's website or TripAdvisor
    url:  'https://osteriaortodeimori.com/wp-content/uploads/orto-dei-mori.jpg',
  },
];

// ─── 17 existing images that need to be replaced ───────────────────────────
// Note: place-7 (Antica Adelaide) was fixed manually — AnticaAdelaide.webp
// was already on disk and converted to place-7.jpg via Python/Pillow.
// It is intentionally omitted here to avoid overwriting the correct image.
const REPLACEMENTS = [
  {
    id:     19,
    name:   'Gallerie dell\'Accademia',
    reason: 'museum logo only — replacing with Veronese painting',
    url:    'https://imagesofvenice.com/wp-content/uploads/2022/01/ven_museum-guide-9_blog.jpg',
  },
  {
    id:     20,
    name:   'Punta della Dogana',
    reason: 'very low-res distant aerial (13 KB)',
    url:    'https://veneziaautentica.com/wp-content/uploads/2020/03/Punta-dogana-Venice.jpg',
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
    reason: 'B&W old photo — replacing with interior grand hall (870px, Inexhibit magazine)',
    url:    'https://www.inexhibit.com/wp-content/uploads/2015/09/Palazzo-Fortuny-museum-Venice-Inexhibit-08.jpg',
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
    url:    'https://veneziaautentica.com/wp-content/uploads/2016/06/_sam9321.jpg',
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
    url:    'https://images.squarespace-cdn.com/content/v1/686ec1ffff951e587a007c40/1752089112670-ISE2JKKQHU0MQCPER8JF/venice-hidden-gem-restaurants-antiche-carampane.png',
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
  {
    id:     1,
    name:   'Ca\' Sagredo Hotel',
    reason: 'exterior/canal shot — replacing with grand staircase interior',
    url:    'https://www.casagredohotel.com/wp-content/uploads/sites/184/2020/08/hotel_casagredo_moment_awards_back_past_museum_arts_scalone_giganti_gallery_01.jpg',
  },
  {
    id:     6,
    name:   'Anice Stellato',
    reason: 'non-descriptive image — replacing with canal-side Cannaregio atmosphere shot',
    url:    'https://imagesofvenice.com/wp-content/uploads/2018/12/G13-1_venice_quiet-cannaregio.jpg',
  },
  {
    id:     21,
    name:   'San Sebastiano',
    reason: 'generic interior — replacing with official Chorus association photo showing Veronese ceiling',
    url:    'https://chorusvenezia.org/wp-content/uploads/2022/03/Chiesa-di-San-Sebastiano-43.jpg',
  },
  {
    id:     23,
    name:   'Campo Santa Margherita',
    reason: 'non-descriptive image — replacing with Scuola dei Carmini feature shot',
    url:    'https://imagesofvenice.com/wp-content/uploads/2020/10/ven_scuola-carmini-1-feature_blog.jpg',
  },
  {
    id:     32,
    name:   'Burano',
    reason: 'dull composition — replacing with vibrant coloured-houses canal photo',
    url:    'https://veneziaautentica.com/wp-content/uploads/2020/03/burano-houses.color-venice.jpg',
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

  const failedMissing      = await processGroup('MISSING (15 — original 8 + 7 expansion IDs 34–40)', MISSING);
  const failedReplacements = await processGroup('REPLACEMENTS (17 bad existing images)', REPLACEMENTS);

  const allFailed = [...failedMissing, ...failedReplacements];

  console.log('\n─────────────────────────────');
  if (allFailed.length === 0) {
    console.log('All 35 images downloaded successfully.');
  } else {
    console.log(`\nFailed (${allFailed.length}) — download these manually:`);
    for (const { id, name, url } of allFailed) {
      console.log(`\n  Save as:  images/place-${id}.jpg   (${name})`);
      console.log(`  From:     ${url}`);
    }
  }
}

run().catch(console.error);
