// ── Photo attribution per place id ──────────────────────────────
// A Perfect Story Map — Family Edition (familystorymap)
//
// Most photos on this map come from the family archive, scanned from
// FamilyMemories_Part1 (written by Anna). Six places had no surviving family
// photograph, so they use freely licensed images from Wikimedia Commons, each
// credited individually below with its author, licence and source page.
// Any place still without a photo shows its emoji instead (ui-card.js falls
// back on image error).
//
// IMAGE PLAN (place-N.jpg ← memoir image):
//   1  Rechytsa ......... Yosef (Yosi) Friedland, father of grandpa Zalman
//   2  Bobruisk ......... Grandpa Zalman (Zakhar) & grandma Malka
//   3  Drissa ........... Benjamin Kliot in 1933
//   4  Svencionys ....... Kliot family, archive photo
//   5  Vitebsk .......... Aunt Sonya in uniform, 1943–44
//   7  Moscow ........... Mark, Michael & Yakov Lando, ~1955
//   8  Odessa ........... Roza's family, 1949
//   30 Roza's town ...... Roza herself, cropped from the 1949 family photo (8)
//   31 Red Square ....... Wikimedia Commons (Kirov's funeral, 6 Dec 1934)
//   10 Tambov ........... Nina & Benjamin Kliot
//   11 Pokrovo .......... Mother's-side family group (Zalman, Malka…)
//   12 Nizhny Tagil ..... Alisa aged 2, 1943
//   13 Kyzylorda ........ Michael & Yakov Lando, 1944 (sent to the front)
//   29 Dnieper crossing . Nina Friedland in uniform, 1944
//   14 Stalingrad ....... Wikimedia Commons (Barmaley fountain, 1942)
//   16 Kyiv ............. The reunion with Sam & Dora, 1964
//   17 Yaroslavl ........ Alisa & Mark Rozenblat's wedding, 1962
//   20 Rehovot .......... Nina Kliot (Friedland), Rehovot 1994
//   21 Jerusalem ........ Baruch & Rachel Kliot's wedding, 2009
//   9, 15, 18, 19 ...... no surviving photo — emoji placeholder
//   6  Tula ............. young Benjamin Kliot (Maria, Jul 29)

const FAMILY_ARCHIVE = 'ארכיון המשפחה · семейный архив · Family archive';

