// ── Photo attribution per place id ──────────────────────────────
// A Perfect Story Map — Shantaram (concept demo)
// No images shipped yet. When images are added (Wikimedia Commons or
// venue permission, same workflow as the city guides), add one entry
// per image here:
//   author  : photographer name shown in the card
//   license : short license name (e.g. "CC BY-SA 4.0", "CC BY 3.0")
//   url     : link to the source page (where author + license are stated)
// Images with no entry here show no credit line.
const PHOTO_CREDITS = {
};

// Build the credit anchor HTML for a place id (returns '' if none).
function photoCreditHtml(id){
  var c = (typeof PHOTO_CREDITS !== 'undefined') ? PHOTO_CREDITS[id] : null;
  if(!c || !c.author) return '';
  var label = 'Photo: ' + c.author + (c.license ? ' — ' + c.license : '');
  var href  = c.url || '#';
  return '<a href="' + href + '" target="_blank" rel="noopener nofollow">' + label + '</a>';
}
