// MUZA — image credits.
// Museum photos are the museum's own, from eretzmuseum.org.il, credited to the
// photographer the museum names (or to the museum). A couple of images come from
// Wikimedia Commons under Creative Commons and carry the photographer + licence.
// Only ids with an image return a credit.
var MUZA_PHOTO_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 17, 18, 21, 22, 24, 25, 26];

// Museum photos — photographer where the museum names them.
var MUZA_CREDIT = {
  4:  'Leonid Pedrol',
  6:  'Liat Elbling',
  8:  'Michael Liran',
  11: 'Aviad Bar-Nes',
  12: 'Aviad Bar-Nes',
  13: 'Aviad Bar-Nes',
  21: 'Leonid Pedrol',
  25: 'Tal Izsak',
  26: 'Nof Harari'
};

// Wikimedia Commons images (Creative Commons) — author, licence, and links.
var MUZA_CC = {
  15: { name: 'Bukvoed', page: 'https://commons.wikimedia.org/wiki/File:Eretz-israel-museum-7068.jpg', lic: 'CC BY 4.0',    licurl: 'https://creativecommons.org/licenses/by/4.0/' },
  17: { name: 'Ori~',    page: 'https://commons.wikimedia.org/wiki/File:Gatot_110.jpg',                 lic: 'CC BY-SA 3.0', licurl: 'https://creativecommons.org/licenses/by-sa/3.0/' }
};

function photoCreditHtml(id) {
  if (MUZA_PHOTO_IDS.indexOf(id) === -1) return '';
  var cc = MUZA_CC[id];
  if (cc) {
    return 'Photo: <a href="' + cc.page + '" target="_blank" rel="noopener">' + cc.name + '</a>, '
         + '<a href="' + cc.licurl + '" target="_blank" rel="noopener">' + cc.lic + '</a> · Wikimedia Commons';
  }
  var museum = '<a href="https://www.eretzmuseum.org.il/" target="_blank" rel="noopener">Eretz Israel Museum</a>';
  var who = MUZA_CREDIT[id];
  return who ? ('Photo: ' + who + ' / ' + museum) : ('Photo: ' + museum);
}
