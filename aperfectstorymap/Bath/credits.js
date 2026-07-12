// ── Photo attribution per place id ──────────────────────────────
// A Perfect Story Map — Bridgerton in Bath (concept demo)
// All images from Wikimedia Commons, verified July 2026.
//   author  : photographer name shown in the card
//   license : short license name (e.g. "CC BY-SA 4.0", "CC0")
//   url     : link to the Commons File: page (author + license stated there)
// Images with no entry here show no credit line.
const PHOTO_CREDITS = {
  1:  { author: 'Uhooep',                          license: 'CC BY-SA 4.0',  url: 'https://commons.wikimedia.org/wiki/File:Holburne_Museum.jpg' },
  2:  { author: 'Bärbel Miemietz',                 license: 'CC BY-SA 4.0',  url: 'https://commons.wikimedia.org/wiki/File:2023-09-15_Bath_Royal_Crescent_05.jpg' },
  3:  { author: 'Bärbel Miemietz',                 license: 'CC BY-SA 4.0',  url: 'https://commons.wikimedia.org/wiki/File:2023-09-15_Bath_Royal_Crescent_01.jpg' },
  4:  { author: 'Andy Li',                          license: 'CC0',           url: 'https://commons.wikimedia.org/wiki/File:London_plane_at_Abbey_Green,_Bath_2025-07-23.jpg' },
  5:  { author: 'Tristan Surtel',                   license: 'CC BY-SA 4.0',  url: 'https://commons.wikimedia.org/wiki/File:Bath_Street_colonnade.jpg' },
  6:  { author: 'Enrique Íñiguez Rodríguez (Qoan)', license: 'CC BY-SA 4.0',  url: 'https://commons.wikimedia.org/wiki/File:Bath._Beauford_square.jpg' },
  7:  { author: 'Rodw',                             license: 'Public domain', url: 'https://commons.wikimedia.org/wiki/File:Trim_Street,_Bath.JPG' },
  8:  { author: 'Lewis Clarke',                     license: 'CC BY-SA 2.0',  url: 'https://commons.wikimedia.org/wiki/File:Bath_,_Assembly_Rooms_-_geograph.org.uk_-_6566729.jpg' },
  9:  { author: 'Ytfc23',                           license: 'CC BY-SA 4.0',  url: 'https://commons.wikimedia.org/wiki/File:Bath_Guildhall,_April_2020.jpg' },
  10: { author: 'Robin Webster',                    license: 'CC BY-SA 2.0',  url: 'https://commons.wikimedia.org/wiki/File:Edward_Street,_Bath_-_geograph.org.uk_-_8220145.jpg' },
};

// Build the credit anchor HTML for a place id (returns '' if none).
function photoCreditHtml(id){
  var c = (typeof PHOTO_CREDITS !== 'undefined') ? PHOTO_CREDITS[id] : null;
  if(!c || !c.author) return '';
  var label = 'Photo: ' + c.author + (c.license ? ' — ' + c.license : '');
  var href  = c.url || '#';
  return '<a href="' + href + '" target="_blank" rel="noopener nofollow">' + label + '</a>';
}
