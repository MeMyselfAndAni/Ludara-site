// ── Photo attribution per place id ──────────────────────────────
// A Perfect Story Map — Family Edition (familystorymap)
//
// Every photo on this map comes from the family archive, scanned from
// FamilyMemories_Part1 (written by Anna). Places with no surviving photo
// show their emoji instead (ui-card.js falls back on image error).
//
// IMAGE PLAN (place-N.jpg ← memoir image):
//   1  Rechytsa ......... Yosef (Yosi) Friedland, father of grandpa Zalman
//   2  Bobruisk ......... Grandpa Zalman (Zakhar) & grandma Malka
//   3  Drissa ........... Benjamin Kliot in 1933
//   4  Svencionys ....... Kliot family, archive photo
//   5  Vitebsk .......... Aunt Sonya in uniform, 1943–44
//   7  Moscow ........... Mark, Michael & Yakov Lando, ~1955
//   8  Odessa ........... Roza's family, 1949
//   10 Tambov ........... Nina & Benjamin Kliot
//   11 Pokrovo .......... Mother's-side family group (Zalman, Malka…)
//   12 Nizhny Tagil ..... Alisa aged 2, 1943
//   13 Kyzylorda ........ Michael & Yakov Lando, 1944 (sent to the front)
//   14 Stalingrad ....... Nina Friedland in uniform, 1944
//   16 Kyiv ............. The reunion with Sam & Dora, 1964
//   17 Yaroslavl ........ Alisa & Mark Rozenblat's wedding, 1962
//   20 Rehovot .......... Nina Kliot (Friedland), Rehovot 1994
//   21 Jerusalem ........ Baruch & Rachel Kliot's wedding, 2009
//   6, 9, 15, 18, 19 .... no surviving photo — emoji placeholder

const FAMILY_ARCHIVE = 'ארכיון המשפחה · семейный архив';

const PHOTO_CREDITS = {
  25: { author: FAMILY_ARCHIVE },   // Ramat HaSharon — Maria and family
  26: { author: FAMILY_ARCHIVE },   // Raanana — Dmitry & Zoya's family: Mark & Nikol
  24: { author: FAMILY_ARCHIVE },   // Ashdod — Ilya & Olga's family: Lital, Nir & Ron
  1:  { author: FAMILY_ARCHIVE },
  2:  { author: FAMILY_ARCHIVE },
  3:  { author: FAMILY_ARCHIVE },
  4:  { author: FAMILY_ARCHIVE },
  5:  { author: FAMILY_ARCHIVE },
  7:  { author: FAMILY_ARCHIVE },
  8:  { author: FAMILY_ARCHIVE },
  10: { author: FAMILY_ARCHIVE },
  11: { author: FAMILY_ARCHIVE },
  12: { author: FAMILY_ARCHIVE },
  13: { author: FAMILY_ARCHIVE },
  14: { author: FAMILY_ARCHIVE },
  16: { author: FAMILY_ARCHIVE },
  17: { author: FAMILY_ARCHIVE },
  20: { author: FAMILY_ARCHIVE },
  21: { author: FAMILY_ARCHIVE },
};

// Build the credit HTML for a place id (returns '' if none).
function photoCreditHtml(id){
  var c = (typeof PHOTO_CREDITS !== 'undefined') ? PHOTO_CREDITS[id] : null;
  if(!c || !c.author) return '';
  var prefix = c.prefix || 'Photo';
  var label  = prefix + ': ' + c.author + (c.license ? ' — ' + c.license : '');
  if(!c.url) return '<span class="pc-credit-text">' + label + '</span>';
  return '<a href="' + c.url + '" target="_blank" rel="noopener nofollow">' + label + '</a>';
}
