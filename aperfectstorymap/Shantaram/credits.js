// ── Photo attribution per place id ──────────────────────────────
// A Perfect Story Map — Shantaram (concept demo)
// All images from Wikimedia Commons, verified July 6, 2026.
//   author  : photographer name shown in the card
//   license : short license name (e.g. "CC BY-SA 4.0", "CC BY 3.0")
//   url     : link to the source page (where author + license are stated)
// Images with no entry here show no credit line.
// id 8 (Arthur Road Prison): Commons has no photo of the prison itself,
// so the card uses a SYMBOLIC image (old jail window bars, Greensboro GA)
// labeled as such in the credit line.
const PHOTO_CREDITS = {
  1:  { author: 'Antony Antony',        license: 'CC BY 2.0',    url: 'https://commons.wikimedia.org/wiki/File:Leopold_Cafe_old.jpg' },
  2:  { author: 'Sauban96',             license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Gateway_of_India_from_sea.jpg' },
  3:  { author: 'Joe Ravi',             license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Main_Dome_of_Taj_Mahal_Palace_Hotel.jpg' },
  4:  { author: 'Rakesh from Bangalore', license: 'CC BY-SA 2.0', url: 'https://commons.wikimedia.org/wiki/File:Hutments_next_to_Bandra_Station_(289437803).jpg' },
  5:  { author: 'Dr Vikramjit Kakati',  license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Marine_Lines_Mumbai_2021.jpg' },
  6:  { author: 'Vyacheslav Argenberg', license: 'CC BY 4.0',    url: 'https://commons.wikimedia.org/wiki/File:Mumbai,_India,_Sunset_over_Haji_Ali_Dargah_Mosque.jpg' },
  7:  { author: 'Christian Haugen',     license: 'CC BY 2.0',    url: 'https://commons.wikimedia.org/wiki/File:Victoria_Terminus_Mumbai_angular_view.jpg' },
  8:  { author: 'Swall12345 (symbolic image)', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Old_Green_County_%22Gaol%22,_Greensboro,_Georgia,_Window_Bars.jpg' },
  9:  { author: 'Parminder Sarwara',    license: 'CC0',          url: 'https://commons.wikimedia.org/wiki/File:Film_City,_Mumbai.jpg' },
  10: { author: 'Shagil Kannur',        license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Paddy_field_in_Maharashtra_9.jpg' },
  11: { author: 'Mark Ray',             license: 'Public domain', url: 'https://commons.wikimedia.org/wiki/File:Arghandab_River_Valley_between_Kandahar_and_Lashkar_Gah.jpg' },
};

// Build the credit anchor HTML for a place id (returns '' if none).
function photoCreditHtml(id){
  var c = (typeof PHOTO_CREDITS !== 'undefined') ? PHOTO_CREDITS[id] : null;
  if(!c || !c.author) return '';
  var label = 'Photo: ' + c.author + (c.license ? ' — ' + c.license : '');
  var href  = c.url || '#';
  return '<a href="' + href + '" target="_blank" rel="noopener nofollow">' + label + '</a>';
}
