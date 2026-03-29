// A Perfect Day — ZenKimchi / Seoul
// fetch-images.js — download place photos to images/
//
// Sources:
//   ZK  = zenkimchi.com or koreafoodtours.com (Joe's own photos)
//   WM  = Wikimedia Commons (CC-licensed, open use)
//
// Run from the guide folder:
//   node ..\..\general\_scripts\fetch-images.js ..\zenkimchi\seoul
//
// Or run standalone to download into images\ subfolder:
//   node fetch-images.js

const https  = require('https');
const http   = require('http');
const fs     = require('fs');
const path   = require('path');
const url    = require('url');

const OUT_DIR = path.join(__dirname, 'images');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// ─── Image map — id: URL ──────────────────────────────────────────────────────
// WM = Wikimedia Commons via Special:FilePath (auto-redirects to file)
// ZK = ZenKimchi / koreafoodtours (Joe's own photos from published posts)

const IMAGES = {

  // ─── MAPO / GONGDEOK ───────────────────────────────────────────────────────
  // ZK: Jeong Daepo exterior/BBQ from must-eat article
  1:  'https://www.koreafoodtours.com/wp-content/uploads/2019/07/14923967_10157689333175710_271091381_o-700x525.jpg',

  // ZK: Hongik Sutbul Galbi from must-eat article (Joe's photo, Aug 2023)
  2:  'https://zenkimchi.com/wp-content/uploads/2023/08/SE-8e6241b4-1ddb-11ec-97b9-1d81ac8cbd07-700x525.jpg',

  // ZK: Two-Two Chicken from chicken & beer article
  3:  'https://www.koreafoodtours.com/wp-content/uploads/2019/06/Two-Two-01-Saturate-Me-Red-700x525.jpg',

  // ZK: Nureungji spit-roasted chicken from chicken & beer article
  4:  'https://www.koreafoodtours.com/wp-content/uploads/2019/06/Nureungji-1-joe-700x525.jpg',

  // WM: Old-style Korean fried chicken (CC BY-SA) — Ddobagi style
  5:  'https://commons.wikimedia.org/wiki/Special:FilePath/Old-style_Korean_fried_chicken.jpg',

  // ─── HONGDAE / MANGWON ─────────────────────────────────────────────────────
  // WM: Korean fried chicken banban (CC0) — Chicken Baengi hof style
  6:  'https://commons.wikimedia.org/wiki/Special:FilePath/Korean_fried_chicken_(banban).jpg',

  // WM: Seoul night street scene (CC BY-SA) — Hongdae street food vibe
  7:  'https://commons.wikimedia.org/wiki/Special:FilePath/Myeong-dong_(22139460844).jpg',

  // WM: Gwangjang Market (CC) — reused for Mangwon Market (both traditional markets)
  8:  'https://commons.wikimedia.org/wiki/Special:FilePath/Gwangjang_Market.JPG',

  // WM: Bossam (CC BY-SA) — Won Halmoni Bossam
  9:  'https://commons.wikimedia.org/wiki/Special:FilePath/Korean_food-Bossam-01.jpg',

  // WM: Tteokbokki (CC BY-SA) — Jaws Tteokbokki
  10: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tteokbokki.JPG',

  // WM: Korean fried chicken (CC BY-SA) — BHC classic hof
  11: 'https://commons.wikimedia.org/wiki/Special:FilePath/Korean_fried_chicken_240206.jpg',

  // WM: Sulbing bingsu (CC BY-SA) — from Myeongdong Sulbing branch
  12: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sulbing_(8586374296).jpg',

  // ─── JONGNO / INSADONG ─────────────────────────────────────────────────────
  // ZK: Gwanghwamun Jip from must-eat article
  13: 'https://www.koreafoodtours.com/wp-content/uploads/2019/07/Gwanghwamun-Jip.jpg',

  // ZK: Jeonju Yuhalmeoni from must-eat article (Aug 2023)
  14: 'https://zenkimchi.com/wp-content/uploads/2023/08/AuAO_A%C2%AFCo%C2%B8o%C2%B4i_onoo%C2%B9a-394x700.jpg',

  // WM: Samgyetang ginseng chicken soup (CC BY-SA) — Tosokchon
  15: 'https://commons.wikimedia.org/wiki/Special:FilePath/Dakbokkeumtang_and_samgyetang.jpg',

  // WM: Gwangjang Market food stalls (CC BY-SA)
  16: 'https://commons.wikimedia.org/wiki/Special:FilePath/Dongdaemon-korean-food-8.jpg',

  // WM: Ikseon-dong hanok alley (CC BY-SA)
  17: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ikseon-dong_2018-2.jpg',

  // WM: Korean Buddhist temple food (CC BY-SA) — Balwoo Gongyang
  18: 'https://commons.wikimedia.org/wiki/Special:FilePath/Korean_Temple_Cuisine.jpg',

  // WM: Insadong street at dawn / hotteok (CC BY-SA)
  19: 'https://commons.wikimedia.org/wiki/Special:FilePath/Seoul-Insadong_at_dawn-01.jpg',

  // WM: Bossam pork wraps (CC) — Samhaejip
  20: 'https://commons.wikimedia.org/wiki/Special:FilePath/Korean_food-Bossam-03.jpg',

  // WM: Korean tofu soft dubu (CC BY-SA) — Maetdollo-man
  21: 'https://commons.wikimedia.org/wiki/Special:FilePath/Korean.food-Dubu.jorim-01.jpg',

  // ─── EULJIRO / JUNG-GU / MYEONGDONG ───────────────────────────────────────
  // WM: Euljiro printing alley neon at night (CC BY-SA)
  22: 'https://commons.wikimedia.org/wiki/Special:FilePath/Euljiro_3-ga_neon.jpg',

  // ZK: Woo Lae Oak naengmyeon from must-eat article
  23: 'https://zenkimchi.com/wp-content/uploads/2023/08/h119238a_z.jpg',

  // ZK: Dongmu Bapsang (North Korean defector restaurant) from must-eat article
  24: 'https://zenkimchi.com/wp-content/uploads/2023/08/IMG_0543-700x526.jpg',

  // WM: Korean BBQ grill / pork (CC BY-SA) — Sae Maul Sikdang
  25: 'https://commons.wikimedia.org/wiki/Special:FilePath/Korean.food-Samgyeopsal-01.jpg',

  // WM: Oven-style chicken (CC) — Goobne
  26: 'https://commons.wikimedia.org/wiki/Special:FilePath/Iksan_City_48_Korean_Style_Fried_chicken.jpg',

  // WM: Myeongdong street stalls (CC BY-SA)
  27: 'https://commons.wikimedia.org/wiki/Special:FilePath/Dondurma_stall_in_Myeongdong.jpg',

  // WM: Jjimdalk braised chicken (CC) — Andong Jjimdalk
  28: 'https://commons.wikimedia.org/wiki/Special:FilePath/Korean.food-Andong.jjimdak-01.jpg',

  // WM: Myeongdong at night / restaurant (CC BY-SA) — Myeongdong Pizza
  29: 'https://commons.wikimedia.org/wiki/Special:FilePath/%EB%AA%85%EB%8F%99_Myeongdong_2019-11-13.jpg',

  // WM: Hot pot (CC) — Haidilao
  30: 'https://commons.wikimedia.org/wiki/Special:FilePath/Korean.food-Jeongol-01.jpg',

  // ─── ITAEWON / YONGSAN ─────────────────────────────────────────────────────
  // ZK: Linus' BBQ pork platter — from Linus article (Joe's photos, Nov 2014)
  31: 'https://zenkimchi.com/wp-content/uploads/2014/11/2014-11-04-12.12.42-scaled.jpg',

  // WM: Dak galbi charcoal (CC BY-SA) — Orai Sutbul DalkGalbi
  32: 'https://commons.wikimedia.org/wiki/Special:FilePath/Korean.food-Dakgalbi-01.jpg',

  // ─── GANGNAM / JAMSIL / SEONGSU ────────────────────────────────────────────
  // ZK: Gogung Jeonju bibimbap brass bowl from must-eat article
  33: 'https://www.koreafoodtours.com/wp-content/uploads/2019/07/Gogung.jpg',

  // ZK: Omori Jjigae flagship store from must-eat article
  34: 'https://zenkimchi.com/wp-content/uploads/2023/08/img-700x467.jpg',

  // WM: Kyochon / battered fried chicken (CC) — classic Korean hof chicken
  35: 'https://commons.wikimedia.org/wiki/Special:FilePath/Korean_fried_chicken_(banban).jpg',

  // WM: Rotisserie / wood-fired chicken (CC BY-SA) — Gyerimwon nureungji style
  36: 'https://www.koreafoodtours.com/wp-content/uploads/2019/06/Nureungji-1-joe-700x525.jpg',

  // WM: Korean braised duck (CC) — Nolboo Clay Pot Duck
  37: 'https://commons.wikimedia.org/wiki/Special:FilePath/Korean.food-Oritang-01.jpg',

  // WM: Majang Meat Market (CC BY-SA)
  38: 'https://commons.wikimedia.org/wiki/Special:FilePath/Majang_Livestock_Market.jpg',

  // WM: Seongsu-dong cafe district (CC BY-SA)
  39: 'https://commons.wikimedia.org/wiki/Special:FilePath/Seongsu-dong,_Seoul.jpg',

  // ─── NORYANGJIN / YEOUIDO ──────────────────────────────────────────────────
  // WM: Noryangjin Fish Market octopus tanks (CC BY-SA)
  40: 'https://commons.wikimedia.org/wiki/Special:FilePath/Octopus_as_food_at_Noryangjin_Fisheries_Wholesale_Market_in_Seoul_South_Korea.jpg',

  // WM: Salted fermented seafood jeotgal (CC BY-SA)
  41: 'https://commons.wikimedia.org/wiki/Special:FilePath/Korean.food-Ojingeo.jeot-01.jpg',

  // ZK: Cup Rice Road (Noryangjin student street food) from must-eat article
  42: 'https://zenkimchi.com/wp-content/uploads/2023/08/159367174774_20200703.jpeg',

  // ZK: Jeongin Myeonok naengmyeon from must-eat article
  43: 'https://zenkimchi.com/wp-content/uploads/2023/08/2a3de62293de41a891e7fe380835e8df-700x700.webp',

  // WM: Lotte Department Store basement food court (CC)
  44: 'https://commons.wikimedia.org/wiki/Special:FilePath/LOTTE_Department_Store_(Myeongdong_Main_Store).jpg',

  // WM: Jjimjilbang Korean sauna bathhouse (CC BY-SA)
  45: 'https://commons.wikimedia.org/wiki/Special:FilePath/2020-03-11_20.38.42_%EC%B0%9C%EC%A7%88%EB%B0%A9.jpg',

  // WM: Naengmyeon cold noodles (CC BY-SA) — Woo Lae Oak Noryangjin branch
  46: 'https://commons.wikimedia.org/wiki/Special:FilePath/Korean.food-Bibim.naengmyen-01.jpg',

};

