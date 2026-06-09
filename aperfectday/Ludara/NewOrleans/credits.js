// ── Photo attribution per place id (New Orleans) ──
// TO BE FILLED IN (planned for tomorrow).
// One entry per image that needs crediting:
//   CC image  : { author: 'Name', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:...' }
//   venue     : { author: 'Venue Name', license: '', url: 'https://venue-site.com', venue:true }
// Empty entries show no credit line, so the guide works fine until these are added.
const PHOTO_CREDITS = {
  // 1: { author: '', license: '', url: '' },
};

// Build the credit anchor HTML for a place id (returns '' if none).
function photoCreditHtml(id){
  var c = (typeof PHOTO_CREDITS !== 'undefined') ? PHOTO_CREDITS[id] : null;
  if(!c || !c.author) return '';
  var label = 'Photo: ' + c.author + (c.license ? ' — ' + c.license : '');
  var href  = c.url || '#';
  return '<a href="' + href + '" target="_blank" rel="noopener nofollow">' + label + '</a>';
}
