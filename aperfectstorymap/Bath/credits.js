// ── Photo attribution per place id ──────────────────────────────
// A Perfect Story Map — Bridgerton in Bath (concept demo)
// This sample ships image-light: cards use clean emoji placeholders so the
// demo carries zero image-licensing risk. When photos are added, list each
// one here as { author, license, url } (Wikimedia Commons / CC only), keyed
// by place id, and drop the matching images/place-<id>.jpg files in.
const PHOTO_CREDITS = {};

// Build the credit anchor HTML for a place id (returns '' if none).
function photoCreditHtml(id){
  var c = (typeof PHOTO_CREDITS !== 'undefined') ? PHOTO_CREDITS[id] : null;
  if(!c || !c.author) return '';
  var label = 'Photo: ' + c.author + (c.license ? ' — ' + c.license : '');
  var href  = c.url || '#';
  return '<a href="' + href + '" target="_blank" rel="noopener nofollow">' + label + '</a>';
}
