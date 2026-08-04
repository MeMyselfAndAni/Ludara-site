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
  slug:  'landokliotfamily',                                    // folder + cache name + URL
  url:   'https://ludara.ai/familystorymap/landokliotfamily/',
  cacheVersion: 48,          // bump on every deploy so the service worker updates

  // Languages this map offers. One entry = no language switcher.
  languages: ['he', 'ru', 'en'],

  // ── What the header says ───────────────────────────────────────────────────
  // One-line trilingual strings: 'עברית · Русский · English'. lang.js collapses
  // them to the active language.
  title:  'משפחת לנדו־קליוט · Семья Ландо-Клиот · The Lando–Kliot Family',
  credit: 'על פי זיכרונותיה של אנה · по воспоминаниям Анны · from the memoirs of Anna',

  // ── The map itself ─────────────────────────────────────────────────────────
  map: {
    center:   [38.0000, 50.0000],   // [lng, lat]
    zoom:     4,
    timezone: 'Asia/Jerusalem',
  },

  // ── Story threads = the `cat` field in data.js ──────────────────────────────
  //   color — the pin, the stop number, the list stripe
  //   dark  — the deep stop of the place-card header gradient
  //   tint  — the pale fill used when this branch is highlighted in the tree
  threads: [
    { key:'friedland', color:'#3a6ea5', dark:'#12314c', tint:'#eaf2fb',
      label:'פרידלנד, צד אמא · Фридланды · Friedland, mother\'s side' },
    { key:'kliot',     color:'#6b8e4e', dark:'#2f3a1e', tint:'#f2f7ea',
      label:'קליוט, צד אבא · Клиоты · Kliot, father\'s side' },
    { key:'lando',     color:'#2f8f8f', dark:'#123a3a', tint:'#e9f6f6',
      label:'לנדו ושכטר · Ландо и Шехтеры · Lando & Schechter' },
    { key:'war',       color:'#a4402f', dark:'#4a160e', tint:'#fbecea',
      label:'מלחמה ופינוי · Война и эвакуация · War & evacuation' },
    { key:'israel',    color:'#c9a227', dark:'#5c4a12', tint:'#fbf4e2',
      label:'ישראל · Израиль · Israel' },
  ],

  // ── Regions = the `nbhd` field in data.js, and the bubbles in index.html ────
  //   center    — where to draw the bubble when a region has no places yet
  //   minRadius — metres. These are country-sized, so the city-guide default
  //               (80 m) would draw an invisible dot. Always set one.
  regions: [
    { key:'belarus', color:'#3a6ea5', minRadius:120000, center:{ lat:54.50, lng:28.50 },
      label:'בלארוס וליטא · Беларусь и Литва · Belarus & Lithuania' },
    { key:'russia',  color:'#6b8e4e', minRadius:150000, center:{ lat:54.50, lng:39.50 },
      label:'רוסיה · Россия · Russia' },
    { key:'east',    color:'#a4402f', minRadius:200000, center:{ lat:52.00, lng:80.00 },
      label:'אוראל ואסיה · Урал и Азия · Urals & Asia' },
    { key:'ukraine', color:'#2f8f8f', minRadius:120000, center:{ lat:48.50, lng:32.50 },
      label:'אוקראינה · Украина · Ukraine' },
    { key:'israel',  color:'#c9a227', minRadius:30000,  center:{ lat:31.83, lng:35.00 },
      label:'ישראל · Израиль · Israel' },
  ],

  // ── The sentences in the welcome tour that name this family ───────────────
  //    Everything else in tutorial.js is generic and stays shared. A plain string
  //    is used for every language; an object gives per-language text.
  tutorial: {
    title: {
      he:'סיפור המשפחה שלנו', ru:'История нашей семьи', en:'Our Family Story' },
    intro: {
      he:'מפה אחת, מאה שנים של מסעות משפחה: מהעיירות בבלארוס, דרך המלחמה והפינוי, עד ישראל של היום. הסיור הקצר הזה מראה איך מטיילים בה.',
      ru:'Одна карта — сто лет семейных дорог: от местечек Беларуси, через войну и эвакуацию, до сегодняшнего Израиля. Этот короткий тур покажет, как по ней путешествовать.',
      en:'One map, a century of family journeys: from the shtetls of Belarus, through war and evacuation, to Israel today. This short tour shows you how to travel it.' },
    path: {
      he:'הכפתור המוזהב מצייר את מסע המשפחה כולו לפי הסדר: מרצ׳יצה ובוברויסק, דרך טמבוב, אוראל וקזחסטן, עד רחובות. לחצו עליו בכל רגע כדי לראות שוב את צורת הסיפור.',
      ru:'Золотая кнопка рисует весь путь семьи по порядку — от Речицы и Бобруйска, через Тамбов, Урал и Казахстан, до Реховота. Нажимайте её в любой момент, чтобы снова увидеть форму истории.',
      en:'The gold button draws the whole family journey in order: from Rechytsa and Bobruisk, through Tambov, the Urals and Kazakhstan, to Rehovot. Tap it any time to see the shape of the story again.' },
    pins: {
      he:'כל סיכה היא פרק בחיי המשפחה: העיר שבה נולדה סבתא נינה, הכפר שבו ניצל סבא זחר, הבית בטמבוב. לחצו על כל אייקון כדי לקרוא מה קרה שם.',
      ru:'Каждый значок — глава семейной жизни: город, где родилась бабушка Нина, деревня, где спасся дед Захар, дом в Тамбове. Нажмите на значок, чтобы прочитать, что там произошло.',
      en:'Every pin is a chapter of the family\'s life: the city where grandmother Nina was born, the village where grandfather Zakhar was saved, the home in Tambov. Tap any icon to read what happened there.' },
    search: {
      he:'הקלידו שם של מקום או של בן משפחה, והמפה תציג רק את המקומות שלו. צבעי הסיכות מסמנים את הענפים: פרידלנד, קליוט, לנדו ושכטר, מלחמה ופינוי, ישראל.',
      ru:'Введите название места или имя родственника — карта покажет только его места. Цвета значков обозначают ветви: Фридланды, Клиоты, Ландо и Шехтеры, война и эвакуация, Израиль.',
      en:'Type a place name or a family member\'s name, and the map shows only their places. Pin colors mark the branches: Friedland, Kliot, Lando & Schechter, war & evacuation, Israel.' },
    regions: {
      he:'כל בועה היא פרק גאוגרפי: בלארוס וליטא, רוסיה, אוראל ואסיה, אוקראינה, ישראל. לחיצה מקרבת ישר לאותו חלק של המסע.',
      ru:'Каждый кружок — глава географии: Беларусь и Литва, Россия, Урал и Азия, Украина, Израиль. Нажатие приближает прямо к этой части пути.',
      en:'Each bubble is a chapter of geography: Belarus & Lithuania, Russia, the Urals & Asia, Ukraine, Israel. Tap one to zoom straight into that part of the journey.' },
  },

  // ── The family tree ────────────────────────────────────────────────────────
  //   branches — the `branch` field in people.js. Each must be a thread key
  //              above, so the tree and the map agree on colour.
  //   col      — where that branch's heading sits on the tree canvas.
  tree: {
    title:   '🌳 עץ המשפחה · Дерево семьи · Family Tree',
    hint:    'לחיצה על אדם מציגה את מסעו במפה · нажмите на человека — его путь появится на карте · click a person: their journey appears on the map',
    allChip: 'הכול · Все · All',
    branches: [
      { key:'kliot',     col:0,    chip:'קליוט · Клиоты · Kliot',
        header:'קליוט, צד אבא · Клиоты · Kliot, father’s side' },
      { key:'friedland', col:13.2, chip:'פרידלנד · Фридланды · Friedland',
        header:'פרידלנד, צד אמא · Фридланды · Friedland, mother’s side' },
      { key:'lando',     col:23.6, chip:'לנדו · Ландо · Lando',
        header:'לנדו ושכטר, צד מישה · Ландо и Шехтеры · Lando & Schechter' },
    ],
  },
};

if (typeof self !== 'undefined') self.FAMILY = FAMILY;   // so sw.js can importScripts() it