// ─── Download helper ──────────────────────────────────────────────────────────
function download(id, rawUrl, retries = 2) {
  const ext  = rawUrl.match(/\.(jpe?g|png|webp|gif)/i)?.[1] || 'jpg';
  const dest = path.join(OUT_DIR, `place-${id}.${ext}`);

  if (fs.existsSync(dest)) {
    console.log(`  ⏭  ${id} already exists`);
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const follow = (u, hops = 0) => {
      if (hops > 6) { console.log(`  ❌ ${id} too many redirects`); resolve(); return; }
      const mod = u.startsWith('https') ? https : http;
      const req = mod.get(u, {
        headers: { 'User-Agent': 'APerfectDayGuide/1.0 (ludara.ai; contact@ludara.ai)' }
      }, (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
          follow(new URL(res.headers.location, u).href, hops + 1);
          return;
        }
        if (res.statusCode !== 200) {
          console.log(`  ❌ ${id} HTTP ${res.statusCode} — ${u}`);
          resolve(); return;
        }
        const out  = fs.createWriteStream(dest);
        const ct   = res.headers['content-type'] || '';
        const finalExt = ct.includes('webp') ? 'webp' : ct.includes('png') ? 'png' : 'jpg';
        const finalDest = path.join(OUT_DIR, `place-${id}.${finalExt}`);
        res.pipe(out);
        out.on('finish', () => {
          if (dest !== finalDest && !fs.existsSync(finalDest)) fs.renameSync(dest, finalDest);
          const size = (fs.statSync(finalDest).size / 1024).toFixed(0);
          console.log(`  ✅ ${id} → place-${id}.${finalExt} (${size}KB)`);
          resolve();
        });
        out.on('error', (e) => { console.log(`  ❌ ${id} write error: ${e.message}`); resolve(); });
      });
      req.on('error', (e) => {
        if (retries > 0) {
          console.log(`  ⚠️  ${id} retry... (${e.message})`);
          setTimeout(() => download(id, rawUrl, retries - 1).then(resolve), 1500);
        } else {
          console.log(`  ❌ ${id} failed: ${e.message}`);
          resolve();
        }
      });
    };
    follow(rawUrl);
  });
}

// ─── Run sequentially ─────────────────────────────────────────────────────────
(async () => {
  const ids = Object.keys(IMAGES).map(Number).sort((a, b) => a - b);
  console.log(`\nFetching ${ids.length} images into ${OUT_DIR}\n`);
  for (const id of ids) {
    await download(id, IMAGES[id]);
    await new Promise(r => setTimeout(r, 300));  // polite delay
  }
  console.log('\nDone! Run resize-images.js next.\n');
})();