const PHOTO_CREDITS = {
  6:  { author: FAMILY_ARCHIVE },   // Tula — young Benjamin Kliot
  25: { author: FAMILY_ARCHIVE },   // Ramat HaSharon — Maria and family
  26: { author: FAMILY_ARCHIVE },   // Raanana — Dmitry & Zoya's family: Mark & Nikol
  24: { author: FAMILY_ARCHIVE },   // Ashdod — Ilya & Olga's family: Lital, Nir & Ron
  1:  { author: FAMILY_ARCHIVE },
  2:  { author: FAMILY_ARCHIVE },
  3:  { author: FAMILY_ARCHIVE },
  4:  { author: FAMILY_ARCHIVE },
  5:  { author: FAMILY_ARCHIVE },
  7:  { author: FAMILY_ARCHIVE },
  // Odessa, 1949. Anna's written caption names the children as Michael (right),
  // Vera and Pavel. A later note from her called the young man on the right
  // Yefim, but Yefim was killed at Stalingrad in 1942, so he cannot be in a
  // 1949 photograph. Michael, who came home from the front in 1945, is kept.
  8:  { author: FAMILY_ARCHIVE,
        prefix: 'יושבים: רוזה ושאול (שולה); עומדים: פאבל, ורה ומיכאל, 1949'
              + ' · Сидят: Роза и Шауль (Шуля); стоят: Павел, Вера и Михаил, 1949'
              + ' · Seated: Roza and Shaul (Shula); standing: Pavel, Vera and Michael, 1949' },
  10: { author: FAMILY_ARCHIVE },
  11: { author: FAMILY_ARCHIVE },
  12: { author: FAMILY_ARCHIVE },
  13: { author: FAMILY_ARCHIVE },
  16: { author: FAMILY_ARCHIVE },
  17: { author: FAMILY_ARCHIVE },
  20: { author: FAMILY_ARCHIVE },
  29: { author: FAMILY_ARCHIVE },   // Dnieper crossing — Nina Friedland in uniform, 1944 (was place-14)
  21: { author: FAMILY_ARCHIVE },
  30: { author: FAMILY_ARCHIVE,
        prefix: 'רוזה, מתוך תצלום המשפחה משנת 1949'
              + ' · Роза, фрагмент семейного снимка 1949 года'
              + ' · Roza, from the family photograph of 1949' },

  // ── Wikimedia Commons, where no family photograph survived ────────────────
  31: { author: 'צלם לא ידוע · неизвестный фотограф · Unknown photographer',
        prefix: 'הלווייתו של קירוב בכיכר האדומה, 6 בדצמבר 1934 · Похороны Кирова на Красной площади, 6 декабря 1934 · Kirov\'s funeral on Red Square, 6 December 1934',
        license: 'נחלת הכלל · общественное достояние · Public domain',
        url: 'https://commons.wikimedia.org/wiki/File:19341200-funeral_kirov_moscov_red_square.jpg' },
  14: { author: 'סרגיי סטרוניקוב · Сергей Струнников · Sergey Strunnikov',
        prefix: 'מזרקת "מחול הילדים", סטלינגרד 1942 · Фонтан «Детский хоровод», Сталинград, 1942 · The Barmaley fountain, Stalingrad, 1942',
        license: 'נחלת הכלל · общественное достояние · Public domain',
        url: 'https://commons.wikimedia.org/wiki/File:%D0%A4%D0%BE%D0%BD%D1%82%D0%B0%D0%BD_%C2%AB%D0%94%D0%B5%D1%82%D1%81%D0%BA%D0%B8%D0%B9_%D1%85%D0%BE%D1%80%D0%BE%D0%B2%D0%BE%D0%B4%C2%BB.jpg' },
  9:  { author: 'צלם לא ידוע · неизвестный фотограф · Unknown photographer',
        prefix: 'חרקוב, שנות ה־30 · Харьков, 1930-е · Kharkiv, 1930s',
        license: 'נחלת הכלל · общественное достояние · Public domain',
        url: 'https://commons.wikimedia.org/wiki/File:%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%BE%D0%B1%D1%96%D0%BB%D1%96_%D0%B1%D1%96%D0%BB%D1%8F_%D0%94%D0%B5%D1%80%D0%B6%D0%BF%D1%80%D0%BE%D0%BC%D1%83_(1930-%D1%82%D1%96_%D1%80%D0%BE%D0%BA%D0%B8),_%D0%A5%D0%B0%D1%80%D0%BA%D1%96%D0%B2.PNG' },
  15: { author: 'אלכסנדר גריבובסקי (טאס) · Александр Грибовский (ТАСС) · Alexander Gribovsky (TASS)',
        prefix: 'סבייז׳ המשוחררת, יולי 1944 · Освобождённый Себеж, июль 1944 · Liberated Sebezh, July 1944',
        license: 'נחלת הכלל · общественное достояние · Public domain',
        url: 'https://commons.wikimedia.org/wiki/File:%D0%91%D0%BE%D0%B5%D1%86_%D0%9A%D1%80%D0%B0%D1%81%D0%BD%D0%BE%D0%B9_%D0%90%D1%80%D0%BC%D0%B8%D0%B8_%D0%B1%D0%B5%D1%81%D0%B5%D0%B4%D1%83%D0%B5%D1%82_%D1%81_%D0%B4%D0%B5%D1%81%D1%8F%D1%82%D0%B8%D0%BB%D0%B5%D1%82%D0%BD%D0%B8%D0%BC_%D0%92%D0%BE%D0%BB%D0%BE%D0%B4%D0%B5%D0%B9_%D0%9B%D1%83%D0%BA%D0%B8%D0%BD%D1%8B%D0%BC_%D0%B2_%D0%BE%D1%81%D0%B2%D0%BE%D0%B1%D0%BE%D0%B6%D0%B4%D0%B5%D0%BD%D0%BD%D0%BE%D0%BC_%D0%A1%D0%B5%D0%B1%D0%B5%D0%B6%D0%B5.jpg' },
  18: { author: 'FOTO:FORTEPAN / Nagy Gyula',
        prefix: 'נייבסקי פרוספקט, 1966 · Невский проспект, 1966 · Nevsky Prospekt, 1966',
        license: 'CC BY-SA 3.0',
        url: 'https://commons.wikimedia.org/wiki/File:(Leningr%C3%A1d)_Nyevszkij_sug%C3%A1r%C3%BAt._Fortepan_50308.jpg' },
  19: { author: 'יו. מ. רביאקין · Ю. М. Ревякин · Yu. M. Revyakin (via Feconi)',
        prefix: 'צ׳יטה, 1972 · Чита, 1972 · Chita, 1972',
        license: 'CC BY 3.0',
        url: 'https://commons.wikimedia.org/wiki/File:%D0%97%D0%B0%D0%B1%D0%92%D0%9E_1972_%D0%B3%D0%BE%D0%B4,_%D1%84%D0%BE%D1%82%D0%BE_%D0%AE.%D0%9C.%D0%A0%D0%B5%D0%B2%D1%8F%D0%BA%D0%B8%D0%BD%D0%B0_-_panoramio.jpg' },
  22: { author: 'יעקב סער, לשכת העיתונות הממשלתית · Яаков Саар, ГПО · Yaakov Saar, Government Press Office',
        prefix: 'החממות בסתריה, 1981 · Теплицы в Ситрии, 1981 · The greenhouses at Sitria, 1981',
        license: 'CC BY-SA 3.0',
        url: 'https://commons.wikimedia.org/wiki/File:Flickr_-_Government_Press_Office_(GPO)_-_Aeroponics_at_the_Satariya_Settlement.jpg' },
  23: { author: 'Willem van de Poll / Nationaal Archief',
        prefix: 'ספריית מכון ויצמן, 1960 · Библиотека Института Вейцмана, 1960 · The Weizmann Institute library, 1960',
        license: 'CC0',
        url: 'https://commons.wikimedia.org/wiki/File:Weizmann-instituut_Interieur_bibliotheek_met_leestafels,_rekken_met_boeken,_pla,_Bestanddeelnr_255-3914.jpg' },
};

// Build the credit HTML for a place id (returns '' if none).
function photoCreditHtml(id){
  var c = (typeof PHOTO_CREDITS !== 'undefined') ? PHOTO_CREDITS[id] : null;
  if(!c || !c.author) return '';
  // The credit printed every language at once, because the author string is a
  // '·' separated triplet and nothing filtered it, and the word "Photo" was
  // hardcoded English. Both now follow the reader's language.
  var _pick = (typeof pickLang === 'function') ? pickLang : function(t){ return t; };
  var prefix = c.prefix ? _pick(c.prefix)
             : (typeof L3 === 'function' ? L3('צילום', 'Фото', 'Photo') : 'Photo');
  var label  = prefix + ': ' + _pick(c.author) + (c.license ? ', ' + _pick(c.license) : '');
  if(!c.url) return '<span class="pc-credit-text">' + label + '</span>';
  return '<a href="' + c.url + '" target="_blank" rel="noopener nofollow">' + label + '</a>';
}
