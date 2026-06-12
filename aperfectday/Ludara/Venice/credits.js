// ── Photo attribution per place id ──────────────────────────────
// One entry per image that needs crediting.
//   author  : photographer name shown in the card
//   license : short license name (e.g. "CC BY-SA 4.0", "CC BY 3.0")
//   url     : link to the source page (where author + license are stated)
// Images with no entry here show no credit line.
const PHOTO_CREDITS = {
  1:  { author: 'gnuckx',            license: 'CC BY 2.0',    url: 'https://commons.wikimedia.org/wiki/File:Hotel_Ca_Sagredo_-_Grand_Canal_-_Rialto_-_Venice_Italy_Venezia_-_Creative_Commons_by_gnuckx_(4965517357).jpg' },
  2:  { author: 'Didier Descouens',  license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Ca%27_d%27Oro_facciata.jpg' },
  3:  { author: 'Didier Descouens',  license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Madonna_dell%27Orto.jpg' },
  4:  { author: 'Didier Descouens',  license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Santa_Maria_dei_Miracoli_(facciata).jpg' },
  6:  { author: 'Kent Wang',         license: 'CC BY-SA 2.0', url: 'https://commons.wikimedia.org/wiki/File:Anice_Stellato_(50444236462).jpg' },
  8:  { author: 'Doris Antony',      license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Campo_dei_Mori.jpg' },
  9:  { author: 'Wolfgang Moroder',  license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Fondamenta_della_Misericordia_Rio_della_Misericordia_San_Marziale.jpg' },
  10: { author: 'Tim Sackton',       license: 'CC BY-SA 2.0', url: 'https://commons.wikimedia.org/wiki/File:%22_05_-_ITALY_-_un_bacaro_a_Venezia_Osteria_appetizers_restaurant_in_Venice_wine_enoteca.jpg' },
  11: { author: 'Monika Ďuríčková',  license: 'CC BY 2.0',    url: 'https://commons.wikimedia.org/wiki/File:Venice_Prosecco_and_Cicchetti.jpg' },
  12: { author: 'Jorge Franganillo', license: 'CC BY 2.0',    url: 'https://commons.wikimedia.org/wiki/File:Venezia-_Rialto_market_-_50336366728.jpg' },
  13: { author: 'Antiche Carampane',  license: 'used with permission', url: 'https://www.antichecarampane.com' },
  14: { author: 'Didier Descouens',  license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Chiesa_di_San_Polo_(Venice)_-abside.jpg' },
  15: { author: 'Osteria alle Testiere', license: 'used with permission', url: 'http://www.osterialletestiere.it' },
  16: { author: 'Ristorante Al Covo',   license: 'used with permission', url: 'https://www.ristorantealcovo.com' },
  17: { author: 'Cristina Gottardi', license: 'CC0',          url: 'https://commons.wikimedia.org/wiki/File:Heaps_of_books_(Unsplash).jpg' },
  18: { author: 'Daniel Ventura',    license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Venezia_panorama_2004_12.jpg' },
  19: { author: 'Didier Descouens',  license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Accademia_(Venice).jpg' },
  20: { author: 'Matteo Pappadopoli',license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Venezia_-_Punta_della_Dogana_-_2024-09-24_07-52-02_001.jpg' },
  21: { author: 'Didier Descouens',  license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:San_Sebastiano_(Venice)_Facade.jpg' },
  22: { author: 'Wolfgang Moroder',  license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Santa_Maria_della_Salute_from_Hotel_Monaco_nightview.jpg' },
  23: { author: 'Didier Descouens',  license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Campo_Santa_Margherita_(Venice).jpg' },
  24: { author: 'Wolfgang Moroder',  license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:The_squero_San_Trovaso_and_church_in_Venice.JPG' },
  25: { author: 'Karlheinz Nast', license: 'CC0', url: 'https://www.flickr.com/photos/157371708@N03/52781134399/' },
  28: { author: 'Didier Descouens',  license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Palazzo_Fortuny,_gi%C3%A0_Pesaro_Orfei.jpg' },
  31: { author: 'Miguel Mendez',     license: 'CC BY 2.0',    url: 'https://commons.wikimedia.org/wiki/File:Glass_blowing_in_the_Murano_island_(14023312236).jpg' },
  32: { author: 'Jorge Franganillo', license: 'CC BY 2.0',    url: 'https://commons.wikimedia.org/wiki/File:Canal_and_colourful_houses_in_Burano_(50416720362).jpg' },
  33: { author: 'Sailko',            license: 'CC BY 3.0',    url: 'https://commons.wikimedia.org/wiki/File:Torcello,_cattedrale_di_santa_maria_assunta,_interno_02.jpg' },
  34: { author: 'Sailko',            license: 'CC BY 3.0',    url: 'https://commons.wikimedia.org/wiki/File:Murano,_palazzo_giustinian_(museo_del_vetro),_cortile,_lapidario_01.jpg' },
  36: { author: 'Sailko',            license: 'CC BY 3.0',    url: 'https://commons.wikimedia.org/wiki/File:Tovaglia_in_merletto_di_burano,_xviii_secolo.jpg' },
  38: { author: 'Zairon',            license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Venezia_Cattedrale_di_Santa_Maria_Assunta_%26_Chiesa_di_Santa_Fosca_1.jpg' },
  39: { author: 'Sailko',            license: 'CC BY 3.0',    url: 'https://commons.wikimedia.org/wiki/File:Torcello,_locanda_cipriani.jpg' },
  40: { author: 'Pietro Tessarin',   license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:La_Fenice_Opera_House_from_the_stage.jpg' }
};

// Build the credit anchor HTML for a place id (returns '' if none).
function photoCreditHtml(id){
  var c = (typeof PHOTO_CREDITS !== 'undefined') ? PHOTO_CREDITS[id] : null;
  if(!c || !c.author) return '';
  var label = 'Photo: ' + c.author + (c.license ? ' — ' + c.license : '');
  var href  = c.url || '#';
  return '<a href="' + href + '" target="_blank" rel="noopener nofollow">' + label + '</a>';
}
