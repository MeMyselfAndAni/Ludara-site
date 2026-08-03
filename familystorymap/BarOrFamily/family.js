// ─────────────────────────────────────────────────────────────────────────────
//  A Perfect Story Map — Family Edition
//  family.js — THE ONLY FILE THAT KNOWS WHICH FAMILY THIS MAP IS ABOUT.
//
//  To build a map for a new family: copy this whole folder, then edit
//    family.js   (this file — every name, colour, label and region)
//    data.js     (the places)
//    people.js   (the family tree)
//    credits.js  (image credits)
//    images/     (the photographs)
//  and nothing else. Run  _tools\check-map.bat  afterwards: it fails if any
//  value below is still the previous family's.
//
//  Load order matters — family.js must come BEFORE data.js in index.html,
//  because map.js, ui-tree.js, lang.js and sw.js all read from it.
// ─────────────────────────────────────────────────────────────────────────────

var FAMILY = {

  // ── Identity ───────────────────────────────────────────────────────────────
  slug:  'barorfamily',
  url:   'https://ludara.ai/familystorymap/barorfamily/',
  cacheVersion: 23,           // bump on every deploy so the service worker updates

  // Hebrew only — one entry means no language switcher.
  languages: ['he'],

  // ── What the header says ───────────────────────────────────────────────────
  title:  'משפחת אורבך ובר־אור',
  credit: 'על פי «תינוקת בשמיכת פוך» · זהבה בר־אור',

  // ── The book this map is based on ──────────────────────────────────────────
  source: {
    title:   'תינוקת בשמיכת פוך',
    author:  'זהבה בר־אור',
    edition: '06.2018',
    cover:   'images/book-cover.jpg',
  },

  // ── The map itself ─────────────────────────────────────────────────────────
  map: {
    center:   [38.0000, 50.0000],   // [lng, lat]
    zoom:     4,
    timezone: 'Asia/Jerusalem',
  },

  // ── Story threads = the `cat` field in data.js ──────────────────────────────
  threads: [
    { key:'narcyz',   color:'#3a6ea5', dark:'#2c5580', tint:'#eaf2fb', label:'משפחת נֶרציס — צד אמא' },
    { key:'urbach',   color:'#6b8e4e', dark:'#516d3b', tint:'#f2f7ea', label:'משפחת אורבך — צד אבא' },
    { key:'war',      color:'#a4402f', dark:'#7d2f22', tint:'#fbecea', label:'שנות המלחמה והנדודים' },
    { key:'israel',   color:'#c9a227', dark:'#a07d1c', tint:'#fbf4e2', label:'ישראל — הבית החדש' },
    { key:'memorial', color:'#5b4b6e', dark:'#443753', tint:'#f0ecf4', label:'מסעות החזרה והזיכרון' },
    { key:'baror',    color:'#2f8f8f', dark:'#236e6e', tint:'#e9f6f6', label:'בר־אור — המשפחה שאחרי' },
  ],

  // ── Regions = the `nbhd` field in data.js, and the bubbles in index.html ────
  //   minRadius used to be inherited from the map this folder was copied from, so
  //   poland, uzbekistan, europe, memorial and america had no entry at all and fell
  //   back to the city-guide default of 80 m. 'america' has a single place, so its
  //   bubble was drawn 80 m wide — invisible. Every region now carries its own.
  regions: [
    { key:'poland',     color:'#3a6ea5', minRadius:120000, center:{ lat:50.20, lng:19.60 },  label:'פולין' },
    { key:'ukraine',    color:'#2f8f8f', minRadius:120000, center:{ lat:48.02, lng:37.80 },  label:'אוקראינה' },
    { key:'east',       color:'#a4402f', minRadius:200000, center:{ lat:55.00, lng:59.50 },  label:'מזרחה — אורל וסיביר' },
    { key:'uzbekistan', color:'#c07a2f', minRadius:150000, center:{ lat:40.50, lng:66.80 },  label:'אוזבקיסטן' },
    { key:'europe',     color:'#6b8e4e', minRadius:120000, center:{ lat:48.50, lng: 8.50 },  label:'גרמניה וצרפת' },
    { key:'israel',     color:'#c9a227', minRadius:30000,  center:{ lat:32.50, lng:34.95 },  label:'ישראל' },
    { key:'memorial',   color:'#5b4b6e', minRadius:120000, center:{ lat:50.50, lng:19.20 },  label:'אתרי זיכרון' },
    { key:'america',    color:'#2f8f8f', minRadius:120000, center:{ lat:42.28, lng:-83.74 }, label:'ארצות הברית' },
  ],

  // ── The five sentences in the welcome tour that name this family ───────────
  //    Everything else in tutorial.js is generic and stays shared.
  tutorial: {
    title:   'תינוקת בשמיכת פוך',
    intro:   'מפה אחת, מאה שנים של מסע: מוולברום שבפולין, דרך אוקראינה, הרי האורל ואוזבקיסטן, ועד קריית ביאליק. הסיור הקצר הזה מראה איך מטיילים בה.',
    path:    'הכפתור המוזהב מצייר את מסע המשפחה כולו לפי הסדר — מוולברום, דרך אוקראינה, האורל ואוזבקיסטן, ועד קריית ביאליק. לחצו עליו בכל רגע כדי לראות שוב את צורת הסיפור.',
    pins:    'כל סיכה היא פרק בסיפור: העיירה שבה גדלה חיה, קרון המשא שבו נסעו, הבקתה שליד טשקנט, הבית הראשון בישראל. לחצו על כל אייקון כדי לקרוא מה קרה שם.',
    search:  'הקלידו שם של מקום או של בן משפחה — והמפה תציג רק את המקומות שלו. צבעי הסיכות מסמנים: משפחת נֶרציס, משפחת אורבך, שנות המלחמה, ישראל, ואתרי הזיכרון.',
    regions: 'כל בועה היא פרק גאוגרפי: פולין, אוקראינה, האורל וסיביר, אוזבקיסטן, אירופה, ישראל ואתרי הזיכרון. לחיצה מקרבת ישר לאותו חלק של המסע.',
  },

  // ── The family tree ────────────────────────────────────────────────────────
  tree: {
    title:   '🌳 עץ המשפחה',
    hint:    'לחיצה על אדם מציגה את מסעו במפה',
    allChip: 'הכול',
    branches: [
      { key:'narcyz', col:2.2, chip:'נֶרציס', header:'משפחת נֶרציס · אורבך · בר־אור' },
      { key:'urbach', col:null, chip:'אורבך' },
      { key:'baror',  col:null, chip:'בר־אור' },
    ],
    // One line of descent rather than parallel branches, so only the first
    // branch carries a heading on the canvas (col:null = no heading drawn).
  },
};

if (typeof self !== 'undefined') self.FAMILY = FAMILY;   // so sw.js can importScripts() it
