// ── Photo attribution per place id ──────────────────────────────
// A Perfect Story Map — The Book of Longings (concept demo)
//
// Each card can show a small credit line built from the entry below:
//   author  : name shown in the card
//   license : short license (e.g. "CC BY 3.0"); omit for own work
//   url     : source page (Wikimedia Commons file page); omit for own/AI
//   prefix  : "Photo" (default) or "Illustration" for AI images
//
// IMAGE PLAN (see BookOfLongings_Image_Plan.md):
//   1  Sepphoris ........ Maria's own photo
//   2  The Cave ......... Maria's own photo (a real Galilee cave, for the fictional place)
//   3  Nazareth ......... Maria's own photo
//   4  Sea of Galilee ... Maria's own photo
//   5  Jordan River ..... Wikimedia Commons (Berthold Werner, CC BY 3.0)
//   6  Alexandria ....... Wikimedia Commons (Alberto-g-rovi, CC BY-SA 3.0)
//   7  Temple of Isis ... AI illustration (ancient site, unlocated)
//   8  Therapeutae ...... AI illustration (ancient site, unlocated)
//   9  Bethany .......... Commons: Church of St Lazarus, Barluzzi (Djampa, CC BY-SA 4.0)
//   10 Temple, Jerusalem  Maria's own photo
//   11 Gethsemane ....... Maria's own photo
//   12 Golgotha ......... Commons: Holy Sepulchre facade (Berthold Werner, CC BY-SA 3.0)
//
// If you use your OWN Bethany photo, change id 9 below to { author: 'Maria Lando' }.

const PHOTO_CREDITS = {
  1:  { author: 'Maria Lando' },
  2:  { author: 'Maria Lando' },
  3:  { author: 'Maria Lando' },
  4:  { author: 'Maria Lando' },
  5:  { author: 'Berthold Werner', license: 'CC BY 3.0',    url: 'https://commons.wikimedia.org/wiki/File:Jordan_Baptism_site_BW_4.JPG' },
  6:  { author: 'Alberto-g-rovi', license: 'CC BY-SA 3.0',  url: 'https://commons.wikimedia.org/wiki/File:Ciudadela_de_qaitbay-alejandria-2007.JPG' },
  7:  { prefix: 'Illustration', author: 'generated for A Perfect Story Map' },
  8:  { prefix: 'Illustration', author: 'generated for A Perfect Story Map' },
  9:  { author: 'Djampa',         license: 'CC BY-SA 4.0',  url: 'https://commons.wikimedia.org/wiki/File:Bethany_Lazarus_church.jpg' },
  10: { author: 'Maria Lando' },
  11: { author: 'Maria Lando' },
  12: { author: 'Berthold Werner', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Jerusalem_Holy_Sepulchre_BW_19.JPG' },
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
