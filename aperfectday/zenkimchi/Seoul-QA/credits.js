// ── Photo attribution per place id (A Perfect Day in Seoul / ZenKimchi) ──
// Two kinds of entry:
//   wmFile : a Wikimedia Commons file — author = photographer, license = CC/PD,
//            link is built to the Commons file page.
//   url + venue:true : ZenKimchi's own photo (Joe McPherson), credited to ZenKimchi.
// photoCreditHtml(id) renders the visible credit line under each photo.
const PHOTO_CREDITS = {
  // ── ZenKimchi / Joe McPherson own photos ──
  1:  { author: "ZenKimchi / Joe McPherson", url: "https://www.koreafoodtours.com", venue:true },
  2:  { author: "ZenKimchi / Joe McPherson", url: "https://zenkimchi.com", venue:true },
  3:  { author: "ZenKimchi / Joe McPherson", url: "https://www.koreafoodtours.com", venue:true },
  4:  { author: "ZenKimchi / Joe McPherson", url: "https://www.koreafoodtours.com", venue:true },
  13: { author: "ZenKimchi / Joe McPherson", url: "https://www.koreafoodtours.com", venue:true },
  23: { author: "ZenKimchi / Joe McPherson", url: "https://zenkimchi.com", venue:true },
  24: { author: "ZenKimchi / Joe McPherson", url: "https://zenkimchi.com", venue:true },
  31: { author: "ZenKimchi / Joe McPherson", url: "https://zenkimchi.com", venue:true },
  33: { author: "ZenKimchi / Joe McPherson", url: "https://www.koreafoodtours.com", venue:true },
  34: { author: "ZenKimchi / Joe McPherson", url: "https://zenkimchi.com", venue:true },
  36: { author: "ZenKimchi / Joe McPherson", url: "https://www.koreafoodtours.com", venue:true },
  42: { author: "ZenKimchi / Joe McPherson", url: "https://zenkimchi.com", venue:true },
  43: { author: "ZenKimchi / Joe McPherson", url: "https://zenkimchi.com", venue:true },

  // ── Wikimedia Commons (CC / public domain) ──
  5:  { author: "Kjoonlee", license: "CC BY-SA 4.0", wmFile: "Old-style Korean fried chicken.jpg" },
  6:  { author: "ewhity", license: "CC0", wmFile: "Korean fried chicken (banban).jpg" },
  7:  { author: "Laika ac from UK", license: "CC BY-SA 2.0", wmFile: "Myeong-dong (22139460844).jpg" },
  8:  { author: "ChongDae", license: "CC BY-SA 3.0", wmFile: "Gwangjang Market.JPG" },
  9:  { author: "Aron Danburg", license: "CC BY-SA 2.0", wmFile: "Korean cuisine-Kaesong bossam kimchi-01.jpg" },
  10: { author: "Popo le Chien", license: "CC0", wmFile: "Tteokbokki.JPG" },
  11: { author: "Startandstar", license: "CC0", wmFile: "Korean fried chicken 240206.jpg" },
  12: { author: "travel oriented", license: "CC BY-SA 2.0", wmFile: "Dondurma stall in Myeongdong.jpg" },
  14: { author: "changupn", license: "CC0", wmFile: "Bibimbap with kkakdugi.jpg" },
  15: { author: "아사달", license: "CC BY 4.0", wmFile: "Dakbokkeumtang and samgyetang.jpg" },
  16: { author: "Wikimedia Commons", license: "CC BY-SA 2.0 FR", wmFile: "Dongdaemon-korean-food-8.jpg" },
  17: { author: "Mario Sánchez Prada", license: "CC BY-SA 2.0", wmFile: "2012-05-11 Insadong 01.jpg" },
  18: { author: "parrhesias (Flickr)", license: "CC BY 2.0", wmFile: "Seoul-Buddhist.temple-Jogyesa-01.jpg" },
  19: { author: "hojusaram", license: "CC BY-SA 2.0", wmFile: "Korean.food-Yakgua-Yugua-Insadong.jpg" },
  20: { author: "Aron Danburg", license: "CC BY-SA 2.0", wmFile: "Korean cuisine-Kaesong bossam kimchi-01.jpg" },
  21: { author: "Jo Hanshin", license: "CC0", wmFile: "Banchan (Supporting Food), Basic Dishes of Korean Food.jpg" },
  22: { author: "Aaaatu", license: "CC BY-SA 4.0", wmFile: "A coating company in Euljiro Printing alley.jpg" },
  25: { author: "ProjectManhattan", license: "CC BY-SA 3.0", wmFile: "Samgyeopsal.jpg" },
  26: { author: "KOREA.NET", license: "CC BY-SA 2.0", wmFile: "Iksan City 48 Korean Style Fried chicken.jpg" },
  27: { author: "travel oriented", license: "CC BY-SA 2.0", wmFile: "Dondurma stall in Myeongdong.jpg" },
  28: { author: "Spamland (Wikivoyage)", license: "Public domain", wmFile: "Korean Food Dakgalbi.JPG" },
  29: { author: "Laika ac from UK", license: "CC BY-SA 2.0", wmFile: "Myeong-dong (22630604620).jpg" },
  30: { author: "bryan (Taipei)", license: "CC BY-SA 2.0", wmFile: "Food 海底撈, Haidilao, 台灣一號店, 台北 (22608764687).jpg" },
  32: { author: "Spamland (Wikivoyage)", license: "Public domain", wmFile: "Korean Food Dakgalbi.JPG" },
  35: { author: "ewhity", license: "CC0", wmFile: "Korean fried chicken (banban).jpg" },
  37: { author: "아사달", license: "CC BY 4.0", wmFile: "Dakbokkeumtang and samgyetang.jpg" },
  38: { author: "chomjong", license: "CC BY 2.0", wmFile: "Grilled beef innards 1.jpg" },
  39: { author: "CartoonChess", license: "CC BY-SA 4.0", wmFile: "Cafe storefront in Seongsu-dong.jpg" },
  40: { author: "Basile Morin", license: "CC BY-SA 4.0", wmFile: "Octopus as food at Noryangjin Fisheries Wholesale Market in Seoul South Korea.jpg" },
  41: { author: "hwayoungjung", license: "CC BY-SA 2.0", wmFile: "Korea-Gyeongdong Market-Various jeotgal-01.jpg" },
  44: { author: "JiroS.", license: "CC BY-SA 3.0", wmFile: "Shopping street at Myondon , Seoul - panoramio.jpg" },
  45: { author: "Choikwangmo9", license: "CC0", wmFile: "2020-03-11 20.38.42 찜질방.jpg" },
  46: { author: "ayustety", license: "CC BY-SA 2.0", wmFile: "Korean.food-Bibim.naengmyen-01.jpg" },
  47: { author: "CartoonChess", license: "CC BY-SA 4.0", wmFile: "Flowery cafe in Seongsu-dong.jpg" },
  48: { author: "Sgroey", license: "CC BY-SA 4.0", wmFile: "Alcohol in a South Korean supermarket.jpg" },
  49: { author: "Korea.net", license: "CC BY-SA 2.0", wmFile: "Toasting makgeolli (4347102175).jpg" },
  50: { author: "Mario Sánchez Prada", license: "CC BY-SA 2.0", wmFile: "2012-05-06 Gyeongbokgung.jpg" },
  51: { author: "Ethan Doyle White", license: "CC BY-SA 4.0", wmFile: "Street Mural in Inwangsa (1).jpg" },
  52: { author: "Laika ac from UK", license: "CC BY-SA 2.0", wmFile: "Myeong-dong (22630604620).jpg" },
  53: { author: "ChongDae", license: "CC BY-SA 3.0", wmFile: "Gwangjang Market.JPG" },

  // ── Landmarks 54–65 — replaced with verified Wikimedia Commons ──
  54: { author: "Basile Morin", license: "CC BY-SA 4.0", wmFile: "Bukchon-ro 11-gil street with hanok houses at blue hour in Bukchon Hanok Village Seoul.jpg" },
  55: { author: "kallerna", license: "CC BY-SA 4.0", wmFile: "Changdeokgung Seoul 3.jpg" },
  56: { author: "alice park", license: "CC BY 2.0", wmFile: "Seoul-Samcheong.dong-01.jpg" },
  57: { author: "Basile Morin", license: "CC BY-SA 4.0", wmFile: "Cheonggyecheon stream at sunrise with trees in Seoul.jpg" },
  58: { author: "Eugene Lim", license: "CC BY 2.0", wmFile: "Dongdaemun Design Plaza at night, Seoul, Korea.jpg" },
  59: { author: "Ian Muttoo", license: "CC BY-SA 2.0", wmFile: "Korea National Museum of Korea.jpg" },
  60: { author: "takato marui", license: "CC BY-SA 2.0", wmFile: "Leeum, Samsung Museum of Art.jpg" },
  61: { author: "Soulsy3213", license: "CC BY-SA 4.0", wmFile: "가로수길에 있는 에맥앤볼리오스 매장.jpg" },
  62: { author: "azer0", license: "CC BY 2.0 KR", wmFile: "연남동 (20240803) 2.jpg" },
  63: { author: "kallerna", license: "CC BY-SA 4.0", wmFile: "Yeouido Hangang Park from Mapo Bridge 1.jpg" },
  64: { author: "Jo Hanshin", license: "CC0", wmFile: "Bukhansan Spring in Korea.jpg" },
  65: { author: "kallerna", license: "CC BY-SA 4.0", wmFile: "Gwanghwamun Square 4.jpg" },
};

// Build the visible credit anchor for a place id (returns '' if none).
function photoCreditHtml(id){
  var c = (typeof PHOTO_CREDITS !== 'undefined') ? PHOTO_CREDITS[id] : null;
  if(!c || !c.author) return '';
  var href = c.url || (c.wmFile ? 'https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(c.wmFile) : '#');
  var label = 'Photo: ' + c.author + (c.license ? ' — ' + c.license : '');
  return '<a href="' + href + '" target="_blank" rel="noopener nofollow">' + label + '</a>';
}
